import { useEffect, useRef } from 'react';
import { BookOpen, Brain, Ear, Eye, Hand, HeartPulse, History, Speech, TriangleAlert, type LucideIcon } from 'lucide-react';
import { PROCESSES } from '../model/processes';
import { TOPIC_LABEL, type Profile } from '../model/profiles';
import type { EventKind, Scenario } from '../model/scenarios';
import { isSensitive } from '../model/simulate';

export const KIND_META: Record<EventKind, { label: string; icon: LucideIcon }> = {
  heard: { label: 'Heard', icon: Ear },
  spoken: { label: 'Spoken', icon: Speech },
  read: { label: 'Read', icon: BookOpen },
  seen: { label: 'Seen', icon: Eye },
  thought: { label: 'Thought', icon: Brain },
  memory: { label: 'Memory', icon: History },
  emotion: { label: 'Emotion', icon: HeartPulse },
  action: { label: 'Action', icon: Hand },
};

export function formatTime(t: number): string {
  const s = Math.max(0, Math.floor(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

interface Props {
  scenario: Scenario;
  time: number;
  profiles: Profile[];
  onSeek: (t: number) => void;
}

export default function EventLog({ scenario, time, profiles, onSeek }: Props) {
  const listRef = useRef<HTMLOListElement>(null);
  let current = -1;
  scenario.events.forEach((ev, i) => {
    if (time >= ev.t) current = i;
  });

  useEffect(() => {
    const el = listRef.current?.children[current] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [current, scenario.id]);

  return (
    <ol className="event-log" ref={listRef}>
      {scenario.events.map((ev, i) => {
        const meta = KIND_META[ev.kind];
        const Icon = meta.icon;
        const state = time < ev.t ? 'future' : time <= ev.t + ev.dur ? 'active' : 'past';
        const sensitiveFor = profiles.filter((p) => isSensitive(ev, p));
        const quoted = ev.kind === 'heard' && ev.speaker ? true : ev.kind === 'spoken' || ev.kind === 'read';
        return (
          <li key={i} className={`event kind-${ev.kind} is-${state}`}>
            <button type="button" onClick={() => onSeek(ev.t)} aria-current={state === 'active'}>
              <span className="event-icon">
                <Icon size={15} strokeWidth={1.75} />
              </span>
              <span className="event-body">
                <span className="event-head">
                  <span className="event-kind">{meta.label}</span>
                  {ev.speaker && <span className="event-speaker">{ev.speaker}</span>}
                  <span className="event-time">{formatTime(ev.t)}</span>
                </span>
                <span className="event-text">{quoted ? `“${ev.text}”` : ev.text}</span>
                <span className="event-tags">
                  {ev.processes.map(([pid]) => (
                    <span key={pid} className="tag">
                      {PROCESSES[pid].label}
                    </span>
                  ))}
                </span>
                {sensitiveFor.length > 0 && (
                  <span className="event-flag">
                    <TriangleAlert size={12} strokeWidth={2} />
                    {TOPIC_LABEL[ev.topics!.find((t) => sensitiveFor[0].sensitiveTopics.includes(t))!]} — amplified for{' '}
                    {sensitiveFor.map((p) => p.name.split(' (')[0].toLowerCase()).join(', ')}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
