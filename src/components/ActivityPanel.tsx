import { ArrowLeft } from 'lucide-react';
import { PROCESSES, type Evidence } from '../model/processes';
import type { Profile } from '../model/profiles';
import Citation from './Citation';
import { REGIONS, REGION_BY_ID } from '../model/regions';
import type { Scenario } from '../model/scenarios';
import { contributors, meaning, regionPeak, simulate } from '../model/simulate';

const EVIDENCE_LABEL: Record<Evidence, string> = {
  strong: 'Well established',
  moderate: 'Moderate evidence',
  debated: 'Interpretation debated',
};

interface Props {
  scenario: Scenario;
  profiles: Profile[];
  time: number;
  selected: string | null;
  onSelect: (id: string | null) => void;
}

function side(p: { L: number; R: number; M: number }): string {
  if (p.M > 0) return '';
  if (p.L > p.R * 1.35) return 'L';
  if (p.R > p.L * 1.35) return 'R';
  return 'L+R';
}

export default function ActivityPanel({ scenario, profiles, time, selected, onSelect }: Props) {
  const acts = profiles.map((p) => simulate(scenario, p, time));

  if (selected) {
    const region = REGION_BY_ID[selected];
    const rows = contributors(scenario, profiles[0], time, selected);
    const everUsed = Object.values(PROCESSES).filter((p) => p.regions[selected] !== undefined);
    const shown = rows.length ? rows.map((r) => PROCESSES[r.pid]) : everUsed;
    return (
      <div className="panel-scroll detail">
        <button type="button" className="back" onClick={() => onSelect(null)}>
          <ArrowLeft size={14} /> All regions
        </button>
        <h2>{region.name}</h2>
        <p className="detail-meta">{region.lobe}{region.deep ? ' · beneath the surface' : ''}</p>
        <p>{region.role}</p>
        <div className="detail-levels">
          {profiles.map((p, i) => {
            const peak = regionPeak(acts[i], selected);
            return (
              <div key={p.id} className="level-row">
                <span>{profiles.length > 1 ? p.name.split(' (')[0] : 'Engagement now'}</span>
                <span className={`bar bar-${i}`}><i style={{ width: `${peak.value * 100}%` }} /></span>
                <span className="num">{Math.round(peak.value * 100)}</span>
              </div>
            );
          })}
        </div>
        <h3>{rows.length ? 'Why it is active right now' : 'What engages this region'}</h3>
        {shown.map((proc) => (
          <section key={proc.id} className="basis">
            <header>
              <strong>{proc.label}</strong>
              <span className={`evidence evidence-${proc.evidence}`}>{EVIDENCE_LABEL[proc.evidence]}</span>
            </header>
            <p>{proc.basis}</p>
            <ul className="refs">
              {proc.refs.map((id) => (
                <Citation key={id} id={id} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  const ranked = REGIONS.map((r) => ({ r, peaks: acts.map((a) => regionPeak(a, r.id)) }))
    .map((x) => ({ ...x, top: Math.max(...x.peaks.map((p) => p.value)) }))
    .sort((a, b) => b.top - a.top);
  const active = ranked.filter((x) => x.top >= 0.12);
  const quiet = ranked.filter((x) => x.top < 0.12);

  return (
    <div className="panel-scroll">
      {profiles.length > 1 && (
        <div className="legend">
          {profiles.map((p, i) => (
            <span key={p.id}><i className={`swatch swatch-${i}`} />{p.name.split(' (')[0]}</span>
          ))}
        </div>
      )}
      <ul className="region-list">
        {active.map(({ r, peaks }) => (
          <li key={r.id}>
            <button type="button" onClick={() => onSelect(r.id)}>
              <span className="region-name">
                {r.short}
                <b>{meaning(scenario, profiles[0], time, r.id)}</b>
                <em>{side(peaks[0])}</em>
              </span>
              <span className="bars">
                {peaks.map((p, i) => (
                  <span key={i} className={`bar bar-${i}`}><i style={{ width: `${p.value * 100}%` }} /></span>
                ))}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {active.length === 0 && <p className="muted">Nothing strongly engaged yet. Press play.</p>}
      <h3>Quiet</h3>
      <div className="quiet">
        {quiet.map(({ r }) => (
          <button type="button" key={r.id} onClick={() => onSelect(r.id)}>{r.short}</button>
        ))}
      </div>
    </div>
  );
}
