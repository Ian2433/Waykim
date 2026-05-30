import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CertCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.offsetWidth;
    const h = parent.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 50);
    camera.position.z = 5;

    const N = 250;
    const sg = new THREE.BufferGeometry();
    const sp = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      sp[i * 3] = (Math.random() - 0.5) * 18;
      sp[i * 3 + 1] = (Math.random() - 0.5) * 14;
      sp[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));

    const material = new THREE.PointsMaterial({
      color: 0x7c3aed,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    });

    const pts = new THREE.Points(sg, material);
    scene.add(pts);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      pts.rotation.y = clock.getElapsedTime() * 0.04;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.offsetWidth;
      const height = canvas.parentElement.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      sg.dispose();
      material.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="cert-canvas" className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />;
};
