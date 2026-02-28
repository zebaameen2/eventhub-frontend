import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sky, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";

/* ================= REAL WATER ================= */
function Ocean() {
  const ref = useRef();

  const water = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(200, 200);

    return new Water(geometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals: new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/waternormals.jpg",
        (t) => {
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
        },
      ),
      sunDirection: new THREE.Vector3(1, 1, 1),
      sunColor: 0xffffff,
      waterColor: 0x0a4f6a,
      distortionScale: 3.5,
      fog: true,
    });
  }, []);

  useFrame((_, delta) => {
    if (ref.current?.material?.uniforms?.time) {
      ref.current.material.uniforms.time.value += delta;
    }
  });

  return (
    <primitive
      ref={ref}
      object={water}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.6, 0]}
    />
  );
}

/* ================= BOAT (MOUSE LOOK ONLY) ================= */
function Boat() {
  const ref = useRef();
  const { scene } = useGLTF("/assets/Ship.glb");
  const { mouse } = useThree();

  useEffect(() => {
    scene.scale.set(0.2, 0.2, 0.2);
    scene.position.set(4.5, -1.3, -3);
  }, [scene]);

  useFrame(() => {
    const t = performance.now() * 0.001;

    // floating only
    scene.position.y = -1.3 + Math.sin(t * 0.8) * 0.06;

    // mouse follow (rotation only)
    ref.current.rotation.y += (mouse.x * 0.8 - ref.current.rotation.y) * 0.08;
    ref.current.rotation.x += (-mouse.y * 0.3 - ref.current.rotation.x) * 0.06;
  });

  return <primitive ref={ref} object={scene} />;
}

/* ================= LIGHTHOUSE (STATIC) ================= */

function Lighthouse() {
  const { scene } = useGLTF("/assets/ship2.glb");
  const ref = useRef();
  const { mouse } = useThree();

  useEffect(() => {
    scene.scale.set(0.13, 0.13, 0.13);
    scene.position.set(-5, -1.55, -2.1);
  }, [scene]);

  useFrame(() => {
    const t = performance.now() * 0.001;

    // floating only
    scene.position.y = -1.3 + Math.sin(t * 0.8) * 0.06;

    // mouse follow (rotation only)
    ref.current.rotation.y += (mouse.x * 0.8 - ref.current.rotation.y) * 0.08;
    ref.current.rotation.x += (-mouse.y * 0.3 - ref.current.rotation.x) * 0.06;
  });

  return <primitive ref={ref} object={scene} />;
}

/* ================= MAIN ================= */
export default function AuthBackground3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 1.2, 4.8], fov: 55 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[40, 15, 40]} />

          <ambientLight intensity={0.6} />
          <directionalLight position={[8, 10, 6]} intensity={1.3} />

          <Environment preset="sunset" />

          <Ocean />
          <Boat />
          <Lighthouse />

          <fog attach="fog" args={["#3a6a83", 8, 30]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
