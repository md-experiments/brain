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
  /** Everyday name for the feeling in this event (e.g. 'grief'), shown on the brain. */
  feeling?: string;
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
      { t: 10, dur: 3, kind: 'thought', text: 'This is about the outage.', processes: [['self', 0.5], ['episodic', 0.35], ['threat', 0.25]], topics: ['criticism'], feeling: 'dread' },
      { t: 14, dur: 5, kind: 'heard', speaker: 'Dana', text: 'The rollback took four hours. Customers noticed — and frankly, so did leadership.', processes: [['speech_comprehension', 1], ['negative_affect', 0.45], ['threat', 0.4]], topics: ['criticism'], feeling: 'unease' },
      { t: 20, dur: 4, kind: 'emotion', text: 'A jolt of alarm. Chest tightens, face warms.', processes: [['threat', 0.8], ['arousal', 0.8], ['negative_affect', 0.5]], topics: ['criticism'], feeling: 'alarm' },
      { t: 25, dur: 4, kind: 'memory', text: 'Last year’s review, the same room: “needs to raise problems earlier.”', processes: [['episodic', 0.95], ['imagery', 0.4], ['negative_affect', 0.4]], topics: ['criticism'], feeling: 'sting of memory' },
      { t: 30, dur: 4, kind: 'thought', text: 'Does she think I’m not up to this?', processes: [['self', 0.8], ['mentalizing', 0.75], ['negative_affect', 0.4]], topics: ['criticism'], feeling: 'self-doubt' },
      { t: 35, dur: 5, kind: 'thought', text: 'Slow down. She’s describing the incident, not passing judgement on me.', processes: [['regulation', 0.95], ['mentalizing', 0.4]] },
      { t: 41, dur: 5, kind: 'heard', speaker: 'Dana', text: 'I’m not here to assign blame. I want to understand what you’d change.', processes: [['speech_comprehension', 0.95], ['mentalizing', 0.5], ['regulation', 0.3]] },
      { t: 47, dur: 5, kind: 'thought', text: 'Work it through: the alert fired late, and the runbook was out of date.', processes: [['working_memory', 0.95], ['episodic', 0.45]] },
      { t: 53, dur: 6, kind: 'spoken', speaker: 'You', text: 'The alert threshold was too loose. I’d add a staged rollout, and I’ll own the runbook update.', processes: [['speech_production', 1], ['working_memory', 0.5]] },
      { t: 60, dur: 4, kind: 'heard', speaker: 'Dana', text: 'That’s exactly the kind of ownership I was hoping to hear.', processes: [['speech_comprehension', 0.85], ['reward', 0.7]], feeling: 'feeling valued' },
      { t: 65, dur: 4, kind: 'emotion', text: 'Relief. Your shoulders drop.', processes: [['reward', 0.65], ['self', 0.3]], feeling: 'relief' },
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
      { t: 16, dur: 6, kind: 'memory', text: 'The dock at dusk. Wet towels, the radio, everyone laughing.', processes: [['episodic', 1], ['imagery', 0.8], ['reward', 0.4]], feeling: 'fondness' },
      { t: 23, dur: 4, kind: 'emotion', text: 'Warmth, and underneath it a quiet ache.', processes: [['reward', 0.6], ['negative_affect', 0.25], ['self', 0.4]], feeling: 'nostalgia' },
      { t: 28, dur: 6, kind: 'read', text: 'I’m sorry I went quiet after the funeral. I didn’t know what to say.', processes: [['reading', 1], ['mentalizing', 0.55], ['negative_affect', 0.3]], topics: ['loss'], feeling: 'sadness' },
      { t: 35, dur: 5, kind: 'memory', text: 'The church car park. Looking for them afterwards and not finding them.', processes: [['episodic', 0.9], ['imagery', 0.6], ['negative_affect', 0.6]], topics: ['loss'], feeling: 'grief' },
      { t: 41, dur: 5, kind: 'emotion', text: 'Grief resurfaces. Throat tight, eyes stinging.', processes: [['negative_affect', 0.9], ['arousal', 0.5], ['threat', 0.2]], topics: ['loss'], feeling: 'grief' },
      { t: 47, dur: 6, kind: 'thought', text: 'They were grieving too. The silence wasn’t indifference.', processes: [['mentalizing', 0.9], ['regulation', 0.75]] },
      { t: 54, dur: 5, kind: 'read', text: 'I’m in town in March. Could we get a coffee?', processes: [['reading', 0.9], ['reward', 0.5]], feeling: 'anticipation' },
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
      { t: 12, dur: 3, kind: 'heard', text: 'Footsteps behind you, getting quicker.', processes: [['auditory', 1], ['orienting', 0.85], ['threat', 0.45], ['locomotion', 0.5]], topics: ['threat'], feeling: 'unease' },
      { t: 16, dur: 4, kind: 'emotion', text: 'Startle. Heart rate jumps; attention narrows.', processes: [['threat', 1], ['arousal', 1], ['orienting', 0.6]], topics: ['threat'], feeling: 'fear' },
      { t: 21, dur: 2, kind: 'action', text: 'You glance back over your shoulder.', processes: [['locomotion', 0.7], ['vision', 0.7], ['orienting', 0.5]] },
      { t: 24, dur: 3, kind: 'seen', text: 'A figure under the streetlight. A face, half in shadow.', processes: [['face', 1], ['vision', 0.8], ['threat', 0.6]], topics: ['threat'], feeling: 'fear' },
      { t: 28, dur: 3, kind: 'memory', text: 'It’s the neighbour from number twelve.', processes: [['face', 0.6], ['semantic', 0.7], ['episodic', 0.6]] },
      { t: 32, dur: 5, kind: 'heard', speaker: 'Neighbour', text: 'Sorry! Didn’t mean to make you jump — you dropped your glove.', processes: [['speech_comprehension', 1], ['face', 0.4], ['mentalizing', 0.4]] },
      { t: 38, dur: 4, kind: 'emotion', text: 'Relief washes through. A short laugh.', processes: [['reward', 0.55], ['regulation', 0.5]], feeling: 'relief' },
      { t: 43, dur: 4, kind: 'spoken', speaker: 'You', text: 'Oh — thank you. I hadn’t even noticed.', processes: [['speech_production', 1]] },
      { t: 48, dur: 3, kind: 'action', text: 'You take the glove. Cold, damp wool.', processes: [['touch', 0.95], ['motor_hand', 0.7]] },
      { t: 52, dur: 5, kind: 'thought', text: 'Heart’s still going. Strange how fast that happens.', processes: [['self', 0.7], ['arousal', 0.3]], feeling: 'after-shock' },
    ],
  },
  {
    id: 'nearmiss',
    title: 'A near miss on the road',
    setting: 'Driving home on a familiar route, late afternoon.',
    duration: 62,
    events: [
      { t: 1, dur: 4, kind: 'action', text: 'Hands on the wheel, easing through traffic you know by heart.', processes: [['motor_hand', 0.7], ['scene', 0.7], ['vision', 0.7]] },
      { t: 6, dur: 5, kind: 'heard', text: 'The radio murmurs in the background; a song you half know.', processes: [['music', 0.7], ['scene', 0.5], ['motor_hand', 0.4]] },
      { t: 12, dur: 4, kind: 'thought', text: 'Did I reply to that email? I’ll do it tonight.', processes: [['self', 0.8], ['episodic', 0.4], ['motor_hand', 0.3]] },
      { t: 17, dur: 2, kind: 'seen', text: 'A cyclist swerves out from between parked cars.', processes: [['vision', 1], ['orienting', 1], ['threat', 0.7]], topics: ['threat'], feeling: 'alarm' },
      { t: 19.5, dur: 2, kind: 'action', text: 'Your foot hits the brake before you have decided to.', processes: [['locomotion', 1], ['motor_hand', 0.8], ['threat', 0.8]], topics: ['threat'], feeling: 'alarm' },
      { t: 22, dur: 5, kind: 'emotion', text: 'The car stops a metre short. Pulse hammering, hands tingling.', processes: [['threat', 0.9], ['arousal', 1], ['touch', 0.4]], topics: ['threat'], feeling: 'fear' },
      { t: 28, dur: 3, kind: 'seen', text: 'The cyclist looks back, wide-eyed, and raises a hand.', processes: [['face', 0.9], ['vision', 0.7], ['mentalizing', 0.6]] },
      { t: 32, dur: 4, kind: 'emotion', text: 'A flash of anger: he could have been killed.', processes: [['negative_affect', 0.8], ['arousal', 0.6], ['mentalizing', 0.4]], feeling: 'anger' },
      { t: 37, dur: 5, kind: 'thought', text: 'He’s fine. Nobody’s hurt. Breathe out.', processes: [['regulation', 0.95], ['self', 0.3]] },
      { t: 43, dur: 4, kind: 'memory', text: 'Your own bike, years ago, and a car door opening.', processes: [['episodic', 0.9], ['imagery', 0.6], ['negative_affect', 0.3]], feeling: 'old fright' },
      { t: 48, dur: 5, kind: 'action', text: 'You check the mirror, signal, and pull away slowly.', processes: [['motor_hand', 0.8], ['vision', 0.8], ['working_memory', 0.5], ['scene', 0.5]] },
      { t: 54, dur: 5, kind: 'thought', text: 'Still shaky. Radio off for the rest of the way.', processes: [['self', 0.6], ['arousal', 0.35], ['decision', 0.4]], feeling: 'after-shock' },
    ],
  },
  {
    id: 'menu',
    title: 'Choosing what to order',
    setting: 'A restaurant with a friend. You are hungry and trying to eat a bit better.',
    duration: 60,
    events: [
      { t: 1, dur: 5, kind: 'read', text: 'Slow-braised short rib, mashed potato, red wine jus.', processes: [['reading', 0.9], ['semantic', 0.6], ['reward', 0.5]], feeling: 'craving' },
      { t: 7, dur: 4, kind: 'memory', text: 'The last time you had it here: rich, falling apart.', processes: [['episodic', 0.85], ['imagery', 0.5], ['reward', 0.6]], feeling: 'craving' },
      { t: 12, dur: 4, kind: 'read', text: 'Grilled sea bass, fennel, lemon.', processes: [['reading', 0.9], ['semantic', 0.5], ['decision', 0.4]] },
      { t: 17, dur: 5, kind: 'thought', text: 'The fish is the sensible one. But the short rib…', processes: [['decision', 1], ['working_memory', 0.5], ['reward', 0.4]], feeling: 'temptation' },
      { t: 23, dur: 4, kind: 'thought', text: 'You said you’d cut back this month.', processes: [['regulation', 0.8], ['self', 0.6], ['decision', 0.6]] },
      { t: 28, dur: 4, kind: 'heard', speaker: 'Sam', text: 'I’m getting the short rib. Share a starter?', processes: [['speech_comprehension', 0.95], ['mentalizing', 0.4], ['reward', 0.3]], feeling: 'temptation' },
      { t: 33, dur: 4, kind: 'seen', text: 'A plate goes past to the next table, steaming.', processes: [['vision', 0.9], ['orienting', 0.6], ['reward', 0.7]], feeling: 'craving' },
      { t: 38, dur: 5, kind: 'thought', text: 'Fish tonight. Short rib on your birthday.', processes: [['decision', 1], ['regulation', 0.6], ['self', 0.4]] },
      { t: 44, dur: 4, kind: 'spoken', speaker: 'You', text: 'Sea bass for me, please. And yes to the starter.', processes: [['speech_production', 1], ['face', 0.4]] },
      { t: 49, dur: 3, kind: 'action', text: 'You close the menu and hand it over.', processes: [['motor_hand', 0.85], ['touch', 0.4]] },
      { t: 53, dur: 5, kind: 'emotion', text: 'Quietly pleased with yourself.', processes: [['reward', 0.6], ['self', 0.5]], feeling: 'satisfaction' },
    ],
  },
  {
    id: 'song',
    title: 'A song from years ago',
    setting: 'In a café, working. The playlist changes.',
    duration: 62,
    events: [
      { t: 1, dur: 5, kind: 'action', text: 'Typing; half a mind on the spreadsheet.', processes: [['motor_hand', 0.8], ['reading', 0.6], ['working_memory', 0.6]] },
      { t: 7, dur: 4, kind: 'heard', text: 'Opening chords from the speakers. Something familiar.', processes: [['music', 0.9], ['orienting', 0.6]] },
      { t: 12, dur: 4, kind: 'memory', text: 'You know this before you can name it.', processes: [['music', 0.8], ['semantic', 0.6], ['episodic', 0.5]] },
      { t: 17, dur: 6, kind: 'memory', text: 'A car with the windows down, summer you were nineteen, singing badly.', processes: [['episodic', 1], ['imagery', 0.8], ['music', 0.6], ['reward', 0.5]], feeling: 'fondness' },
      { t: 24, dur: 5, kind: 'emotion', text: 'The chorus lands. Goosebumps along your arms.', processes: [['music', 1], ['reward', 1], ['arousal', 0.5]], feeling: 'thrill' },
      { t: 30, dur: 4, kind: 'action', text: 'Your foot is tapping. You hadn’t noticed.', processes: [['music', 0.8], ['locomotion', 0.6]] },
      { t: 35, dur: 5, kind: 'thought', text: 'Where is everyone from that summer now?', processes: [['self', 0.8], ['mentalizing', 0.6], ['episodic', 0.5], ['negative_affect', 0.25]], feeling: 'wistfulness' },
      { t: 41, dur: 5, kind: 'emotion', text: 'Happy and a little sad at once.', processes: [['reward', 0.6], ['negative_affect', 0.4], ['music', 0.6]], feeling: 'nostalgia' },
      { t: 47, dur: 4, kind: 'thought', text: 'You could message Priya. It’s been too long.', processes: [['decision', 0.7], ['mentalizing', 0.5], ['self', 0.4]] },
      { t: 52, dur: 4, kind: 'action', text: 'You pick up your phone and start typing.', processes: [['motor_hand', 0.9], ['reading', 0.4], ['speech_production', 0.3]] },
      { t: 57, dur: 4, kind: 'heard', text: 'The song fades into the next one.', processes: [['music', 0.5], ['reward', 0.3]], feeling: 'contentment' },
    ],
  },
  {
    id: 'toast',
    title: 'Giving a toast',
    setting: 'Your sister’s wedding. Sixty guests, and it is your turn to speak.',
    duration: 70,
    events: [
      { t: 1, dur: 4, kind: 'heard', speaker: 'MC', text: 'And now, a few words from the bride’s sibling.', processes: [['speech_comprehension', 0.9], ['orienting', 0.7], ['threat', 0.4]], topics: ['scrutiny'], feeling: 'nerves' },
      { t: 6, dur: 4, kind: 'action', text: 'You stand. The chair scrapes; the glass is cold in your hand.', processes: [['locomotion', 0.8], ['touch', 0.7], ['motor_hand', 0.5]] },
      { t: 11, dur: 4, kind: 'seen', text: 'Sixty faces turn towards you.', processes: [['face', 1], ['vision', 0.8], ['threat', 0.6], ['mentalizing', 0.5]], topics: ['scrutiny'], feeling: 'stage fright' },
      { t: 16, dur: 4, kind: 'emotion', text: 'Dry mouth. Heart thudding in your ears.', processes: [['threat', 0.7], ['arousal', 0.9]], topics: ['scrutiny'], feeling: 'stage fright' },
      { t: 21, dur: 3, kind: 'thought', text: 'What was the first line?', processes: [['episodic', 0.8], ['working_memory', 0.7], ['threat', 0.4]], topics: ['scrutiny'], feeling: 'panic' },
      { t: 25, dur: 4, kind: 'seen', text: 'Your sister catches your eye and grins.', processes: [['face', 0.9], ['reward', 0.6], ['mentalizing', 0.5]], feeling: 'reassurance' },
      { t: 30, dur: 4, kind: 'thought', text: 'These people want this to go well. Just talk to her.', processes: [['regulation', 0.9], ['mentalizing', 0.6]] },
      { t: 35, dur: 7, kind: 'spoken', speaker: 'You', text: 'When we were kids, Maya charged me rent to sit in her treehouse.', processes: [['speech_production', 1], ['episodic', 0.6], ['working_memory', 0.4]] },
      { t: 43, dur: 4, kind: 'heard', text: 'The room laughs.', processes: [['auditory', 0.9], ['reward', 0.9], ['mentalizing', 0.4]], feeling: 'delight' },
      { t: 48, dur: 6, kind: 'memory', text: 'The treehouse, the biscuit tin of coins, her serious face.', processes: [['episodic', 1], ['imagery', 0.8], ['reward', 0.5]], feeling: 'fondness' },
      { t: 55, dur: 6, kind: 'spoken', speaker: 'You', text: 'She has been looking after me ever since. To Maya and Jon.', processes: [['speech_production', 1], ['negative_affect', 0.3], ['reward', 0.5]], feeling: 'tenderness' },
      { t: 62, dur: 3, kind: 'action', text: 'You raise the glass.', processes: [['motor_hand', 0.9], ['vision', 0.4]] },
      { t: 65, dur: 4, kind: 'emotion', text: 'Applause. Your legs are shaking, and you are smiling.', processes: [['reward', 0.9], ['arousal', 0.4], ['auditory', 0.6]], feeling: 'relief and pride' },
    ],
  },
];

export const SCENARIO_BY_ID: Record<string, Scenario> = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]));
