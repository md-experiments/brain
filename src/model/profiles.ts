export interface Profile {
  id: string;
  name: string;
  summary: string;
  /** Multipliers on how strongly a region responds. */
  regionGain: Record<string, number>;
  /** Multipliers on how strongly a process is recruited. */
  processGain: Record<string, number>;
  /** How effectively regulation dampens the amygdala (1 = typical). */
  regulationEfficacy: number;
  /** How long affective responses linger (1 = typical). */
  affectTail: number;
  /** Topics that amplify this person's affective response. */
  sensitiveTopics: string[];
  topicGain: number;
  refs: string[];
}

export const PROFILES: Profile[] = [
  {
    id: 'typical',
    name: 'Typical responder',
    summary: 'Group-average pattern reported in the literature, with no trait adjustments.',
    regionGain: {},
    processGain: {},
    regulationEfficacy: 1,
    affectTail: 1,
    sensitiveTopics: [],
    topicGain: 1,
    refs: [],
  },
  {
    id: 'threat_sensitive',
    name: 'Threat-sensitive (high trait anxiety)',
    summary:
      'Stronger and longer-lasting amygdala and insula responses to threat and criticism, with less effective prefrontal dampening.',
    regionGain: { amygdala: 1.6, insula: 1.4, dacc: 1.25, hypothalamus: 1.3, pag: 1.3 },
    processGain: { threat: 1.25, negative_affect: 1.2, arousal: 1.25, reward: 0.85 },
    regulationEfficacy: 0.45,
    affectTail: 1.9,
    sensitiveTopics: ['criticism', 'threat'],
    topicGain: 1.45,
    refs: ['etkin2007', 'stein2007', 'bishop2007'],
  },
  {
    id: 'regulator',
    name: 'Habitual reappraiser',
    summary:
      'Readily reinterprets emotional events: more prefrontal engagement during regulation and a smaller, shorter amygdala response.',
    regionGain: { amygdala: 0.8 },
    processGain: { regulation: 1.3 },
    regulationEfficacy: 1.5,
    affectTail: 0.7,
    sensitiveTopics: [],
    topicGain: 1,
    refs: ['drabant2009', 'buhle2014'],
  },
];

export const PROFILE_BY_ID: Record<string, Profile> = Object.fromEntries(PROFILES.map((p) => [p.id, p]));

export const TOPIC_LABEL: Record<string, string> = {
  criticism: 'Criticism',
  threat: 'Possible danger',
  loss: 'Loss',
};
