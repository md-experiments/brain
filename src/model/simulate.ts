import { PROCESSES, weightFor } from './processes';
import type { Profile } from './profiles';
import { REGION_BY_ID, UNITS } from './regions';
import type { Scenario, ScenarioEvent } from './scenarios';

/**
 * Stateless activity model: the activity of every region at time t is a pure
 * function of the scenario and the profile, so the timeline can be scrubbed
 * freely and two profiles can be compared at the same instant.
 *
 * Output values are schematic "relative engagement" in 0–1. They are not
 * predictions of BOLD signal or firing rates.
 */

const RISE = 0.45; // s
const TAIL = 1.3; // s, non-affective decay
const AFFECT_TAIL = 3.6; // s, affective decay for a typical responder
const DMN_REST = 0.3; // default-network drive when nothing external is happening
const DMN_REGIONS = ['mpfc', 'pcc', 'angular'];
const AMYGDALA_DAMPING = 0.45; // max share of amygdala drive removed by regulation

function envelope(ev: ScenarioEvent, t: number, tail: number): number {
  if (t < ev.t) return 0;
  const end = ev.t + ev.dur;
  if (t <= end) return 1 - Math.exp(-(t - ev.t) / RISE);
  return (1 - Math.exp(-ev.dur / RISE)) * Math.exp(-(t - end) / tail);
}

export function isSensitive(ev: ScenarioEvent, profile: Profile): boolean {
  return !!ev.topics?.some((topic) => profile.sensitiveTopics.includes(topic));
}

/** Strength with which each process is engaged at time t. */
export function processLevels(scenario: Scenario, profile: Profile, t: number): Record<string, number> {
  const levels: Record<string, number> = {};
  for (const ev of scenario.events) {
    if (t < ev.t) continue;
    const sensitive = isSensitive(ev, profile);
    for (const [pid, intensity] of ev.processes) {
      const proc = PROCESSES[pid];
      const tail = proc.affective ? AFFECT_TAIL * profile.affectTail : TAIL;
      const e = envelope(ev, t, tail);
      if (e < 0.004) continue;
      const gain = (profile.processGain[pid] ?? 1) * (proc.affective && sensitive ? profile.topicGain : 1);
      levels[pid] = (levels[pid] ?? 0) + intensity * e * gain;
    }
  }
  return levels;
}

const saturate = (x: number) => 1 - Math.exp(-0.8 * x);

export type Activity = Record<string, number>;

export function simulate(scenario: Scenario, profile: Profile, t: number): Activity {
  const levels = processLevels(scenario, profile, t);

  let externalLoad = 0;
  for (const pid in levels) if (PROCESSES[pid].external) externalLoad = Math.max(externalLoad, levels[pid]);
  const rest = DMN_REST * (1 - 0.8 * Math.min(1, externalLoad));
  const damping = 1 - AMYGDALA_DAMPING * Math.min(1, (levels.regulation ?? 0) * profile.regulationEfficacy);

  const out: Activity = {};
  for (const unit of UNITS) {
    let drive = 0;
    for (const pid in levels) drive += levels[pid] * weightFor(PROCESSES[pid].regions[unit.region.id], unit.hemi);
    if (DMN_REGIONS.includes(unit.region.id)) drive += rest;
    if (unit.region.id === 'amygdala') drive *= damping;
    out[unit.id] = saturate(drive * (profile.regionGain[unit.region.id] ?? 1));
  }
  return out;
}

/** Peak activity of a region across its hemispheres, with the dominant side. */
export function regionPeak(activity: Activity, regionId: string): { value: number; L: number; R: number; M: number } {
  const L = activity[`${regionId}:L`] ?? 0;
  const R = activity[`${regionId}:R`] ?? 0;
  const M = activity[`${regionId}:M`] ?? 0;
  return { value: Math.max(L, R, M), L, R, M };
}

/** Which processes are currently driving a region, strongest first. */
export function contributors(scenario: Scenario, profile: Profile, t: number, regionId: string): { pid: string; share: number }[] {
  const levels = processLevels(scenario, profile, t);
  const rows: { pid: string; share: number }[] = [];
  for (const pid in levels) {
    const w = PROCESSES[pid].regions[regionId];
    const peak = Math.max(weightFor(w, 'L'), weightFor(w, 'R'), weightFor(w, 'M'));
    if (levels[pid] * peak > 0.04) rows.push({ pid, share: levels[pid] * peak });
  }
  return rows.sort((a, b) => b.share - a.share);
}

type Contribution = { ev: ScenarioEvent; pid: string; v: number };

/** Every (event, process) pair active at time t, with its current strength. */
function contributions(scenario: Scenario, profile: Profile, t: number): Contribution[] {
  const out: Contribution[] = [];
  for (const ev of scenario.events) {
    if (t < ev.t) continue;
    const sensitive = isSensitive(ev, profile);
    for (const [pid, intensity] of ev.processes) {
      const proc = PROCESSES[pid];
      const tail = proc.affective ? AFFECT_TAIL * profile.affectTail : TAIL;
      const gain = (profile.processGain[pid] ?? 1) * (proc.affective && sensitive ? profile.topicGain : 1);
      const v = intensity * envelope(ev, t, tail) * gain;
      if (v > 0.02) out.push({ ev, pid, v });
    }
  }
  return out;
}

/**
 * Everyday phrase for this region's own part in what is happening right now.
 * Several regions are usually active together, each doing something different:
 * during a fright the amygdala detects the danger while the hypothalamus speeds
 * the heart. The phrase comes from the process currently driving the region most.
 */
export function meaning(scenario: Scenario, profile: Profile, t: number, regionId: string, hemi?: 'L' | 'R' | 'M'): string {
  let best = '';
  let bestV = 0.03;
  for (const { pid, v } of contributions(scenario, profile, t)) {
    const proc = PROCESSES[pid];
    const w = proc.regions[regionId];
    const weight = hemi ? weightFor(w, hemi) : Math.max(weightFor(w, 'L'), weightFor(w, 'R'), weightFor(w, 'M'));
    if (v * weight > bestV) {
      bestV = v * weight;
      best = proc.roles?.[regionId] ?? REGION_BY_ID[regionId].job;
    }
  }
  if (!best && DMN_REGIONS.includes(regionId)) return 'idling: mind at rest';
  return best;
}

/** The overall feeling right now, as named by the scenario (e.g. "grief"), or '' if none. */
export function feelingNow(scenario: Scenario, profile: Profile, t: number): string {
  let best = '';
  let bestV = 0.12;
  for (const { ev, pid, v } of contributions(scenario, profile, t)) {
    if (ev.feeling && PROCESSES[pid].affective && v > bestV) {
      bestV = v;
      best = ev.feeling;
    }
  }
  return best;
}
