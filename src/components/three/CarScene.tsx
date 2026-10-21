"use client";

// 3D-Modell: "Car Concept" aus den Khronos glTF Sample Assets (CC-BY 4.0),
// basierend auf einem Public-Domain-Modell von Unity Fan. Materialien werden zur Laufzeit ersetzt.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { KTX2Loader } from "three-stdlib";

export type Hotspot = { id: string; label: string; mesh: string; offset?: [number, number, number] };
export type Finish = "vorher" | "nachher";

const MODEL = "/models/car.glb";
const CAM_END = new THREE.Vector3(5.9, 1.45, 6.5);
const CAM_START = new THREE.Vector3(9.5, 3.4, 10.5);

let ktx2: KTX2Loader | null = null;
function getKtx2(gl: THREE.WebGLRenderer) {
  if (!ktx2) ktx2 = new KTX2Loader().setTranscoderPath("/basis/").detectSupport(gl);
  return ktx2;
}

// Lack: Graphit-Metallic mit Klarlack. "Vorher" = matt und stumpf, "Nachher" = Spiegelglanz.
const paint = new THREE.MeshPhysicalMaterial({
  color: "#17181c",
  metalness: 0.8,
  roughness: 0.3,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  envMapIntensity: 1.2,
});
const finishTargets: Record<Finish, { roughness: number; clearcoat: number; clearcoatRoughness: number; color: THREE.Color }> = {
  nachher: { roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.03, color: new THREE.Color("#17181c") },
  vorher: { roughness: 0.78, clearcoat: 0.08, clearcoatRoughness: 0.6, color: new THREE.Color("#2a2a2c") },
};

type Markers = RefObject<Map<string, HTMLButtonElement>>;

function Car({ hotspots, markers, finish }: { hotspots: Hotspot[]; markers: Markers; finish: Finish }) {
  const gl = useThree((s) => s.gl);
  const { scene } = useGLTF(MODEL, false, true, (loader) => {
    loader.setKTX2Loader(getKtx2(gl));
  });

  useLayoutEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      const mat = m.material as THREE.MeshStandardMaterial;
      const name = mat?.name ?? "";
      if (name.startsWith("Paint")) m.material = paint;
      else if (name.startsWith("Interior 3")) {
        mat.color.set("#2a0b0d"); // dunkles Bordeaux statt Knallrot
      } else if (name === "Headlight") {
        mat.emissive.set("#ffffff");
        mat.emissiveIntensity = 6;
        mat.toneMapped = false;
      } else if (name === "Brakelight") {
        mat.emissive.set("#ff1a1a");
        mat.emissiveIntensity = 5;
        mat.toneMapped = false;
      } else if (name === "Signallight") {
        mat.emissive.set("#ff8a00");
        mat.emissiveIntensity = 1.5;
      } else if (name === "Rim1" || name === "Rim2") {
        mat.metalness = 1;
        mat.roughness = 0.25;
      }
      // Logos/Kennzeichen aus dem Beispielmodell ausblenden
      if (m.name === "License Plate" || m.name === "InteriorSteeringEmblem") m.visible = false;
    });
  }, [scene]);

  // Modell mittig auf den Boden stellen
  const offset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const c = box.getCenter(new THREE.Vector3());
    return new THREE.Vector3(-c.x, -box.min.y, -c.z);
  }, [scene]);

  const anchors = useMemo(() => {
    scene.updateMatrixWorld(true);
    return hotspots.flatMap((h) => {
      const obj = scene.getObjectByName(h.mesh);
      if (!obj) return [];
      const c = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3()).add(offset);
      if (h.offset) c.add(new THREE.Vector3(...h.offset));
      return [{ id: h.id, pos: c }];
    });
  }, [scene, hotspots, offset]);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const toCam = useMemo(() => new THREE.Vector3(), []);
  const side = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }, delta) => {
    // Lack weich zwischen Vorher und Nachher überblenden
    const t = finishTargets[finish];
    const k = 1 - Math.exp(-delta * 4);
    paint.roughness += (t.roughness - paint.roughness) * k;
    paint.clearcoat += (t.clearcoat - paint.clearcoat) * k;
    paint.clearcoatRoughness += (t.clearcoatRoughness - paint.clearcoatRoughness) * k;
    paint.color.lerp(t.color, k);

    // Hotspots auf den Bildschirm projizieren
    for (const a of anchors) {
      const el = markers.current.get(a.id);
      if (!el) continue;
      tmp.copy(a.pos).project(camera);
      const x = (tmp.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.y * 0.5 + 0.5) * size.height;
      toCam.copy(camera.position).sub(a.pos).normalize();
      side.set(a.pos.x, 0, a.pos.z).normalize();
      const facing = toCam.dot(side) > -0.25;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      el.style.opacity = facing ? "1" : "0";
      el.style.pointerEvents = facing ? "auto" : "none";
    }
  });

  return <primitive object={scene} position={offset} />;
}

