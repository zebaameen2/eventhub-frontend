import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ParticleExplosion.css";

const ParticleExplosion = ({ isActive, onComplete }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const count = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = 0;
      positions[i + 1] = 0;
      positions[i + 2] = 0;

      velocity[i] = (Math.random() - 0.5) * 2;
      velocity[i + 1] = (Math.random() - 0.5) * 2;
      velocity[i + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.12,
      transparent: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let start = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - start) / 1000;

      if (elapsed > 1.8) {
        renderer.dispose();
        containerRef.current.removeChild(renderer.domElement);
        onComplete?.();
        return;
      }

      const pos = geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += velocity[i] * 0.05;
        pos[i + 1] += velocity[i + 1] * 0.05;
        pos[i + 2] += velocity[i + 2] * 0.05;
      }

      geometry.attributes.position.needsUpdate = true;
      material.opacity = 1 - elapsed / 1.8;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => renderer.dispose();
  }, [isActive]);

  return <div ref={containerRef} className="particle-explosion-container" />;
};

export default ParticleExplosion;