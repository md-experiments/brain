export type Hemi = 'L' | 'R' | 'M';
export type Vec3 = [number, number, number];

export interface Region {
  id: string;
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
  { id: 'a1', name: 'Primary auditory cortex', short: 'Auditory cortex', lobe: 'Temporal', kind: 'cortex', centers: lr(50, -20, 7), sigma: 10, role: 'First cortical stage of hearing (Heschl’s gyrus), on the upper surface of the temporal lobe.' },
  { id: 'pstg', name: 'Posterior superior temporal cortex (Wernicke’s area on the left)', short: 'Post. sup. temporal', lobe: 'Temporal', kind: 'cortex', centers: lr(58, -42, 12), sigma: 11, role: 'Maps speech sounds onto words and meaning; left-dominant for language.' },
  { id: 'atl', name: 'Anterior temporal lobe', short: 'Ant. temporal', lobe: 'Temporal', kind: 'cortex', centers: lr(50, 6, -26), sigma: 11, role: 'Hub for conceptual knowledge about words, objects and people.' },
  { id: 'ffa', name: 'Fusiform face area', short: 'Fusiform (faces)', lobe: 'Temporal', kind: 'cortex', centers: lr(40, -52, -20), sigma: 9, role: 'Underside of the temporal lobe; responds selectively to faces, more strongly on the right.' },
  { id: 'vwfa', name: 'Visual word form area', short: 'Fusiform (words)', lobe: 'Temporal', kind: 'cortex', centers: { L: [-44, -58, -14] }, sigma: 8, role: 'Left fusiform site tuned to written words by learning to read.' },
  { id: 'ppa', name: 'Parahippocampal cortex', short: 'Parahippocampal', lobe: 'Temporal', kind: 'cortex', centers: lr(26, -44, -10), sigma: 9, role: 'Responds to scenes, places and spatial context.' },
  // Frontal
  { id: 'ifg', name: 'Inferior frontal gyrus (Broca’s area on the left)', short: 'Inf. frontal', lobe: 'Frontal', kind: 'cortex', centers: lr(50, 18, 12), sigma: 11, role: 'Left: speech planning and grammar. Right and bilateral: cognitive control and inhibition, including of emotion.' },
  { id: 'dlpfc', name: 'Dorsolateral prefrontal cortex', short: 'Dorsolateral PFC', lobe: 'Frontal', kind: 'cortex', centers: lr(42, 32, 30), sigma: 12, role: 'Holds and manipulates information in mind; deliberate, effortful control.' },
  { id: 'mpfc', name: 'Dorsomedial prefrontal cortex', short: 'Medial PFC', lobe: 'Frontal', kind: 'cortex', centers: lr(6, 52, 22), sigma: 12, role: 'Thinking about oneself and about other people’s minds; part of the default network.' },
  { id: 'vmpfc', name: 'Ventromedial prefrontal cortex', short: 'Ventromedial PFC', lobe: 'Frontal', kind: 'cortex', centers: lr(6, 46, -10), sigma: 11, role: 'Represents subjective value and safety; modulates amygdala output.' },
  { id: 'ofc', name: 'Orbitofrontal cortex', short: 'Orbitofrontal', lobe: 'Frontal', kind: 'cortex', centers: lr(26, 34, -14), sigma: 10, role: 'Evaluates outcomes and rewards.' },
  { id: 'dacc', name: 'Dorsal anterior cingulate cortex', short: 'Ant. cingulate', lobe: 'Frontal (medial)', kind: 'cortex', centers: lr(5, 22, 30), sigma: 10, role: 'Signals conflict, salience and the need for control; responds to pain and distress.' },
  { id: 'sma', name: 'Supplementary motor area', short: 'Suppl. motor', lobe: 'Frontal (medial)', kind: 'cortex', centers: lr(5, -2, 60), sigma: 10, role: 'Sequences and initiates voluntary movement, including speech.' },
  { id: 'm1', name: 'Primary motor cortex (hand and arm)', short: 'Motor cortex', lobe: 'Frontal', kind: 'cortex', centers: lr(38, -22, 58), sigma: 10, role: 'Sends movement commands to the opposite side of the body.' },
  { id: 'm1mouth', name: 'Ventral sensorimotor cortex (face and mouth)', short: 'Motor (mouth)', lobe: 'Frontal', kind: 'cortex', centers: lr(54, -8, 36), sigma: 9, role: 'Controls lips, tongue, jaw and larynx during speech.' },
  // Parietal
  { id: 's1', name: 'Primary somatosensory cortex', short: 'Somatosensory', lobe: 'Parietal', kind: 'cortex', centers: lr(44, -32, 56), sigma: 10, role: 'Touch and body position from the opposite side of the body.' },
  { id: 'ips', name: 'Superior parietal lobule / intraparietal sulcus', short: 'Sup. parietal', lobe: 'Parietal', kind: 'cortex', centers: lr(30, -58, 50), sigma: 11, role: 'Directs spatial attention and supports working memory.' },
  { id: 'angular', name: 'Angular gyrus', short: 'Angular gyrus', lobe: 'Parietal', kind: 'cortex', centers: lr(44, -68, 36), sigma: 10, role: 'Integrates meaning and recollected detail; part of the default network.' },
  { id: 'tpj', name: 'Temporo-parietal junction', short: 'Temporo-parietal jn.', lobe: 'Parietal', kind: 'cortex', centers: lr(56, -52, 22), sigma: 9, role: 'Reasoning about other people’s beliefs and intentions; reorienting attention (right).' },
  { id: 'pcc', name: 'Posterior cingulate / precuneus', short: 'Post. cingulate', lobe: 'Parietal (medial)', kind: 'cortex', centers: lr(5, -52, 28), sigma: 12, role: 'Core of the default network; active in remembering and self-related thought.' },
  // Occipital
  { id: 'v1', name: 'Primary visual cortex', short: 'Visual cortex (V1)', lobe: 'Occipital', kind: 'cortex', centers: lr(9, -90, 2), sigma: 12, role: 'First cortical stage of vision, along the calcarine sulcus.' },
  { id: 'visassoc', name: 'Lateral occipital / visual association cortex', short: 'Visual association', lobe: 'Occipital', kind: 'cortex', centers: lr(38, -82, 2), sigma: 12, role: 'Builds shape, colour and object representations from V1 input.' },
  // Insula & deep structures
  { id: 'insula', name: 'Anterior insula', short: 'Ant. insula', lobe: 'Insular', kind: 'cortex', centers: lr(36, 18, 2), sigma: 9, deep: true, role: 'Maps the body’s internal state; tracks felt emotion and salience. Folded beneath the frontal and temporal lobes.' },
  { id: 'amygdala', name: 'Amygdala', short: 'Amygdala', lobe: 'Subcortical', kind: 'nucleus', centers: lr(24, -4, -18), radii: [7, 8, 7], deep: true, role: 'Detects threat and emotional significance; triggers bodily defence responses.' },
  { id: 'hippocampus', name: 'Hippocampus', short: 'Hippocampus', lobe: 'Subcortical', kind: 'nucleus', centers: lr(28, -24, -13), radii: [6, 17, 6], deep: true, role: 'Forms and retrieves memories of specific events.' },
  { id: 'thalamus', name: 'Thalamus', short: 'Thalamus', lobe: 'Subcortical', kind: 'nucleus', centers: lr(11, -18, 8), radii: [9, 13, 8], deep: true, role: 'Relay between the senses, body and cortex; regulates arousal.' },
  { id: 'vstriatum', name: 'Ventral striatum (nucleus accumbens)', short: 'Ventral striatum', lobe: 'Subcortical', kind: 'nucleus', centers: lr(10, 10, -8), radii: [5, 6, 5], deep: true, role: 'Signals anticipated and received reward.' },
  { id: 'putamen', name: 'Putamen (dorsal striatum)', short: 'Putamen', lobe: 'Subcortical', kind: 'nucleus', centers: lr(26, 2, 2), radii: [6, 14, 9], deep: true, role: 'Part of the basal ganglia loop that selects and smooths movement.' },
  { id: 'hypothalamus', name: 'Hypothalamus', short: 'Hypothalamus', lobe: 'Subcortical', kind: 'nucleus', centers: { M: [0, -4, -11] }, radii: [6, 6, 5], deep: true, role: 'Launches the stress response: heart rate, hormones, sweating.' },
  { id: 'pag', name: 'Midbrain (periaqueductal gray)', short: 'Midbrain / PAG', lobe: 'Brainstem', kind: 'brainstem', centers: { M: [0, -30, -10] }, radii: [5, 5, 7], deep: true, role: 'Coordinates fast defensive reactions such as startle and freezing.' },
  { id: 'cerebellum', name: 'Cerebellum', short: 'Cerebellum', lobe: 'Cerebellum', kind: 'cerebellum', centers: lr(22, -62, -36), radii: [27, 23, 17], role: 'Fine-tunes the timing and precision of movement, including speech; each side serves the same side of the body.' },
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
