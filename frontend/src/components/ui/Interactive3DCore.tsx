"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  radius: number;
  color: string;
  category: string;
}

export function Interactive3DCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 400);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 400);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio || 400;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio || 400;
    };

    window.addEventListener("resize", handleResize);

    // Initialize 3D Spherical Particle Cloud
    const particleCount = 96;
    const radius = Math.min(width, height) * 0.28;
    const particles: Particle[] = [];
    const categories = [
      { name: "DIN/ISO Fasteners", color: "#3874e0" },
      { name: "SKF Bearings", color: "#ea3943" },
      { name: "Fluke Multimeters", color: "#10b981" },
      { name: "SMC Pneumatics", color: "#8b5cf6" },
      { name: "Swagelok Valves", color: "#f59e0b" },
    ];

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const cat = categories[i % categories.length];

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        radius: Math.random() * 2.2 + 1.2,
        color: cat.color,
        category: cat.name,
      });
    }

    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      const normX = (clientX / rect.width) * 2 - 1;
      const normY = (clientY / rect.height) * 2 - 1;
      targetRotY = normX * 0.8;
      targetRotX = -normY * 0.8;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      rotX += (targetRotX - rotX) * 0.05 + 0.003;
      rotY += (targetRotY - rotY) * 0.05 + 0.005;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 400;

      // Project and sort particles by depth
      const projected = particles.map((p) => {
        // Rotate Y
        let x1 = p.x * Math.cos(rotY) + p.z * Math.sin(rotY);
        let z1 = -p.x * Math.sin(rotY) + p.z * Math.cos(rotY);

        // Rotate X
        let y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = p.y * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Wave displacement
        const wave = Math.sin(time * 2 + p.baseX * 0.02) * 6;
        y2 += wave;

        const scale = fov / (fov + z2 + 300);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;
        const alpha = Math.max(0.15, Math.min(0.95, (z2 + radius) / (2 * radius) + 0.2));

        return {
          ...p,
          px,
          py,
          scale,
          z2,
          alpha,
        };
      });

      projected.sort((a, b) => b.z2 - a.z2);

      // Draw connecting wireframe lines for nearest neighbours
      ctx.lineWidth = 0.6 * window.devicePixelRatio;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 42 * window.devicePixelRatio) {
            const lineAlpha = (1 - dist / (42 * window.devicePixelRatio)) * 0.25 * projected[i].alpha;
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      projected.forEach((p) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.radius * p.scale * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8 * p.scale;
        ctx.fill();
        ctx.restore();
      });

      // Draw central holographic core ring
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 0.4 * Math.cos(rotY), radius * 0.4, rotX, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 116, 224, 0.35)";
      ctx.lineWidth = 1.2 * window.devicePixelRatio;
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center group"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
      />
      
      {/* Overlay HUD indicators */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 border border-white/15 px-2.5 py-1 rounded-full text-[10px] font-mono text-white/80 backdrop-blur-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>3D Vector Graph: 96 Taxonomy Clusters</span>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/60 border border-white/15 px-2.5 py-1 rounded-full text-[10px] font-mono text-white/80 backdrop-blur-md pointer-events-none">
        <span>Interactive Orbit • Drag to rotate</span>
      </div>
    </div>
  );
}
