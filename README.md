# Cortex — brain activity explorer

An interactive 3D brain that shows which regions engage as everyday events unfold: hearing someone speak, reading, recalling a memory, a jolt of alarm, talking yourself down.

- **Event log (left)** — a timeline of what is heard, said, read, seen, thought, remembered, felt and done. Click any event to jump to it.
- **Brain (centre)** — a real cortical surface with regions heating up as the events play. Rotate, zoom, isolate a hemisphere to see the medial surface, or switch to see-through to reveal deep structures.
- **Regional activity (right)** — live ranking of engaged regions. Click a region (in the list or on the brain) for what it does, why it is active right now, how well established that is, and the papers behind it.
- **Compare people** — play the same scenario through two profiles side by side (e.g. a typical responder vs. someone with high trait anxiety).

## Run

```bash
npm install
npm run dev      # local development
npm run build    # production build into dist/
```

Deploys to Vercel with no configuration (Vite is auto-detected; output directory `dist`).

## How the model works

Everything lives in `src/model/`:

| File | Contents |
| --- | --- |
| `regions.ts` | 31 regions with approximate MNI coordinates and a one-line role |
| `processes.ts` | Mental processes (hearing, reading, threat response, regulation…) → weighted regions, evidence grade and references |
| `scenarios.ts` | Seven timelines of events, each tagged with the processes it involves and, for feelings, an everyday name (e.g. "grief") |
| `profiles.ts` | Individual-difference profiles: region/process gains, regulation efficacy, sensitive topics |
| `simulate.ts` | Pure function `(scenario, profile, time) → activity per region` |
| `references.ts` | Bibliography |

Adding a scenario or a profile is a data change only.

## Scientific status — read this

This is an **illustrative model, not a measurement or a prediction**.

- Mappings come from group-level neuroimaging and lesion literature (reviews and meta-analyses where possible). Regions are multi-functional; a region lighting up does not identify a thought or feeling.
- Activity values are a schematic 0–1 "relative engagement", and timing is faster than a real haemodynamic response.
- Profiles encode reported group-level tendencies; individuals vary widely.
- Region centres are approximate and drawn as soft patches. Deep structures, cerebellum and brainstem are simplified shapes.
- **Citations were written from general knowledge and have not yet been verified line by line against the source papers.** That verification pass is the next step before presenting this as a reference.

## Anatomy data

`public/brain/*.bin` is the *fsaverage5* pial surface and sulcal-depth map from [FreeSurfer](https://surfer.nmr.mgh.harvard.edu/) (as redistributed with nilearn), converted to a compact binary format. FreeSurfer's licence terms apply to those files.
