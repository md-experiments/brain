export type EventKind = 'heard' | 'spoken' | 'read' | 'seen' | 'thought' | 'memory' | 'emotion' | 'action';

export interface ScenarioEvent {
  /** Onset and duration in seconds. */
  t: number;
  dur: number;
  kind: EventKind;
  speaker?: string;
  text: string;
  /** [process id, intensity 0–1] */
  processes: [string, number][];
  topics?: string[];
}

export interface Scenario {
  id: string;
  title: string;
  setting: string;
  duration: number;
  events: ScenarioEvent[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'review',
    title: 'A difficult conversation',
    setting: 'A one-to-one with your manager, a week after a failed product launch.',
    duration: 72,
    events: [
      { t: 1, dur: 3, kind: 'seen', text: 'Dana closes her laptop and looks up at you.', processes: [['vision', 0.6], ['face', 0.85]] },
      { t: 5, dur: 4, kind: 'heard', speaker: 'Dana', text: 'Thanks for making time. I want to talk about the launch last week.', processes: [['speech_comprehension', 0.9], ['face', 0.4]] },
      { t: 10, dur: 3, kind: 'thought', text: 'This is about the outage.', processes: [['self', 0.5], ['episodic', 0.35], ['threat', 0.25]], topics: ['criticism'] },
      { t: 14, dur: 5, kind: 'heard', speaker: 'Dana', text: 'The rollback took four hours. Customers noticed — and frankly, so did leadership.', processes: [['speech_comprehension', 1], ['negative_affect', 0.45], ['threat', 0.4]], topics: ['criticism'] },
      { t: 20, dur: 4, kind: 'emotion', text: 'A jolt of alarm. Chest tightens, face warms.', processes: [['threat', 0.8], ['arousal', 0.8], ['negative_affect', 0.5]], topics: ['criticism'] },
      { t: 25, dur: 4, kind: 'memory', text: 'Last year’s review, the same room: “needs to raise problems earlier.”', processes: [['episodic', 0.95], ['imagery', 0.4], ['negative_affect', 0.4]], topics: ['criticism'] },
      { t: 30, dur: 4, kind: 'thought', text: 'Does she think I’m not up to this?', processes: [['self', 0.8], ['mentalizing', 0.75], ['negative_affect', 0.4]], topics: ['criticism'] },
      { t: 35, dur: 5, kind: 'thought', text: 'Slow down. She’s describing the incident, not passing judgement on me.', processes: [['regulation', 0.95], ['mentalizing', 0.4]] },
      { t: 41, dur: 5, kind: 'heard', speaker: 'Dana', text: 'I’m not here to assign blame. I want to understand what you’d change.', processes: [['speech_comprehension', 0.95], ['mentalizing', 0.5], ['regulation', 0.3]] },
      { t: 47, dur: 5, kind: 'thought', text: 'Work it through: the alert fired late, and the runbook was out of date.', processes: [['working_memory', 0.95], ['episodic', 0.45]] },
      { t: 53, dur: 6, kind: 'spoken', speaker: 'You', text: 'The alert threshold was too loose. I’d add a staged rollout, and I’ll own the runbook update.', processes: [['speech_production', 1], ['working_memory', 0.5]] },
      { t: 60, dur: 4, kind: 'heard', speaker: 'Dana', text: 'That’s exactly the kind of ownership I was hoping to hear.', processes: [['speech_comprehension', 0.85], ['reward', 0.7]] },
      { t: 65, dur: 4, kind: 'emotion', text: 'Relief. Your shoulders drop.', processes: [['reward', 0.65], ['self', 0.3]] },
    ],
  },
  {
    id: 'letter',
    title: 'A letter from an old friend',
    setting: 'At home. A handwritten envelope has arrived from someone you lost touch with.',
    duration: 74,
    events: [
      { t: 1, dur: 3, kind: 'action', text: 'You pick the envelope off the mat and tear it open.', processes: [['motor_hand', 0.9], ['touch', 0.6], ['vision', 0.5]] },
      { t: 5, dur: 3, kind: 'seen', text: 'Handwriting you would know anywhere.', processes: [['vision', 0.7], ['reading', 0.4], ['semantic', 0.5]] },
      { t: 9, dur: 6, kind: 'read', text: 'It’s been eleven years since the lake house, and I still think about that summer.', processes: [['reading', 1], ['semantic', 0.4]] },
      { t: 16, dur: 6, kind: 'memory', text: 'The dock at dusk. Wet towels, the radio, everyone laughing.', processes: [['episodic', 1], ['imagery', 0.8], ['reward', 0.4]] },
      { t: 23, dur: 4, kind: 'emotion', text: 'Warmth, and underneath it a quiet ache.', processes: [['reward', 0.6], ['negative_affect', 0.25], ['self', 0.4]] },
      { t: 28, dur: 6, kind: 'read', text: 'I’m sorry I went quiet after the funeral. I didn’t know what to say.', processes: [['reading', 1], ['mentalizing', 0.55], ['negative_affect', 0.3]], topics: ['loss'] },
      { t: 35, dur: 5, kind: 'memory', text: 'The church car park. Looking for them afterwards and not finding them.', processes: [['episodic', 0.9], ['imagery', 0.6], ['negative_affect', 0.6]], topics: ['loss'] },
      { t: 41, dur: 5, kind: 'emotion', text: 'Grief resurfaces. Throat tight, eyes stinging.', processes: [['negative_affect', 0.9], ['arousal', 0.5], ['threat', 0.2]], topics: ['loss'] },
      { t: 47, dur: 6, kind: 'thought', text: 'They were grieving too. The silence wasn’t indifference.', processes: [['mentalizing', 0.9], ['regulation', 0.75]] },
      { t: 54, dur: 5, kind: 'read', text: 'I’m in town in March. Could we get a coffee?', processes: [['reading', 0.9], ['reward', 0.5]] },
      { t: 60, dur: 5, kind: 'thought', text: 'March… the fourteenth is free. The café by the station.', processes: [['working_memory', 0.75], ['self', 0.45], ['episodic', 0.35]] },
      { t: 66, dur: 4, kind: 'action', text: 'You reach for a pen.', processes: [['motor_hand', 0.85], ['vision', 0.4]] },
    ],
  },
  {
    id: 'night',
    title: 'Walking home at night',
    setting: 'A quiet residential street, a little after eleven.',
    duration: 60,
    events: [
      { t: 1, dur: 4, kind: 'seen', text: 'An empty street. Sodium lights on wet pavement.', processes: [['scene', 0.9], ['vision', 0.7], ['locomotion', 0.6]] },
      { t: 6, dur: 5, kind: 'thought', text: 'Your mind drifts: tomorrow’s deadline, what to cook.', processes: [['self', 0.95], ['locomotion', 0.5]] },
      { t: 12, dur: 3, kind: 'heard', text: 'Footsteps behind you, getting quicker.', processes: [['auditory', 1], ['orienting', 0.85], ['threat', 0.45], ['locomotion', 0.5]], topics: ['threat'] },
      { t: 16, dur: 4, kind: 'emotion', text: 'Startle. Heart rate jumps; attention narrows.', processes: [['threat', 1], ['arousal', 1], ['orienting', 0.6]], topics: ['threat'] },
      { t: 21, dur: 2, kind: 'action', text: 'You glance back over your shoulder.', processes: [['locomotion', 0.7], ['vision', 0.7], ['orienting', 0.5]] },
      { t: 24, dur: 3, kind: 'seen', text: 'A figure under the streetlight. A face, half in shadow.', processes: [['face', 1], ['vision', 0.8], ['threat', 0.6]], topics: ['threat'] },
      { t: 28, dur: 3, kind: 'memory', text: 'It’s the neighbour from number twelve.', processes: [['face', 0.6], ['semantic', 0.7], ['episodic', 0.6]] },
      { t: 32, dur: 5, kind: 'heard', speaker: 'Neighbour', text: 'Sorry! Didn’t mean to make you jump — you dropped your glove.', processes: [['speech_comprehension', 1], ['face', 0.4], ['mentalizing', 0.4]] },
      { t: 38, dur: 4, kind: 'emotion', text: 'Relief washes through. A short laugh.', processes: [['reward', 0.55], ['regulation', 0.5]] },
      { t: 43, dur: 4, kind: 'spoken', speaker: 'You', text: 'Oh — thank you. I hadn’t even noticed.', processes: [['speech_production', 1]] },
      { t: 48, dur: 3, kind: 'action', text: 'You take the glove. Cold, damp wool.', processes: [['touch', 0.95], ['motor_hand', 0.7]] },
      { t: 52, dur: 5, kind: 'thought', text: 'Heart’s still going. Strange how fast that happens.', processes: [['self', 0.7], ['arousal', 0.3]] },
    ],
  },
];

export const SCENARIO_BY_ID: Record<string, Scenario> = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]));
