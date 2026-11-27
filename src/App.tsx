import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Columns2, Info, ListTree, Layers, Pause, Play, RotateCcw, Tag, X } from 'lucide-react';
import ActivityPanel from './components/ActivityPanel';
import BrainView, { type CameraSync, type Clock, type HemiMode } from './components/BrainView';
import EventLog, { formatTime, KIND_META } from './components/EventLog';
import { PROFILES, PROFILE_BY_ID } from './model/profiles';
import { REFERENCES } from './model/references';
import { SCENARIOS, SCENARIO_BY_ID } from './model/scenarios';

const SPEEDS = [0.5, 1, 2];

export default function App() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [profileA, setProfileA] = useState('typical');
  const [profileB, setProfileB] = useState('threat_sensitive');
  const [compare, setCompare] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [glass, setGlass] = useState(false);
  const [labels, setLabels] = useState(true);
  const [hemis, setHemis] = useState<HemiMode>('both');
  const [selected, setSelected] = useState<string | null>(null);
  const [about, setAbout] = useState(false);
  const [tab, setTab] = useState<'log' | 'activity'>('log');
  // On small screens the two side panels share one slot; picking a region brings its panel forward.
  const selectRegion = useCallback((id: string | null) => {
    setSelected(id);
    if (id) setTab('activity');
  }, []);

  const scenario = SCENARIO_BY_ID[scenarioId];
  const clock = useRef<Clock>({ t: 0 }).current;
  const sync = useRef<CameraSync>({ listeners: new Set() }).current;
  const profiles = useMemo(
    () => (compare ? [PROFILE_BY_ID[profileA], PROFILE_BY_ID[profileB]] : [PROFILE_BY_ID[profileA]]),
    [compare, profileA, profileB],
  );

  const seek = useCallback(
    (t: number) => {
      clock.t = t;
      setTime(t);
    },
    [clock],
  );

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let lastPush = 0;
    const tick = (now: number) => {
      // Clamp so a backgrounded tab does not jump the timeline forward.
      clock.t += Math.min(0.1, (now - last) / 1000) * speed;
      last = now;
      if (clock.t >= scenario.duration) {
        clock.t = scenario.duration;
        setTime(clock.t);
        setPlaying(false);
        return;
      }
      if (now - lastPush > 80) {
        lastPush = now;
        setTime(clock.t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, scenario, clock]);

  const togglePlay = () => {
    if (!playing && clock.t >= scenario.duration) seek(0);
    setPlaying((p) => !p);
  };

  const chooseScenario = (id: string) => {
    setScenarioId(id);
    setPlaying(false);
    seek(0);
  };

  return (
    <div className="app" data-tab={tab}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" />
          <strong>Cortex</strong>
          <span className="brand-sub">brain activity explorer</span>
        </div>
        <button type="button" className="ghost" onClick={() => setAbout(true)}>
          <Info size={15} /> Method &amp; limits
        </button>
      </header>

      <aside className="pane pane-log">
        <div className="pane-head">
          <label className="field">
            <span>Scenario</span>
            <select value={scenarioId} onChange={(e) => chooseScenario(e.target.value)}>
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </label>
          <p className="setting">{scenario.setting}</p>
        </div>
        <EventLog scenario={scenario} time={time} profiles={profiles} onSeek={seek} />
      </aside>

      <div className="transport">
        <button type="button" className="play" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button type="button" className="icon" onClick={() => seek(0)} aria-label="Restart">
          <RotateCcw size={15} />
        </button>
        <div className="scrub">
          <div className="ticks">
            {scenario.events.map((ev, i) => (
              <i key={i} className={`kind-${ev.kind}`} title={KIND_META[ev.kind].label} style={{ left: `${(ev.t / scenario.duration) * 100}%`, width: `${(ev.dur / scenario.duration) * 100}%` }} />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={scenario.duration}
            step={0.05}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Timeline"
          />
        </div>
        <span className="clock">{formatTime(time)} / {formatTime(scenario.duration)}</span>
        <button type="button" className="speed" onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])} aria-label="Playback speed">
          {speed}×
        </button>
      </div>

      <nav className="tabs" aria-label="Panels">
        <button type="button" className={tab === 'log' ? 'on' : ''} onClick={() => setTab('log')}>
          <ListTree size={15} /> Events
        </button>
        <button type="button" className={tab === 'activity' ? 'on' : ''} onClick={() => setTab('activity')}>
          <Activity size={15} /> Regions
        </button>
      </nav>

      <main className="pane pane-brain">
        <div className="toolbar">
          <div className="seg" role="group" aria-label="Hemispheres">
            {(['both', 'L', 'R'] as HemiMode[]).map((h) => (
              <button type="button" key={h} className={hemis === h ? 'on' : ''} onClick={() => setHemis(h)}>
                {h === 'both' ? 'Both' : h === 'L' ? 'Left' : 'Right'}{h !== 'both' && <em> only</em>}
              </button>
            ))}
          </div>
          <button type="button" className={`toggle ${glass ? 'on' : ''}`} onClick={() => setGlass(!glass)}>
            <Layers size={14} /> <span>See-through</span>
          </button>
          <button type="button" className={`toggle ${labels ? 'on' : ''}`} onClick={() => setLabels(!labels)}>
            <Tag size={14} /> Labels
          </button>
          <button type="button" className={`toggle ${compare ? 'on' : ''}`} onClick={() => setCompare(!compare)}>
            <Columns2 size={14} /> <span>Compare<em> people</em></span>
          </button>
        </div>
        <div className={`stage ${compare ? 'split' : ''}`}>
          {profiles.map((p, i) => (
            <BrainView
              key={i}
              clock={clock}
              scenario={scenario}
              profile={p}
              glass={glass}
              hemis={hemis}
              labels={labels}
              sync={sync}
              caption={compare ? p.name : undefined}
              onSelect={selectRegion}
            />
          ))}
        </div>
        <div className="scale">
          <span>Relative engagement</span>
          <i />
          <span className="scale-ends"><b>low</b><b>high</b></span>
        </div>
        <p className="hint">Drag to rotate · scroll to zoom · click a region for the evidence</p>
      </main>

      <aside className="pane pane-activity">
        <div className="pane-head">
          <label className="field">
            <span>{compare ? 'Person A' : 'Person'}</span>
            <select value={profileA} onChange={(e) => setProfileA(e.target.value)}>
              {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          {compare && (
            <label className="field">
              <span>Person B</span>
              <select value={profileB} onChange={(e) => setProfileB(e.target.value)}>
                {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
          )}
          {profiles.map((p) => (
            <p key={p.id} className="setting">
              {compare && <b>{p.name.split(' (')[0]}: </b>}
              {p.summary}
            </p>
          ))}
        </div>
        <ActivityPanel scenario={scenario} profiles={profiles} time={time} selected={selected} onSelect={selectRegion} />
      </aside>

      {about && (
        <div className="modal-backdrop" onClick={() => setAbout(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Method and limits" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="icon close" onClick={() => setAbout(false)} aria-label="Close"><X size={16} /></button>
            <h2>Method &amp; limits</h2>
            <p>
              This is an <strong>illustrative model</strong>, not a recording. Each event in a scenario is tagged with the mental
              processes it involves (hearing, recalling, threat response…). Each process maps to the brain regions that group
              neuroimaging and lesion studies most consistently associate with it. Nothing here measures or predicts an individual’s brain.
            </p>
            <ul>
              <li><strong>Anatomy.</strong> The cortical surface is FreeSurfer’s <em>fsaverage5</em> average brain. Region positions are approximate MNI coordinates, shown as soft patches rather than exact borders. Deep structures, cerebellum and brainstem are simplified shapes at their approximate locations.</li>
              <li><strong>Intensity.</strong> Colour shows relative engagement on an arbitrary 0–100 scale. Timing is sped up: the blood-flow signal measured by fMRI lags by several seconds.</li>
              <li><strong>Regions are not modules.</strong> Every region shown takes part in many functions, and no emotion lives in one place (Lindquist 2012). Seeing a region light up does not reveal what someone is thinking (Poldrack 2006).</li>
              <li><strong>People.</strong> Profiles apply group-level differences reported for trait anxiety and habitual reappraisal. Real individuals vary widely and overlap between groups is large.</li>
              <li><strong>Citations</strong> were entered from general knowledge and have not yet been checked line by line against the papers.</li>
            </ul>
            <h3>Sources</h3>
            <ol className="refs">
              {Object.values(REFERENCES).map((r) => <li key={r.id}>{r.cite}</li>)}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
