import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function Robot() {
  const ref = useRef();
  const { scene, animations } = useGLTF("/assets/robot.glb");
  const { mouse } = useThree();

  const mixer = useRef();
  const introDone = useRef(false);

  useEffect(() => {
    // scale chhota
    scene.scale.set(0.6, 0.6, 0.6);

    // start position (piche se)
    scene.position.z = -6;

    // animation play (hello etc.)
    if (animations.length) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        mixer.current.clipAction(clip).play();
      });
    }
  }, [scene, animations]);

  useFrame((state, delta) => {
    // animation update
    if (mixer.current) mixer.current.update(delta);

    // intro move forward
    if (!introDone.current) {
      scene.position.z += delta * 3;
      if (scene.position.z >= 0) {
        scene.position.z = 0;
        introDone.current = true;
      }
    }

    //  mouse follow (AFTER intro)
    if (introDone.current && ref.current) {
      ref.current.rotation.y = mouse.x * 0.8;
      ref.current.rotation.x = -mouse.y * 0.4;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

export default function Robot3D() {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Robot />
    </Canvas>
  );
}