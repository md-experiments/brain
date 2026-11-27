export type Hemi = 'L' | 'R' | 'M';
export type Vec3 = [number, number, number];

export interface Region {
  id: string;
  /** Everyday phrase for what this region mostly does; shown on labels unless the active process gives a more specific one. */
  job: string;
  name: string;
  /** Short label used on the 3D view. */
  short: string;
  lobe: string;
  kind: 'cortex' | 'nucleus' | 'cerebellum' | 'brainstem';
  /** Approximate centre in MNI space (mm): x = right, y = anterior, z = superior. */
  centers: Partial<Record<Hemi, Vec3>>;
  /** Spatial spread of the highlight on the cortical surface (mm). */
  sigma?: number;
  /** Ellipsoid radii for deep structures (mm). */
  radii?: Vec3;
  /** Hidden beneath the cortical surface: drawn with a see-through glow. */
  deep?: boolean;
  role: string;
}

const lr = (x: number, y: number, z: number): Partial<Record<Hemi, Vec3>> => ({ L: [-x, y, z], R: [x, y, z] });

export const REGIONS: Region[] = [
  // Temporal
  { id: 'a1', job: 'hearing sounds', name: 'Primary auditory cortex', short: 'Auditory cortex', lobe: 'Temporal', kind: 'cortex', centers: lr(50, -20, 7), sigma: 10, role: 'First cortical stage of hearing (Heschl’s gyrus), on the upper surface of the temporal lobe.' },
  { id: 'pstg', job: 'decoding words', name: 'Posterior superior temporal cortex (Wernicke’s area on the left)', short: 'Post. sup. temporal', lobe: 'Temporal', kind: 'cortex', centers: lr(58, -42, 12), sigma: 11, role: 'Maps speech sounds onto words and meaning; left-dominant for language.' },
  { id: 'atl', job: 'meaning and knowledge', name: 'Anterior temporal lobe', short: 'Ant. temporal', lobe: 'Temporal', kind: 'cortex', centers: lr(50, 6, -26), sigma: 11, role: 'Hub for conceptual knowledge about words, objects and people.' },
  { id: 'ffa', job: 'recognising faces', name: 'Fusiform face area', short: 'Fusiform (faces)', lobe: 'Temporal', kind: 'cortex', centers: lr(40, -52, -20), sigma: 9, role: 'Underside of the temporal lobe; responds selectively to faces, more strongly on the right.' },
  { id: 'vwfa', job: 'recognising written words', name: 'Visual word form area', short: 'Fusiform (words)', lobe: 'Temporal', kind: 'cortex', centers: { L: [-44, -58, -14] }, sigma: 8, role: 'Left fusiform site tuned to written words by learning to read.' },
  { id: 'ppa', job: 'recognising places', name: 'Parahippocampal cortex', short: 'Parahippocampal', lobe: 'Temporal', kind: 'cortex', centers: lr(26, -44, -10), sigma: 9, role: 'Responds to scenes, places and spatial context.' },
  // Frontal
  { id: 'ifg', job: 'forming words', name: 'Inferior frontal gyrus (Broca’s area on the left)', short: 'Inf. frontal', lobe: 'Frontal', kind: 'cortex', centers: lr(50, 18, 12), sigma: 11, role: 'Left: speech planning and grammar. Right and bilateral: cognitive control and inhibition, including of emotion.' },
  { id: 'dlpfc', job: 'holding things in mind', name: 'Dorsolateral prefrontal cortex', short: 'Dorsolateral PFC', lobe: 'Frontal', kind: 'cortex', centers: lr(42, 32, 30), sigma: 12, role: 'Holds and manipulates information in mind; deliberate, effortful control.' },
  { id: 'mpfc', job: 'thinking about self and others', name: 'Dorsomedial prefrontal cortex', short: 'Medial PFC', lobe: 'Frontal', kind: 'cortex', centers: lr(6, 52, 22), sigma: 12, role: 'Thinking about oneself and about other people’s minds; part of the default network.' },
  { id: 'vmpfc', job: 'judging what it is worth', name: 'Ventromedial prefrontal cortex', short: 'Ventromedial PFC', lobe: 'Frontal', kind: 'cortex', centers: lr(6, 46, -10), sigma: 11, role: 'Tracks how much something is worth to you, at the moment of choosing and when the outcome arrives.' },
  { id: 'ofc', job: 'valuing rewards', name: 'Orbitofrontal cortex', short: 'Orbitofrontal', lobe: 'Frontal', kind: 'cortex', centers: lr(26, 34, -14), sigma: 10, role: 'Evaluates outcomes and rewards.' },
  { id: 'dacc', job: 'signalling something is wrong', name: 'Dorsal anterior cingulate cortex', short: 'Ant. cingulate', lobe: 'Frontal (medial)', kind: 'cortex', centers: lr(5, 22, 30), sigma: 10, role: 'Signals conflict, salience and the need for control; responds to pain and distress.' },
  { id: 'sma', job: 'planning movement', name: 'Supplementary motor area', short: 'Suppl. motor', lobe: 'Frontal (medial)', kind: 'cortex', centers: lr(5, -2, 60), sigma: 10, role: 'Sequences and initiates voluntary movement, including speech.' },
  { id: 'm1', job: 'moving the body', name: 'Primary motor cortex (hand and arm)', short: 'Motor cortex', lobe: 'Frontal', kind: 'cortex', centers: lr(38, -22, 58), sigma: 10, role: 'Sends movement commands to the opposite side of the body.' },
  { id: 'm1mouth', job: 'moving lips and tongue', name: 'Ventral sensorimotor cortex (face and mouth)', short: 'Motor (mouth)', lobe: 'Frontal', kind: 'cortex', centers: lr(54, -8, 36), sigma: 9, role: 'Controls lips, tongue, jaw and larynx during speech.' },
  // Parietal
  { id: 's1', job: 'feeling touch', name: 'Primary somatosensory cortex', short: 'Somatosensory', lobe: 'Parietal', kind: 'cortex', centers: lr(44, -32, 56), sigma: 10, role: 'Touch and body position from the opposite side of the body.' },
  { id: 'ips', job: 'directing attention', name: 'Superior parietal lobule / intraparietal sulcus', short: 'Sup. parietal', lobe: 'Parietal', kind: 'cortex', centers: lr(30, -58, 50), sigma: 11, role: 'Directs spatial attention and supports working memory.' },
  { id: 'angular', job: 'pulling meaning together', name: 'Angular gyrus', short: 'Angular gyrus', lobe: 'Parietal', kind: 'cortex', centers: lr(44, -68, 36), sigma: 10, role: 'Integrates meaning and recollected detail; part of the default network.' },
  { id: 'tpj', job: 'reading intentions', name: 'Temporo-parietal junction', short: 'Temporo-parietal jn.', lobe: 'Parietal', kind: 'cortex', centers: lr(56, -52, 22), sigma: 9, role: 'Reasoning about other people’s beliefs and intentions; reorienting attention (right).' },
  { id: 'pcc', job: 'inner world', name: 'Posterior cingulate / precuneus', short: 'Post. cingulate', lobe: 'Parietal (medial)', kind: 'cortex', centers: lr(5, -52, 28), sigma: 12, role: 'Core of the default network; active in remembering and self-related thought.' },
  // Occipital
  { id: 'v1', job: 'seeing: raw image', name: 'Primary visual cortex', short: 'Visual cortex (V1)', lobe: 'Occipital', kind: 'cortex', centers: lr(9, -90, 2), sigma: 12, role: 'First cortical stage of vision, along the calcarine sulcus.' },
  { id: 'visassoc', job: 'seeing: shapes and objects', name: 'Lateral occipital / visual association cortex', short: 'Visual association', lobe: 'Occipital', kind: 'cortex', centers: lr(38, -82, 2), sigma: 12, role: 'Builds shape, colour and object representations from V1 input.' },
  // Insula & deep structures
  { id: 'insula', job: 'feeling it in the body', name: 'Anterior insula', short: 'Ant. insula', lobe: 'Insular', kind: 'cortex', centers: lr(36, 18, 2), sigma: 9, deep: true, role: 'Maps the body’s internal state; tracks felt emotion and salience. Folded beneath the frontal and temporal lobes.' },
  { id: 'amygdala', job: 'flagging what matters', name: 'Amygdala', short: 'Amygdala', lobe: 'Subcortical', kind: 'nucleus', centers: lr(24, -4, -18), radii: [7, 8, 7], deep: true, role: 'Detects threat and emotional significance; triggers bodily defence responses.' },
  { id: 'hippocampus', job: 'retrieving memories', name: 'Hippocampus', short: 'Hippocampus', lobe: 'Subcortical', kind: 'nucleus', centers: lr(28, -24, -13), radii: [6, 17, 6], deep: true, role: 'Forms and retrieves memories of specific events.' },
  { id: 'thalamus', job: 'relaying signals', name: 'Thalamus', short: 'Thalamus', lobe: 'Subcortical', kind: 'nucleus', centers: lr(11, -18, 8), radii: [9, 13, 8], deep: true, role: 'Relay between the senses, body and cortex; regulates arousal.' },
  { id: 'vstriatum', job: 'wanting', name: 'Ventral striatum (nucleus accumbens)', short: 'Ventral striatum', lobe: 'Subcortical', kind: 'nucleus', centers: lr(10, 10, -8), radii: [5, 6, 5], deep: true, role: 'Signals anticipated and received reward.' },
  { id: 'putamen', job: 'smoothing movement', name: 'Putamen (dorsal striatum)', short: 'Putamen', lobe: 'Subcortical', kind: 'nucleus', centers: lr(26, 2, 2), radii: [6, 14, 9], deep: true, role: 'Part of the basal ganglia loop that selects and smooths movement.' },
  { id: 'hypothalamus', job: 'driving the stress response', name: 'Hypothalamus', short: 'Hypothalamus', lobe: 'Subcortical', kind: 'nucleus', centers: { M: [0, -4, -11] }, radii: [6, 6, 5], deep: true, role: 'Launches the stress response: heart rate, hormones, sweating.' },
  { id: 'pag', job: 'reflex defence', name: 'Midbrain (periaqueductal gray)', short: 'Midbrain / PAG', lobe: 'Brainstem', kind: 'brainstem', centers: { M: [0, -30, -10] }, radii: [5, 5, 7], deep: true, role: 'Coordinates fast defensive reactions such as startle and freezing.' },
  { id: 'cerebellum', job: 'fine-tuning movement', name: 'Cerebellum', short: 'Cerebellum', lobe: 'Cerebellum', kind: 'cerebellum', centers: lr(22, -62, -36), radii: [27, 23, 17], role: 'Fine-tunes the timing and precision of movement, including speech; each side serves the same side of the body.' },
];

export const REGION_BY_ID: Record<string, Region> = Object.fromEntries(REGIONS.map((r) => [r.id, r]));

export interface Unit {
  id: string;
  region: Region;
  hemi: Hemi;
  center: Vec3;
}

export const UNITS: Unit[] = REGIONS.flatMap((region) =>
  (Object.entries(region.centers) as [Hemi, Vec3][]).map(([hemi, center]) => ({
    id: `${region.id}:${hemi}`,
    region,
    hemi,
    center,
  })),
);

export const HEMI_LABEL: Record<Hemi, string> = { L: 'left', R: 'right', M: 'midline' };
