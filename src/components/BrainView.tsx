import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Profile } from '../model/profiles';
import { UNITS, type Unit, type Vec3 } from '../model/regions';
import type { Scenario } from '../model/scenarios';
import { simulate } from '../model/simulate';

export interface Clock {
  t: number;
}

/** Keeps the cameras of several views locked together. */
export interface CameraSync {
  listeners: Set<(pos: THREE.Vector3, target: THREE.Vector3, from: object) => void>;
}

export type HemiMode = 'both' | 'L' | 'R';

interface Props {
  clock: Clock;
  scenario: Scenario;
  profile: Profile;
  glass: boolean;
  hemis: HemiMode;
  labels: boolean;
  sync: CameraSync;
  caption?: string;
  onSelect: (regionId: string) => void;
}

interface HemiData {
  positions: Float32Array;
  sulc: Float32Array;
  indices: Uint16Array;
}

const meshCache = new Map<string, Promise<HemiData>>();
function loadHemi(name: 'left' | 'right'): Promise<HemiData> {
  let p = meshCache.get(name);
  if (!p) {
    p = fetch(`/brain/${name}.bin`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load brain surface (${r.status})`);
        return r.arrayBuffer();
      })
      .then((buf) => {
        const [nv, nt] = new Uint32Array(buf, 0, 2);
        const positions = new Float32Array(buf, 8, nv * 3);
        const sulc = new Float32Array(buf, 8 + nv * 12, nv);
        const indices = new Uint16Array(buf, 8 + nv * 16, nt * 3);
        return { positions, sulc, indices };
      });
    meshCache.set(name, p);
  }
  return p;
}

const HEAT_GLSL = /* glsl */ `
vec3 heatColor(float h) {
  vec3 c = mix(vec3(0.72, 0.05, 0.03), vec3(1.0, 0.48, 0.05), smoothstep(0.15, 0.6, h));
  return mix(c, vec3(1.0, 0.93, 0.55), smoothstep(0.6, 1.0, h));
}`;

/** JS twin of heatColor() for objects coloured on the CPU. */
function heatColor(h: number, out: THREE.Color): THREE.Color {
  const ss = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const a = ss(0.15, 0.6, h);
  const b = ss(0.6, 1, h);
  const r = 0.72 + (1 - 0.72) * a;
  const g = 0.05 + (0.48 - 0.05) * a;
  const bl = 0.03 + (0.05 - 0.03) * a;
  return out.setRGB(r + (1 - r) * b, g + (0.93 - g) * b, bl + (0.55 - bl) * b);
}

function cortexMaterial(): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.62, metalness: 0.0 });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float heat;\nvarying float vHeat;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHeat = heat;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying float vHeat;\n${HEAT_GLSL}`)
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float hh = clamp(vHeat, 0.0, 1.0);
        float hm = smoothstep(0.05, 0.42, hh);
        vec3 hot = heatColor(hh);
        diffuseColor.rgb = mix(diffuseColor.rgb, hot, hm * 0.8);`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\ntotalEmissiveRadiance += hot * hm * (0.25 + 0.75 * hh);',
      );
  };
  return mat;
}

const GYRUS = new THREE.Color('#cdb9b0');
const SULCUS = new THREE.Color('#5e4f4b');
const TISSUE = new THREE.Color('#b3a098');
const NUCLEUS = new THREE.Color('#8f8580');

interface SparseWeights {
  idx: Uint32Array;
  w: Float32Array;
}

function buildHemisphere(data: HemiData, side: 'L' | 'R') {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
  geo.setIndex(new THREE.BufferAttribute(data.indices, 1));
  geo.computeVertexNormals();
  const n = data.sulc.length;
  const colors = new Float32Array(n * 3);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    // sulc > 0 is deep in a fold: darken, which reads as ambient occlusion.
    const depth = Math.min(1, Math.max(0, (data.sulc[i] + 0.5) / 1.9));
    c.copy(GYRUS).lerp(SULCUS, Math.pow(depth, 1.2));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const heat = new THREE.BufferAttribute(new Float32Array(n), 1);
  heat.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('heat', heat);

  // Per-unit Gaussian footprint on this hemisphere's surface.
  const weights = new Map<string, SparseWeights>();
  for (const unit of UNITS) {
    if (unit.region.kind !== 'cortex') continue;
    if (unit.hemi !== 'M' && unit.hemi !== side) continue;
    const sigma = unit.region.sigma ?? 10;
    const inv = 1 / (2 * sigma * sigma);
    const idx: number[] = [];
    const w: number[] = [];
    const [cx, cy, cz] = unit.center;
    for (let i = 0; i < n; i++) {
      const dx = data.positions[i * 3] - cx;
      const dy = data.positions[i * 3 + 1] - cy;
      const dz = data.positions[i * 3 + 2] - cz;
      const g = Math.exp(-(dx * dx + dy * dy + dz * dz) * inv);
      if (g > 0.03) {
        idx.push(i);
        w.push(g);
      }
    }
    // Buried regions never reach the outer surface at full strength; normalise so the peak is 1.
    const peak = Math.max(...w, 0.0001);
    weights.set(unit.id, { idx: Uint32Array.from(idx), w: Float32Array.from(w, (v) => v / peak) });
  }
  return { geo, heat, weights };
}

/** Ellipsoid with fine horizontal folia, standing in for one cerebellar hemisphere. */
function cerebellumGeometry(center: Vec3, radii: Vec3): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 72, 56);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const wob = Math.sin(x * 3.1 + y * 2.3) * 0.35;
    const folia = Math.sin(z * 26 + wob * 3.0 + y * 4.0);
    const d = 1 + 0.022 * folia;
    pos.setXYZ(i, center[0] + x * radii[0] * d, center[1] + y * radii[1] * d, center[2] + z * radii[2] * d);
    c.copy(SULCUS).lerp(TISSUE, 0.5 + 0.5 * folia);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

/** Lofted tube through MNI-space control points: midbrain, pons, medulla. */
function brainstemGeometry(): THREE.BufferGeometry {
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -24, -2),
    new THREE.Vector3(0, -27, -16),
    new THREE.Vector3(0, -28, -32),
    new THREE.Vector3(0, -36, -48),
    new THREE.Vector3(0, -40, -64),
  ]);
  const radius = (u: number) => {
    const pons = Math.exp(-Math.pow((u - 0.47) / 0.17, 2));
    return 9.5 + 5.5 * pons - 3.5 * u;
  };
  const rings = 40;
  const seg = 28;
  const positions: number[] = [];
  const index: number[] = [];
  for (let i = 0; i <= rings; i++) {
    const u = i / rings;
    const p = path.getPoint(u);
    const tan = path.getTangent(u);
    const side = new THREE.Vector3(1, 0, 0);
    const fwd = new THREE.Vector3().crossVectors(tan, side).normalize();
    const r = radius(u);
    for (let j = 0; j < seg; j++) {
      const a = (j / seg) * Math.PI * 2;
      // Pons bulges forward (anterior) more than sideways.
      const bulge = 1 + 0.25 * Math.max(0, -Math.sin(a)) * Math.exp(-Math.pow((u - 0.47) / 0.17, 2));
      positions.push(
        p.x + Math.cos(a) * r * 1.12,
        p.y + Math.sin(a) * fwd.y * r * bulge,
        p.z + Math.sin(a) * fwd.z * r * bulge,
      );
    }
  }
  for (let i = 0; i < rings; i++)
    for (let j = 0; j < seg; j++) {
      const a = i * seg + j;
      const b = i * seg + ((j + 1) % seg);
      index.push(a, a + seg, b, b, a + seg, b + seg);
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}

function glowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const MAX_LABELS = 7;
const CENTER = new THREE.Vector3(0, -18, 12); // MNI-space pivot

export default function BrainView(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const live = useRef(props);
  live.current = props;
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const host = hostRef.current!;
    const labelHost = labelRef.current!;
    let disposed = false;
    const self = {};

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 10, 2000);
    camera.position.set(-345, 55, -45);

    scene.add(new THREE.HemisphereLight('#e9eef5', '#2a2522', 0.6));
    const key = new THREE.DirectionalLight('#fff4e8', 1.65);
    const fill = new THREE.DirectionalLight('#9db4d6', 0.5);
    // Lights follow the camera so the surface relief stays readable from every side.
    camera.add(key, fill);
    key.position.set(-120, 180, 160);
    fill.position.set(200, -60, 80);
    scene.add(camera);

    // MNI (x right, y anterior, z up) -> three.js (y up).
    const brain = new THREE.Group();
    brain.rotation.x = -Math.PI / 2;
    brain.position.set(-CENTER.x, -CENTER.z, CENTER.y);
    scene.add(brain);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 180;
    controls.maxDistance = 700;
    controls.rotateSpeed = 0.7;

    let applyingRemote = false;
    const onRemote = (pos: THREE.Vector3, target: THREE.Vector3, from: object) => {
      if (from === self) return;
      applyingRemote = true;
      camera.position.copy(pos);
      controls.target.copy(target);
      camera.lookAt(target);
      applyingRemote = false;
    };
    live.current.sync.listeners.add(onRemote);
    const sync = live.current.sync;
    controls.addEventListener('change', () => {
      if (applyingRemote) return;
      sync.listeners.forEach((fn) => fn(camera.position, controls.target, self));
    });

    // --- Deep structures, cerebellum, brainstem (procedural) ---
    const glowTex = glowTexture();
    const solids = new Map<string, THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>();
    const glows = new Map<string, THREE.Sprite>();
    const disposables: { dispose(): void }[] = [glowTex];

    const stemMat = new THREE.MeshStandardMaterial({ color: TISSUE, roughness: 0.7 });
    const stem = new THREE.Mesh(brainstemGeometry(), stemMat);
    brain.add(stem);
    disposables.push(stem.geometry, stemMat);

    for (const unit of UNITS) {
      const { region, center } = unit;
      if (region.kind === 'cerebellum') {
        const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.65 });
        const mesh = new THREE.Mesh(cerebellumGeometry(center, region.radii!), mat);
        brain.add(mesh);
        solids.set(unit.id, mesh);
        disposables.push(mesh.geometry, mat);
      } else if (region.kind === 'nucleus') {
        const mat = new THREE.MeshStandardMaterial({ color: NUCLEUS, roughness: 0.6 });
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), mat);
        mesh.scale.set(...region.radii!);
        mesh.position.set(...center);
        if (region.id === 'hippocampus') mesh.rotation.x = 0.42; // rises towards the back
        brain.add(mesh);
        solids.set(unit.id, mesh);
        disposables.push(mesh.geometry, mat);
      }
      if (region.deep) {
        const mat = new THREE.SpriteMaterial({
          map: glowTex,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          transparent: true,
          opacity: 0,
        });
        const sprite = new THREE.Sprite(mat);
        const size = Math.max(...(region.radii ?? [9, 9, 9])) * 3.4;
        sprite.scale.set(size, size, 1);
        sprite.position.set(...center);
        sprite.renderOrder = 10;
        brain.add(sprite);
        glows.set(unit.id, sprite);
        disposables.push(mat);
      }
    }

    // --- Cortical surface (real anatomy) ---
    const hemiMeshes: { side: 'L' | 'R'; mesh: THREE.Mesh; heat: THREE.BufferAttribute; weights: Map<string, SparseWeights> }[] = [];
    const cortexMat = cortexMaterial();
    // Depth-only pass so that in see-through mode only the nearest layer of cortex is blended.
    const depthMat = new THREE.MeshBasicMaterial({ colorWrite: false });
    const depthMeshes: THREE.Mesh[] = [];
    disposables.push(cortexMat, depthMat);
    Promise.all([loadHemi('left'), loadHemi('right')])
      .then(([l, r]) => {
        if (disposed) return;
        for (const [data, side] of [[l, 'L'], [r, 'R']] as const) {
          const { geo, heat, weights } = buildHemisphere(data, side);
          const mesh = new THREE.Mesh(geo, cortexMat);
          const pre = new THREE.Mesh(geo, depthMat);
          pre.renderOrder = 4;
          mesh.renderOrder = 5;
          brain.add(mesh, pre);
          depthMeshes.push(pre);
          hemiMeshes.push({ side, mesh, heat, weights });
          disposables.push(geo);
        }
        setStatus('ready');
      })
      .catch(() => !disposed && setStatus('error'));

    // --- Labels ---
    const labelEls: HTMLDivElement[] = [];
    for (let i = 0; i < MAX_LABELS; i++) {
      const el = document.createElement('div');
      el.className = 'brain-label';
      el.innerHTML = '<i></i><span></span>';
      labelHost.appendChild(el);
      labelEls.push(el);
    }

    // --- Picking ---
    const raycaster = new THREE.Raycaster();
    let downAt: [number, number] | null = null;
    const onDown = (e: PointerEvent) => (downAt = [e.clientX, e.clientY]);
    const onUp = (e: PointerEvent) => {
      if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(brain.children.filter((o) => o.visible && (o as THREE.Mesh).isMesh && !depthMeshes.includes(o as THREE.Mesh)), false);
      if (!hits.length) return;
      const p = brain.worldToLocal(hits[0].point.clone());
      let best: Unit | null = null;
      let bestD = 28;
      for (const unit of UNITS) {
        const d = Math.hypot(p.x - unit.center[0], p.y - unit.center[1], p.z - unit.center[2]);
        const reach = unit.region.kind === 'cerebellum' ? d - 20 : d;
        if (reach < bestD) {
          bestD = reach;
          best = unit;
        }
      }
      if (best) live.current.onSelect(best.region.id);
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      // Keep the whole brain in frame on narrow panes.
      camera.fov = Math.min(64, 32 * Math.max(1, 1.15 / (w / h)));
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const tmpColor = new THREE.Color();
    const tmpVec = new THREE.Vector3();
    const camLocal = new THREE.Vector3();
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const { clock, scenario, profile, glass, hemis, labels } = live.current;
      const act = simulate(scenario, profile, clock.t);
      controls.update();

      if (cortexMat.transparent !== glass) {
        cortexMat.transparent = glass;
        cortexMat.needsUpdate = true;
      }
      cortexMat.opacity = glass ? 0.38 : 1;

      for (const h of hemiMeshes) {
        h.mesh.visible = hemis === 'both' || hemis === h.side;
        const arr = h.heat.array as Float32Array;
        arr.fill(0);
        for (const [uid, sw] of h.weights) {
          const a = act[uid];
          if (!a || a < 0.02) continue;
          for (let k = 0; k < sw.idx.length; k++) arr[sw.idx[k]] += a * sw.w[k];
        }
        h.heat.needsUpdate = true;
      }

      depthMeshes.forEach((m, i) => (m.visible = glass && hemiMeshes[i].mesh.visible));

      for (const unit of UNITS) {
        const a = act[unit.id] ?? 0;
        const shown = unit.hemi === 'M' || hemis === 'both' || hemis === unit.hemi;
        const solid = solids.get(unit.id);
        if (solid) {
          const mat = solid.material;
          solid.visible = shown;
          const m = Math.min(1, Math.max(0, (a - 0.05) / 0.4));
          heatColor(a, tmpColor);
          mat.emissive.copy(tmpColor).multiplyScalar(m * (0.3 + 0.7 * a));
          if (!mat.vertexColors) mat.color.copy(NUCLEUS).lerp(tmpColor, m * 0.8);
        }
        const sprite = glows.get(unit.id);
        if (sprite) {
          sprite.visible = shown && a > 0.06;
          sprite.material.opacity = Math.min(0.8, a * 0.75);
          heatColor(a, sprite.material.color);
        }
      }

      renderer.render(scene, camera);

      // Labels for the most active units.
      const w = host.clientWidth;
      const hgt = host.clientHeight;
      camLocal.copy(camera.position);
      brain.worldToLocal(camLocal);
      const visible = (u: Unit) => u.hemi === 'M' || hemis === 'both' || hemis === u.hemi;
      const ranked: { text: string; pos: Vec3; score: number }[] = [];
      if (labels) {
        for (const u of UNITS) {
          const a = act[u.id] ?? 0;
          if (a <= 0.3 || !visible(u)) continue;
          const medial = Math.abs(u.center[0]) < 15;
          const other = u.hemi === 'L' ? `${u.region.id}:R` : u.hemi === 'R' ? `${u.region.id}:L` : '';
          const paired = medial && hemis === 'both' && (act[other] ?? 0) > 0.3;
          if (paired && u.hemi === 'R') continue; // one label for both sides of a midline structure
          // Lateral cortex on the far side of the brain is hidden from view.
          const lateral = u.region.kind === 'cortex' && !u.region.deep && !medial;
          if (lateral && hemis === 'both' && Math.sign(u.center[0]) !== Math.sign(camLocal.x)) continue;
          ranked.push({
            text: u.hemi === 'M' || paired ? u.region.short : `${u.region.short} · ${u.hemi}`,
            pos: paired ? [0, u.center[1], u.center[2]] : u.center,
            score: paired ? Math.max(a, act[other]) : a,
          });
        }
        ranked.sort((p, q) => q.score - p.score);
        ranked.length = Math.min(ranked.length, MAX_LABELS);
      }
      const placed: { x: number; y: number }[] = [];
      labelEls.forEach((el, i) => {
        const r = ranked[i];
        if (!r) {
          el.style.opacity = '0';
          return;
        }
        tmpVec.set(...r.pos);
        brain.localToWorld(tmpVec).project(camera);
        const x = (tmpVec.x * 0.5 + 0.5) * w;
        let y = (-tmpVec.y * 0.5 + 0.5) * hgt;
        // Nudge apart labels that would sit on top of each other.
        for (let pass = 0; pass < 4; pass++)
          for (const p of placed) if (Math.abs(p.x - x) < 130 && Math.abs(p.y - y) < 19) y = p.y + 19;
        placed.push({ x, y });
        el.style.opacity = String(Math.min(1, 0.35 + r.score));
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        const span = el.lastElementChild as HTMLSpanElement;
        if (span.textContent !== r.text) span.textContent = r.text;
      });
    };
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      sync.listeners.delete(onRemote);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      host.removeChild(renderer.domElement);
      labelEls.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="brain-view">
      <div className="brain-canvas" ref={hostRef} />
      <div className="brain-labels" ref={labelRef} />
      {props.caption && <div className="brain-caption">{props.caption}</div>}
      {status === 'loading' && <div className="brain-status">Loading cortical surface…</div>}
      {status === 'error' && <div className="brain-status">The brain surface could not be loaded.</div>}
    </div>
  );
}
