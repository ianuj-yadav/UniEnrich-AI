"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Maximize2, RefreshCw } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  category: string;
}

export function Interactive3DCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pulseCount, setPulseCount] = useState(0);

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

    const particleCount = 110;
    const radius = Math.min(width, height) * 0.28;
    const particles: Particle[] = [];
    const categories = [
      { name: "DIN/ISO Fasteners", color: "#2563eb" },
      { name: "SKF Bearings", color: "#dc2626" },
      { name: "Fluke Multimeters", color: "#059669" },
      { name: "SMC Pneumatics", color: "#7c3aed" },
      { name: "Swagelok Valves", color: "#d97706" },
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
        vx: 0,
        vy: 0,
        vz: 0,
        radius: Math.random() * 2.6 + 1.4,
        color: cat.color,
        category: cat.name,
      });
    }

    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let shockwave = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (isMouseDown) {
        const deltaX = clientX - lastMouseX;
        const deltaY = clientY - lastMouseY;
        targetRotY += deltaX * 0.01;
        targetRotX -= deltaY * 0.01;
      } else {
        const normX = (clientX / rect.width) * 2 - 1;
        const normY = (clientY / rect.height) * 2 - 1;
        targetRotY = normX * 0.9;
        targetRotX = -normY * 0.9;
      }

      lastMouseX = clientX;
      lastMouseY = clientY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      const rect = canvas.getBoundingClientRect();
      lastMouseX = e.clientX - rect.left;
      lastMouseY = e.clientY - rect.top;
      shockwave = 1.0;
      setPulseCount((p) => p + 1);
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      rotX += (targetRotX - rotX) * 0.06 + 0.002;
      rotY += (targetRotY - rotY) * 0.06 + 0.004;

      if (shockwave > 0) {
        shockwave = Math.max(0, shockwave - 0.03);
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 400;

      // Project and sort particles by depth
      const projected = particles.map((p) => {
        const pulseOffset = shockwave > 0 ? Math.sin(shockwave * Math.PI) * 25 : 0;
        const curX = p.baseX + (p.baseX / radius) * pulseOffset;
        const curY = p.baseY + (p.baseY / radius) * pulseOffset;
        const curZ = p.baseZ + (p.baseZ / radius) * pulseOffset;

        // Rotate Y
        let x1 = curX * Math.cos(rotY) + curZ * Math.sin(rotY);
        let z1 = -curX * Math.sin(rotY) + curZ * Math.cos(rotY);

        // Rotate X
        let y2 = curY * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = curY * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Ambient floating wave
        const wave = Math.sin(time * 2.5 + p.baseX * 0.03) * 5;
        y2 += wave;

        const scale = fov / (fov + z2 + 300);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;
        const alpha = Math.max(0.3, Math.min(0.98, (z2 + radius) / (2 * radius) + 0.35));

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

      // Connecting nearest neighbour wireframes (Soft taupe on light canvas)
      ctx.lineWidth = 0.8 * window.devicePixelRatio;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 46 * window.devicePixelRatio) {
            const lineAlpha = (1 - dist / (46 * window.devicePixelRatio)) * 0.35 * projected[i].alpha;
            ctx.strokeStyle = `rgba(177, 133, 151, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Render glowing particle nodes
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

      // Holographic Orbit Rings
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 0.45 * Math.cos(rotY), radius * 0.45, rotX, 0, Math.PI * 2);
      ctx.strokeStyle = shockwave > 0 ? "rgba(177, 133, 151, 0.8)" : "rgba(177, 133, 151, 0.35)";
      ctx.lineWidth = (shockwave > 0 ? 2 : 1.2) * window.devicePixelRatio;
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border-2 border-[#e8dede] bg-[#ffffff] backdrop-blur-xl flex items-center justify-center group select-none shadow-[0_4px_24px_rgba(177,133,151,0.08)]"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
      />
      
      {/* Top HUD */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-[#ffffff]/90 border border-[#e8dede] px-3 py-1 rounded-full text-[10px] font-mono text-[#2b201a] shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-semibold">110 Taxonomy Nodes · 98.4% Grounding</span>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono bg-[#fff0f0] px-2.5 py-0.5 rounded-lg border border-[#b18597] text-[#382b22] font-semibold">
          Pulses: {pulseCount}
        </span>
      </div>

      {/* Bottom Hint HUD */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-[#7a6860] bg-[#faf6f6]/95 border border-[#e8dede] px-3 py-1.5 rounded-xl shadow-sm pointer-events-none font-semibold">
        <span>Click to trigger vector pulse</span>
        <span className="text-[#2b201a]">Drag to 3D Orbit</span>
      </div>
    </div>
  );
}
