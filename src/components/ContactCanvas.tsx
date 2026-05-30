import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ContactCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const w = window.innerWidth;
    const h = parent.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 6;

    // Globe
    const globeGeometry = new THREE.SphereGeometry(2.6, 32, 32);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      opacity: 0.1,
      transparent: true,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Orbit particles
    const pN = 400;
    const pg = new THREE.BufferGeometry();
    const pp = new Float32Array(pN * 3);
    for (let i = 0; i < pN; i++) {
      const phi = Math.acos(-1 + (2 * i) / pN);
      const theta = Math.sqrt(pN * Math.PI) * phi;
      pp[i * 3] = 3.8 * Math.cos(theta) * Math.sin(phi);
      pp[i * 3 + 1] = 3.8 * Math.sin(theta) * Math.sin(phi);
      pp[i * 3 + 2] = 3.8 * Math.cos(phi);
    }
    pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(pg, particlesMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      globe.rotation.y = t * 0.1;
      globe.rotation.x = t * 0.04;
      particles.rotation.y = -t * 0.05;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const width = window.innerWidth;
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
      globeGeometry.dispose();
      globeMaterial.dispose();
      pg.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="contact-canvas" className="absolute inset-0 w-full h-full pointer-events-none" />;
};
