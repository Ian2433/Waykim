import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.parentElement?.clientWidth || window.innerWidth, canvas.parentElement?.clientHeight || window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      (canvas.parentElement?.clientWidth || window.innerWidth) / (canvas.parentElement?.clientHeight || window.innerHeight),
      0.1,
      100
    );
    camera.position.z = 5;

    // Particles
    const count = 700;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    
    const particles = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xa855f7,
        size: 0.05,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
      })
    );
    scene.add(particles);

    // Shapes
    const sm = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      opacity: 0.15,
      transparent: true,
    });
    
    const shapes = [
      { g: new THREE.IcosahedronGeometry(0.9, 0), p: [-4, 1.5, -2] as [number, number, number] },
      { g: new THREE.OctahedronGeometry(0.7, 0), p: [4, -1, -3] as [number, number, number] },
      { g: new THREE.TetrahedronGeometry(0.6, 0), p: [-2.5, -2.5, -1.5] as [number, number, number] },
    ];

    const meshes = shapes.map((s, i) => {
      const m = new THREE.Mesh(s.g, sm.clone());
      m.position.set(...s.p);
      scene.add(m);
      return { mesh: m, orig: s.p };
    });

    let pmx = 0;
    let pmy = 0;

    const handleMouseMove = (e: MouseEvent) => {
      pmx = (e.clientX / window.innerWidth - 0.5) * 0.4;
      pmy = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      scene.rotation.y = t * 0.015;
      
      meshes.forEach((m, i) => {
        m.mesh.rotation.x = t * (0.3 + i * 0.1);
        m.mesh.rotation.y = t * (0.2 + i * 0.15);
        m.mesh.position.y = m.orig[1] + Math.sin(t + i) * 0.35;
      });

      camera.position.x += (pmx - camera.position.x) * 0.05;
      camera.position.y += (-pmy - camera.position.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geo.dispose();
      sm.dispose();
      meshes.forEach(m => {
        m.mesh.geometry.dispose();
        if (Array.isArray(m.mesh.material)) {
          m.mesh.material.forEach(mat => mat.dispose());
        } else {
          m.mesh.material.dispose();
        }
      });
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" className="absolute inset-0 w-full h-full pointer-events-none" />;
};