// Kamera fährt beim ersten Laden ans Auto heran. Auf schmalen Bühnen (Handy) bleibt sie weiter weg,
// damit das ganze Auto ins Bild passt.
function CameraIntro({ enabled }: { enabled: boolean }) {
  const done = useRef(false);
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const end = useMemo(() => {
    const factor = aspect < 0.9 ? 1.45 : aspect < 1.3 ? 1.2 : aspect > 1.8 ? 0.84 : 1;
    return CAM_END.clone().multiplyScalar(factor);
  }, [aspect]);
  useLayoutEffect(() => {
    camera.position.copy(enabled ? CAM_START.clone().multiplyScalar(end.length() / CAM_END.length()) : end);
    done.current = !enabled;
  }, [camera, enabled, end]);
  useFrame((_, delta) => {
    if (done.current) return;
    camera.position.lerp(end, 1 - Math.exp(-delta * 1.6));
    if (camera.position.distanceTo(end) < 0.02) done.current = true;
  });
  return null;
}

// Auf breiten Bühnen liegt rechts das Info-Panel. Das Bild wird darum nach links verschoben,
// ohne das Auto im Raum zu verschieben (Drehpunkt bleibt die Automitte).
function ViewShift() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const px = size.width >= 1180 ? 190 : 0; // Panel schwebt erst ab xl (1280px Fenster) über der Bühne
    if (px > 0) camera.setViewOffset(size.width + 2 * px, size.height, 2 * px, 0, size.width, size.height);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

// Weicher Lichtkegel auf dem Boden unter dem Auto
function FloorGlow() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,0.55)");
    grad.addColorStop(0.45, "rgba(255,255,255,0.12)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.003, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} color="#3a3c44" blending={THREE.AdditiveBlending} />
      </mesh>
      {/* dünner roter Lichtring auf dem Boden, leuchtet durch Bloom */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.004, 0]}>
        <ringGeometry args={[3.35, 3.37, 160]} />
        <meshBasicMaterial color={[2.4, 0.25, 0.28]} toneMapped={false} transparent opacity={0.85} />
      </mesh>
    </>
  );
}

function Progress() {
  const { progress, active } = useProgress();
  if (!active && progress === 100) return null;
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className="w-40 text-center text-sm text-muted">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-accent transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3">3D-Modell lädt</p>
      </div>
    </div>
  );
}

