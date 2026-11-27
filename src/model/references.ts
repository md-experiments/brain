/**
 * Literature the model is built on. These are well-known, widely cited papers
 * (reviews and meta-analyses where possible). They were entered from general
 * knowledge and still need a line-by-line verification pass before the app is
 * presented as a reference work.
 */
export interface Reference {
  id: string;
  cite: string;
  finding: string;
}

const list: Reference[] = [
  { id: 'hickok2007', cite: 'Hickok & Poeppel (2007). The cortical organization of speech processing. Nat Rev Neurosci 8:393–402.', finding: 'Speech is analysed bilaterally in superior temporal cortex, then routed along a ventral (meaning) and a left-dominant dorsal (articulation) stream.' },
  { id: 'price2012', cite: 'Price (2012). A review and synthesis of the first 20 years of PET and fMRI studies of heard speech, spoken language and reading. NeuroImage 62:816–847.', finding: 'Synthesis of imaging studies of listening, speaking and reading: superior temporal, inferior frontal, premotor and cerebellar involvement.' },
  { id: 'dehaene2011', cite: 'Dehaene & Cohen (2011). The unique role of the visual word form area in reading. Trends Cogn Sci 15:254–262.', finding: 'A site in the left fusiform gyrus responds selectively to written words in literate adults.' },
  { id: 'kanwisher1997', cite: 'Kanwisher, McDermott & Chun (1997). The fusiform face area. J Neurosci 17:4302–4311.', finding: 'A region of the (mostly right) fusiform gyrus responds far more strongly to faces than to other objects.' },
  { id: 'epstein1998', cite: 'Epstein & Kanwisher (1998). A cortical representation of the local visual environment. Nature 392:598–601.', finding: 'Parahippocampal cortex responds selectively to scenes and spatial layout.' },
  { id: 'wandell2007', cite: 'Wandell, Dumoulin & Brewer (2007). Visual field maps in human cortex. Neuron 56:366–383.', finding: 'Retinotopic maps: primary visual cortex along the calcarine sulcus, with further maps across occipital cortex.' },
  { id: 'scoville1957', cite: 'Scoville & Milner (1957). Loss of recent memory after bilateral hippocampal lesions. J Neurol Neurosurg Psychiatry 20:11–21.', finding: 'Removing the hippocampi (patient H.M.) abolished the ability to form new episodic memories.' },
  { id: 'rugg2013', cite: 'Rugg & Vilberg (2013). Brain networks underlying episodic memory retrieval. Curr Opin Neurobiol 23:255–260.', finding: 'Successful recollection engages hippocampus, posterior cingulate, angular gyrus and medial prefrontal cortex.' },
  { id: 'patterson2007', cite: 'Patterson, Nestor & Rogers (2007). Where do you know what you know? Nat Rev Neurosci 8:976–987.', finding: 'The anterior temporal lobes act as a hub for conceptual (semantic) knowledge.' },
  { id: 'raichle2001', cite: 'Raichle et al. (2001). A default mode of brain function. PNAS 98:676–682.', finding: 'Medial prefrontal, posterior cingulate and lateral parietal regions are most active at rest and deactivate during externally focused tasks.' },
  { id: 'buckner2008', cite: 'Buckner, Andrews-Hanna & Schacter (2008). The brain’s default network. Ann NY Acad Sci 1124:1–38.', finding: 'The default network supports self-referential thought, remembering and imagining the future.' },
  { id: 'owen2005', cite: 'Owen et al. (2005). N-back working memory paradigm: a meta-analysis. Hum Brain Mapp 25:46–59.', finding: 'Holding and manipulating information recruits dorsolateral prefrontal and posterior parietal cortex.' },
  { id: 'corbetta2002', cite: 'Corbetta & Shulman (2002). Control of goal-directed and stimulus-driven attention in the brain. Nat Rev Neurosci 3:201–215.', finding: 'Dorsal fronto-parietal regions direct attention; a ventral, right-lateralised system reorients to unexpected events.' },
  { id: 'seeley2007', cite: 'Seeley et al. (2007). Dissociable intrinsic connectivity networks for salience processing and executive control. J Neurosci 27:2349–2356.', finding: 'Anterior insula and dorsal anterior cingulate form a “salience network” that responds to personally relevant events.' },
  { id: 'craig2009', cite: 'Craig (2009). How do you feel — now? The anterior insula and human awareness. Nat Rev Neurosci 10:59–70.', finding: 'The insula maps the internal state of the body; anterior insula tracks felt emotion.' },
  { id: 'ledoux2000', cite: 'LeDoux (2000). Emotion circuits in the brain. Annu Rev Neurosci 23:155–184.', finding: 'The amygdala detects threat and drives defensive responses via hypothalamus and brainstem.' },
  { id: 'phelps2005', cite: 'Phelps & LeDoux (2005). Contributions of the amygdala to emotion processing. Neuron 48:175–187.', finding: 'Animal findings on amygdala-dependent threat learning carry over to humans.' },
  { id: 'mobbs2007', cite: 'Mobbs et al. (2007). When fear is near. Science 317:1079–1083.', finding: 'As a threat becomes imminent, activity shifts from prefrontal cortex towards the periaqueductal gray.' },
  { id: 'lindquist2012', cite: 'Lindquist et al. (2012). The brain basis of emotion: a meta-analytic review. Behav Brain Sci 35:121–143.', finding: 'No emotion maps one-to-one onto a single region; emotions arise from interacting general-purpose networks.' },
  { id: 'eisenberger2003', cite: 'Eisenberger, Lieberman & Williams (2003). Does rejection hurt? Science 302:290–292.', finding: 'Social exclusion engaged dorsal anterior cingulate and anterior insula. The “social pain” interpretation remains debated.' },
  { id: 'ochsner2005', cite: 'Ochsner & Gross (2005). The cognitive control of emotion. Trends Cogn Sci 9:242–249.', finding: 'Reinterpreting an emotional event recruits lateral and medial prefrontal cortex and changes amygdala activity.' },
  { id: 'buhle2014', cite: 'Buhle et al. (2014). Cognitive reappraisal of emotion: a meta-analysis. Cereb Cortex 24:2981–2990.', finding: 'Across 48 studies, reappraisal engaged dorsolateral, ventrolateral and dorsomedial prefrontal cortex and reduced amygdala activity.' },
  { id: 'knutson2001', cite: 'Knutson et al. (2001). Anticipation of increasing monetary reward selectively recruits nucleus accumbens. J Neurosci 21:RC159.', finding: 'Ventral striatum responds in proportion to anticipated reward.' },
  { id: 'bartra2013', cite: 'Bartra, McGuire & Kable (2013). The valuation system. NeuroImage 76:412–427.', finding: 'Meta-analysis: ventral striatum and ventromedial prefrontal cortex track subjective value.' },
  { id: 'saxe2003', cite: 'Saxe & Kanwisher (2003). People thinking about thinking people. NeuroImage 19:1835–1842.', finding: 'The temporo-parietal junction responds selectively when reasoning about another person’s beliefs.' },
  { id: 'penfield1937', cite: 'Penfield & Boldrey (1937). Somatic motor and sensory representation in the cerebral cortex of man. Brain 60:389–443.', finding: 'Body-part maps along the pre- and post-central gyri, each controlling the opposite side of the body.' },
  { id: 'stoodley2009', cite: 'Stoodley & Schmahmann (2009). Functional topography in the human cerebellum. NeuroImage 44:489–501.', finding: 'The cerebellum contributes to movement (same side of the body) and also to language and working memory.' },
  { id: 'etkin2007', cite: 'Etkin & Wager (2007). Functional neuroimaging of anxiety: a meta-analysis. Am J Psychiatry 164:1476–1488.', finding: 'Amygdala and insula are hyper-responsive across PTSD, social anxiety and specific phobia.' },
  { id: 'stein2007', cite: 'Stein et al. (2007). Increased amygdala and insula activation during emotion processing in anxiety-prone subjects. Am J Psychiatry 164:318–327.', finding: 'Healthy but anxiety-prone people show stronger amygdala and insula responses to emotional faces.' },
  { id: 'bishop2007', cite: 'Bishop (2007). Neurocognitive mechanisms of anxiety: an integrative account. Trends Cogn Sci 11:307–316.', finding: 'Trait anxiety combines amplified amygdala threat responses with weaker prefrontal control.' },
  { id: 'drabant2009', cite: 'Drabant et al. (2009). Individual differences in typical reappraisal use predict amygdala and prefrontal responses. Biol Psychiatry 65:367–373.', finding: 'People who habitually reappraise show more prefrontal and less amygdala activity to negative faces.' },
  { id: 'poldrack2006', cite: 'Poldrack (2006). Can cognitive processes be inferred from neuroimaging data? Trends Cogn Sci 10:59–63.', finding: 'Activity in a region does not by itself reveal which mental process is occurring (the “reverse inference” problem).' },
];

export const REFERENCES: Record<string, Reference> = Object.fromEntries(list.map((r) => [r.id, r]));
