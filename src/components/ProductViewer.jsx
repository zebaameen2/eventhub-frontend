import { useRef, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
  Float,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * Optimized product mesh: low-poly rounded box (product-like shape).
 * Uses BufferGeometry with shared material for performance.
 */
function ProductModel({ color = "#f02e65", metalness = 0.2, roughness = 0.4 }) {
  const meshRef = useRef();
  const geometry = useMemo(() => {
    // Rounded box: low segment count for performance (widthSegments, heightSegments, depthSegments)
    const g = new THREE.BoxGeometry(1.2, 1.6, 0.8, 8, 12, 6);
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        castShadow
        receiveShadow
        position={[0, 0.9, 0]}
      >
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          envMapIntensity={1.2}
        />
      </mesh>
    </Float>
  );
}

/**
 * Optional: GLB product if available at /assets/product.glb
 * Falls back to ProductModel if path not provided.
 */
function Product({ src, color, ...props }) {
  if (!src) return <ProductModel color={color} {...props} />;
  try {
    return <ProductGLB src={src} color={color} {...props} />;
  } catch {
    return <ProductModel color={color} {...props} />;
  }
}

function ProductGLB({ src, color }) {
  const { scene } = useGLTF(src, true);
  const cloned = useMemo(() => {
    const s = scene.clone();
    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.envMapIntensity = 1.2;
          if (color) child.material.color.set(color);
        }
      }
    });
    s.scale.setScalar(1.2);
    s.position.y = 0.9;
    return s;
  }, [scene, color]);

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <primitive object={cloned} />
    </Float>
  );
}

function Scene({ productColor, productSrc }) {
  return (
    <>
      <color attach="background" args={["#0a0a0f"]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-4, 4, -3]} intensity={0.4} />
      <Environment preset="studio" environmentIntensity={1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.35} />
      </mesh>
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={12}
        blur={2}
        far={4}
      />
      <Product src={productSrc} color={productColor} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={12}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
        enablePan={true}
        makeDefault
      />
    </>
  );
}

export default function ProductViewer({
  productColor = "#f02e65",
  productSrc = null,
  className = "",
  style = {},
}) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        position: "relative",
        background: "#0a0a0f",
        ...style,
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        shadows
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 1.2, 4.5], fov: 42, near: 0.1, far: 100 }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Scene productColor={productColor} productSrc={productSrc} />
        </Suspense>
      </Canvas>
    </div>
  );
}