export default function CarScene({
  hotspots,
  active,
  onSelect,
  autoRotate,
  finish,
  running,
  reduceMotion,
}: {
  hotspots: Hotspot[];
  active: string | null;
  onSelect: (id: string) => void;
  autoRotate: boolean;
  finish: Finish;
  running: boolean;
  reduceMotion: boolean;
}) {
  const markers = useRef(new Map<string, HTMLButtonElement>());

  return (
    <div className="relative h-full w-full">
      <Canvas
        frameloop={running ? "always" : "never"}
        camera={{ position: CAM_END.toArray(), fov: 26, near: 0.1, far: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ViewShift />
        <color attach="background" args={["#0a0a0c"]} />
        <fog attach="fog" args={["#0a0a0c", 9, 20]} />

        <Suspense fallback={null}>
          <Car hotspots={hotspots} markers={markers} finish={finish} />
          <CameraIntro enabled={!reduceMotion} />
          <ContactShadows
            position={[0, 0.002, 0]}
            opacity={0.95}
            scale={10}
            blur={2.2}
            far={1.4}
            resolution={1024}
            color="#000000"
            frames={1}
          />
        </Suspense>

        {/* Spiegelnder Showroom-Boden */}
        <mesh rotation-x={-Math.PI / 2}>
          <planeGeometry args={[60, 60]} />
          <MeshReflectorMaterial
            blur={[400, 120]}
            resolution={1024}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            color="#08080a"
            metalness={0.5}
            mirror={0}
          />
        </mesh>
        <FloorGlow />

        {/* Studio wie bei einem Fotoshooting: Softbox oben, LED-Röhren, Seitenflächen, rotes Kantenlicht */}
        <Environment resolution={512} frames={1}>
          <color attach="background" args={["#050506"]} />
          <Lightformer intensity={3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 3.5, 1]} />
          <Lightformer intensity={4} position={[-2.2, 5, 0]} rotation-x={Math.PI / 2} scale={[14, 0.25, 1]} />
          <Lightformer intensity={4} position={[2.2, 5, 0]} rotation-x={Math.PI / 2} scale={[14, 0.25, 1]} />
          <Lightformer intensity={1.6} position={[-7, 2, 0]} rotation-y={Math.PI / 2} scale={[12, 2.2, 1]} />
          <Lightformer intensity={1.6} position={[7, 2, 0]} rotation-y={-Math.PI / 2} scale={[12, 2.2, 1]} />
          <Lightformer intensity={0.8} position={[0, 1.5, 8]} scale={[10, 1.5, 1]} />
          <Lightformer form="ring" color="#e0353b" intensity={2.5} position={[-5, 2.5, -7]} scale={3} />
          <Lightformer form="rect" color="#e0353b" intensity={2} position={[6, 0.6, -5]} rotation-y={-Math.PI / 4} scale={[4, 0.4, 1]} />
        </Environment>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.08}
          autoRotate={autoRotate}
          autoRotateSpeed={0.45}
          target={[0, 0.5, 0]}
        />

        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={1} intensity={0.9} radius={0.6} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette offset={0.25} darkness={0.75} />
        </EffectComposer>
      </Canvas>

      {/* DOM-Marker, Position wird in useFrame gesetzt */}
      <div className="pointer-events-none absolute inset-0">
        {hotspots.map((h) => (
          <button
            key={h.id}
            ref={(el) => {
              if (el) markers.current.set(h.id, el);
              else markers.current.delete(h.id);
            }}
            type="button"
            onClick={() => onSelect(h.id)}
            aria-label={h.label}
            aria-pressed={active === h.id}
            style={{ opacity: 0 }}
            className={`group absolute left-0 top-0 grid size-10 place-items-center rounded-full border backdrop-blur-md transition-[opacity,background-color,border-color] duration-300 ${
              active === h.id ? "border-accent bg-accent/90 text-white" : "border-white/25 bg-black/35 text-white hover:border-white/60"
            }`}
          >
            {active === h.id && (
              <span className="absolute inset-0 animate-ping rounded-full border border-accent/70 motion-reduce:hidden" />
            )}
            <span className="size-1.5 rounded-full bg-current" />
            <span className="pointer-events-none absolute left-10 whitespace-nowrap rounded-full bg-black/75 px-2.5 py-1 text-xs opacity-0 transition group-hover:opacity-100">
              {h.label}
            </span>
          </button>
        ))}
      </div>

      <Progress />
    </div>
  );
}
