"use client";

// 3D-Modell: "Car Concept" aus den Khronos glTF Sample Assets (CC-BY 4.0),
// basierend auf einem Public-Domain-Modell von Unity Fan. Lack wird zur Laufzeit schwarz gefärbt.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { KTX2Loader } from "three-stdlib";

export type Hotspot = { id: string; label: string; mesh: string; offset?: [number, number, number] };

const MODEL = "/models/car.glb";

let ktx2: KTX2Loader | null = null;
function getKtx2(gl: THREE.WebGLRenderer) {
  if (!ktx2) ktx2 = new KTX2Loader().setTranscoderPath("/basis/").detectSupport(gl);
  return ktx2;
}

const paint = new THREE.MeshPhysicalMaterial({
  color: "#0c0c0f",
  metalness: 0.55,
  roughness: 0.28,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
});

type Markers = RefObject<Map<string, HTMLButtonElement>>;

function Car({ hotspots, markers }: { hotspots: Hotspot[]; markers: Markers }) {
  const gl = useThree((s) => s.gl);
  const { scene } = useGLTF(MODEL, false, true, (loader) => {
    loader.setKTX2Loader(getKtx2(gl));
  });

  useLayoutEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const name = (m.material as THREE.Material)?.name ?? "";
      if (name.startsWith("Paint")) m.material = paint;
      // Logos/Kennzeichen aus dem Beispielmodell ausblenden
      if (m.name === "License Plate" || m.name === "InteriorSteeringEmblem") m.visible = false;
    });
  }, [scene]);

  // Modell mittig auf die Plattform stellen
  const offset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const c = box.getCenter(new THREE.Vector3());
    return new THREE.Vector3(-c.x, -box.min.y, -c.z);
  }, [scene]);

  // Hotspot-Positionen (Weltkoordinaten) aus den Bounding-Boxen der benannten Teile
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

  // Jeden Frame die 3D-Punkte auf den Bildschirm projizieren und die DOM-Marker verschieben
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const toCam = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const a of anchors) {
      const el = markers.current.get(a.id);
      if (!el) continue;
      tmp.copy(a.pos).project(camera);
      const x = (tmp.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.y * 0.5 + 0.5) * size.height;
      // Punkte auf der abgewandten Seite des Autos ausblenden
      toCam.copy(camera.position).sub(a.pos).normalize();
      const facing = toCam.dot(new THREE.Vector3(a.pos.x, 0, a.pos.z).normalize()) > -0.25;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      el.style.opacity = facing ? "1" : "0";
      el.style.pointerEvents = facing ? "auto" : "none";
    }
  });

  return <primitive object={scene} position={offset} />;
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
}: {
  hotspots: Hotspot[];
  active: string | null;
  onSelect: (id: string) => void;
  autoRotate: boolean;
}) {
  const markers = useRef(new Map<string, HTMLButtonElement>());

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [4.9, 1.8, 5.7], fov: 30 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <color attach="background" args={["#0b0b0d"]} />
        <fog attach="fog" args={["#0b0b0d", 9, 16]} />

        <Suspense fallback={null}>
          <Car hotspots={hotspots} markers={markers} />
          <ContactShadows position={[0, 0.005, 0]} opacity={0.75} scale={9} blur={2.4} far={2} />
        </Suspense>

        {/* Plattform mit rotem Rand, wie eine Drehbühne */}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
          <circleGeometry args={[2.9, 96]} />
          <meshStandardMaterial color="#111114" roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0]}>
          <ringGeometry args={[2.88, 2.92, 128]} />
          <meshBasicMaterial color="#e0353b" transparent opacity={0.7} />
        </mesh>

        {/* Studio-Licht ohne externe HDR-Datei: Lichtbalken spiegeln sich im Lack */}
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={2.2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 1.2, 1]} />
          <Lightformer intensity={1.6} position={[0, 5, 2.5]} rotation-x={Math.PI / 2} scale={[10, 0.6, 1]} />
          <Lightformer intensity={1.6} position={[0, 5, -2.5]} rotation-x={Math.PI / 2} scale={[10, 0.6, 1]} />
          <Lightformer intensity={1.2} position={[-6, 1.5, 0]} rotation-y={Math.PI / 2} scale={[8, 1.5, 1]} />
          <Lightformer intensity={1.2} position={[6, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[8, 1.5, 1]} />
          <Lightformer form="ring" color="#e0353b" intensity={3} position={[-4, 2, -6]} scale={2.5} />
        </Environment>
        <ambientLight intensity={0.15} />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 2.15}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          target={[0, 0.55, 0]}
        />
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
            className={`group absolute left-0 top-0 grid size-9 place-items-center rounded-full border backdrop-blur-md transition-[opacity,background-color,border-color] duration-300 ${
              active === h.id ? "border-accent bg-accent text-white" : "border-white/30 bg-black/40 text-white hover:border-white/60"
            }`}
          >
            <span className="absolute inset-0 animate-ping rounded-full border border-accent/60 motion-reduce:hidden" />
            <span className="size-2 rounded-full bg-current" />
            <span className="pointer-events-none absolute left-11 whitespace-nowrap rounded-full bg-black/70 px-2.5 py-1 text-xs opacity-0 transition group-hover:opacity-100">
              {h.label}
            </span>
          </button>
        ))}
      </div>

      <Progress />
    </div>
  );
}
