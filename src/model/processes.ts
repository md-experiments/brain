import type { Hemi } from './regions';

export type Weight = number | Partial<Record<Hemi, number>>;
export type Evidence = 'strong' | 'moderate' | 'debated';

export interface Process {
  id: string;
  label: string;
  /** What the literature says, in one or two sentences. */
  basis: string;
  evidence: Evidence;
  refs: string[];
  /** Relative engagement of each region (0–1). A number applies to both hemispheres. */
  regions: Record<string, Weight>;
  /** Attention directed at the outside world; suppresses default-network rest activity. */
  external?: boolean;
  /** Affective processes linger after the triggering event. */
  affective?: boolean;
}

const list: Process[] = [
  {
    id: 'auditory', label: 'Hearing', evidence: 'strong', refs: ['hickok2007', 'price2012'], external: true,
    basis: 'Any sound drives primary auditory cortex in both hemispheres, relayed through the thalamus.',
    regions: { a1: 1, thalamus: 0.3 },
  },
  {
    id: 'speech_comprehension', label: 'Understanding speech', evidence: 'strong', refs: ['hickok2007', 'price2012'], external: true,
    basis: 'Speech sounds are analysed bilaterally in superior temporal cortex; mapping onto words and sentence meaning is left-dominant and recruits inferior frontal and anterior temporal cortex.',
    regions: { a1: 0.85, pstg: { L: 1, R: 0.4 }, ifg: { L: 0.4, R: 0.1 }, atl: { L: 0.45, R: 0.25 }, thalamus: 0.2 },
  },
  {
    id: 'speech_production', label: 'Speaking', evidence: 'strong', refs: ['price2012', 'hickok2007', 'stoodley2009'], external: true,
    basis: 'Planning words engages left inferior frontal cortex; articulation engages mouth motor cortex, supplementary motor area, basal ganglia and cerebellum. Auditory cortex monitors one’s own voice.',
    regions: { ifg: { L: 1, R: 0.2 }, m1mouth: 0.85, sma: 0.6, cerebellum: { L: 0.3, R: 0.45 }, putamen: { L: 0.35, R: 0.2 }, a1: 0.35, pstg: { L: 0.35 } },
  },
  {
    id: 'reading', label: 'Reading', evidence: 'strong', refs: ['dehaene2011', 'price2012'], external: true,
    basis: 'Text passes from visual cortex to the left visual word form area, then into the same left-hemisphere language network used for speech.',
    regions: { v1: 0.8, visassoc: 0.6, vwfa: 1, pstg: { L: 0.55, R: 0.1 }, ifg: { L: 0.45 }, angular: { L: 0.45 }, atl: { L: 0.35, R: 0.15 }, ips: 0.3 },
  },
  {
    id: 'vision', label: 'Seeing', evidence: 'strong', refs: ['wandell2007'], external: true,
    basis: 'Visual input reaches primary visual cortex via the thalamus and spreads to surrounding occipital areas.',
    regions: { v1: 1, visassoc: 0.8, thalamus: 0.25 },
  },
  {
    id: 'face', label: 'Perceiving a face', evidence: 'strong', refs: ['kanwisher1997'], external: true,
    basis: 'Faces selectively engage the fusiform face area, more strongly in the right hemisphere; emotionally significant faces also engage the amygdala.',
    regions: { v1: 0.6, visassoc: 0.55, ffa: { L: 0.55, R: 1 }, amygdala: 0.2 },
  },
  {
    id: 'scene', label: 'Perceiving a place', evidence: 'strong', refs: ['epstein1998'], external: true,
    basis: 'Scenes and spatial layouts selectively engage parahippocampal cortex.',
    regions: { v1: 0.7, visassoc: 0.6, ppa: 1 },
  },
  {
    id: 'imagery', label: 'Mental imagery', evidence: 'moderate', refs: ['rugg2013', 'epstein1998'],
    basis: 'Vividly picturing a remembered scene re-engages visual association and parahippocampal cortex, more weakly than actual seeing.',
    regions: { visassoc: 0.45, ppa: 0.6, v1: 0.2, pcc: 0.4 },
  },
  {
    id: 'episodic', label: 'Recalling an event', evidence: 'strong', refs: ['scoville1957', 'rugg2013'],
    basis: 'Recollecting a specific episode depends on the hippocampus and engages posterior cingulate, angular gyrus and medial prefrontal cortex.',
    regions: { hippocampus: 1, pcc: 0.8, angular: { L: 0.65, R: 0.45 }, mpfc: 0.5, ppa: 0.35 },
  },
  {
    id: 'semantic', label: 'Retrieving knowledge', evidence: 'strong', refs: ['patterson2007'],
    basis: 'Knowing what a word, object or person is draws on the anterior temporal lobes, with left inferior frontal cortex controlling retrieval.',
    regions: { atl: { L: 1, R: 0.7 }, angular: { L: 0.45 }, ifg: { L: 0.4 } },
  },
  {
    id: 'self', label: 'Self-directed thought', evidence: 'strong', refs: ['raichle2001', 'buckner2008'],
    basis: 'Reflecting on oneself, mind-wandering and imagining the future engage the default network.',
    regions: { mpfc: 0.9, pcc: 0.9, angular: 0.5, vmpfc: 0.4, hippocampus: 0.3 },
  },
  {
    id: 'working_memory', label: 'Deliberate reasoning', evidence: 'strong', refs: ['owen2005'], external: true,
    basis: 'Holding facts in mind and working through them recruits dorsolateral prefrontal and superior parietal cortex.',
    regions: { dlpfc: 1, ips: 0.8, dacc: 0.4, sma: 0.25, cerebellum: 0.2 },
  },
  {
    id: 'orienting', label: 'Attention capture', evidence: 'strong', refs: ['corbetta2002', 'seeley2007'], external: true,
    basis: 'An unexpected, relevant event triggers the salience network and a right-lateralised reorienting system.',
    regions: { insula: 0.6, dacc: 0.6, tpj: { R: 0.8, L: 0.2 }, ips: 0.6, ifg: { R: 0.5 } },
  },
  {
    id: 'threat', label: 'Threat response', evidence: 'strong', refs: ['ledoux2000', 'phelps2005', 'mobbs2007'], affective: true,
    basis: 'Detected threat engages the amygdala, which drives hypothalamus and midbrain defence circuits; insula and anterior cingulate register the alarm.',
    regions: { amygdala: 1, insula: 0.7, dacc: 0.6, hypothalamus: 0.65, pag: 0.55, thalamus: 0.4 },
  },
  {
    id: 'negative_affect', label: 'Distress', evidence: 'debated', refs: ['eisenberger2003', 'lindquist2012', 'craig2009'], affective: true,
    basis: 'Emotional hurt, sadness and social rejection reliably engage anterior insula and anterior cingulate, with amygdala involvement. Whether this is “pain-like” is contested, and no emotion maps onto a single region.',
    regions: { insula: 0.9, dacc: 0.8, amygdala: 0.5, vmpfc: 0.3 },
  },
  {
    id: 'arousal', label: 'Bodily arousal', evidence: 'moderate', refs: ['craig2009', 'ledoux2000'], affective: true,
    basis: 'Changes in heart rate, breathing and sweating are driven by hypothalamus and brainstem and sensed through the insula.',
    regions: { hypothalamus: 0.9, pag: 0.6, insula: 0.7, thalamus: 0.35 },
  },
  {
    id: 'regulation', label: 'Emotion regulation', evidence: 'strong', refs: ['buhle2014', 'ochsner2005'],
    basis: 'Deliberately reinterpreting a situation engages lateral and medial prefrontal cortex and, when it works, lowers amygdala activity.',
    regions: { ifg: { L: 0.75, R: 1 }, dlpfc: 0.7, mpfc: 0.55, vmpfc: 0.45, sma: 0.3 },
  },
  {
    id: 'reward', label: 'Reward and relief', evidence: 'strong', refs: ['knutson2001', 'bartra2013'], affective: true,
    basis: 'Pleasant outcomes, praise and anticipated good things engage ventral striatum and ventromedial/orbitofrontal cortex.',
    regions: { vstriatum: 1, vmpfc: 0.8, ofc: 0.6 },
  },
  {
    id: 'mentalizing', label: 'Reading another mind', evidence: 'strong', refs: ['saxe2003', 'buckner2008'],
    basis: 'Inferring what someone else believes or intends engages the temporo-parietal junction (right-dominant) and medial prefrontal cortex.',
    regions: { tpj: { R: 1, L: 0.7 }, mpfc: 0.8, pcc: 0.5, atl: 0.3 },
  },
  {
    id: 'motor_hand', label: 'Hand movement (right)', evidence: 'strong', refs: ['penfield1937', 'stoodley2009'], external: true,
    basis: 'Moving the right hand engages left motor cortex, supplementary motor area, basal ganglia and the right cerebellum.',
    regions: { m1: { L: 1, R: 0.1 }, s1: { L: 0.55 }, sma: 0.6, putamen: { L: 0.45, R: 0.1 }, cerebellum: { R: 0.65, L: 0.1 }, thalamus: { L: 0.3 } },
  },
  {
    id: 'locomotion', label: 'Whole-body movement', evidence: 'moderate', refs: ['penfield1937', 'stoodley2009'], external: true,
    basis: 'Walking and turning engage medial sensorimotor cortex bilaterally, cerebellum and basal ganglia. Human imaging evidence is limited because subjects must lie still in a scanner.',
    regions: { sma: 0.7, m1: 0.45, s1: 0.3, cerebellum: 0.65, putamen: 0.35 },
  },
  {
    id: 'touch', label: 'Touch (right hand)', evidence: 'strong', refs: ['penfield1937'], external: true,
    basis: 'Touch on the right hand is relayed through the thalamus to left primary somatosensory cortex.',
    regions: { s1: { L: 1, R: 0.1 }, thalamus: { L: 0.35 }, insula: 0.2 },
  },
];

export const PROCESSES: Record<string, Process> = Object.fromEntries(list.map((p) => [p.id, p]));

export function weightFor(w: Weight | undefined, hemi: Hemi): number {
  if (w === undefined) return 0;
  if (typeof w === 'number') return w;
  return w[hemi] ?? 0;
}
