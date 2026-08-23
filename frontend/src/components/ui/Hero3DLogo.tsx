"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, ShieldCheck, Cpu, RefreshCw, Layers, Zap } from "lucide-react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face3D {
  indices: number[];
  color: string;
  borderColor: string;
}

export function Hero3DLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 420);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 420);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio || 420;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio || 420;
    };

    window.addEventListener("resize", handleResize);

    // 3D Geometry: Concentric Layered Iridescent Multi-Color Octahedral Diamonds
    // Layer 1: Outer Iridescent Faceted Prism (Rich Chromatic Palette)
    const scale1 = 95;
    const vertices1: Point3D[] = [
      { x: 0, y: -scale1 * 1.3, z: 0 },   // Top
      { x: scale1, y: 0, z: 0 },          // Right
      { x: 0, y: 0, z: scale1 },          // Front
      { x: -scale1, y: 0, z: 0 },         // Left
      { x: 0, y: 0, z: -scale1 },         // Back
      { x: 0, y: scale1 * 1.3, z: 0 },    // Bottom
    ];

    const faces1: Face3D[] = [
      { indices: [0, 1, 2], color: "rgba(37, 99, 235, 0.82)", borderColor: "#38bdf8" },   // Sapphire Blue
      { indices: [0, 2, 3], color: "rgba(124, 58, 237, 0.85)", borderColor: "#c084fc" },  // Amethyst Violet
      { indices: [0, 3, 4], color: "rgba(5, 150, 105, 0.82)", borderColor: "#34d399" },   // Emerald Green
      { indices: [0, 4, 1], color: "rgba(225, 29, 72, 0.80)", borderColor: "#fb7185" },   // Ruby Coral
      { indices: [5, 2, 1], color: "rgba(217, 119, 6, 0.85)", borderColor: "#fcd34d" },   // Amber Gold
      { indices: [5, 3, 2], color: "rgba(13, 148, 136, 0.85)", borderColor: "#2dd4bf" },  // Teal Cyan
      { indices: [5, 4, 3], color: "rgba(192, 38, 211, 0.85)", borderColor: "#f472b6" },  // Fuchsia Pink
      { indices: [5, 1, 4], color: "rgba(79, 70, 229, 0.82)", borderColor: "#818cf8" },   // Indigo
    ];

    // Layer 2: Middle Vibrant Luminous Core
    const scale2 = 60;
    const vertices2: Point3D[] = [
      { x: 0, y: -scale2 * 1.25, z: 0 },
      { x: scale2, y: 0, z: 0 },
      { x: 0, y: 0, z: scale2 },
      { x: -scale2, y: 0, z: 0 },
      { x: 0, y: 0, z: -scale2 },
      { x: 0, y: scale2 * 1.25, z: 0 },
    ];

    const faces2: Face3D[] = [
      { indices: [0, 1, 2], color: "rgba(244, 63, 94, 0.88)", borderColor: "#ffffff" },
      { indices: [0, 2, 3], color: "rgba(59, 130, 246, 0.90)", borderColor: "#ffffff" },
      { indices: [0, 3, 4], color: "rgba(16, 185, 129, 0.88)", borderColor: "#ffffff" },
      { indices: [0, 4, 1], color: "rgba(245, 158, 11, 0.88)", borderColor: "#ffffff" },
      { indices: [5, 2, 1], color: "rgba(139, 92, 246, 0.90)", borderColor: "#ffffff" },
      { indices: [5, 3, 2], color: "rgba(6, 182, 212, 0.90)", borderColor: "#ffffff" },
      { indices: [5, 4, 3], color: "rgba(236, 72, 153, 0.88)", borderColor: "#ffffff" },
      { indices: [5, 1, 4], color: "rgba(249, 115, 22, 0.88)", borderColor: "#ffffff" },
    ];

    // Layer 3: Inner Radiant Core
    const scale3 = 30;
    const vertices3: Point3D[] = [
      { x: 0, y: -scale3 * 1.2, z: 0 },
      { x: scale3, y: 0, z: 0 },
      { x: 0, y: 0, z: scale3 },
      { x: -scale3, y: 0, z: 0 },
      { x: 0, y: 0, z: -scale3 },
      { x: 0, y: scale3 * 1.2, z: 0 },
    ];

    const faces3: Face3D[] = [
      { indices: [0, 1, 2], color: "rgba(255, 255, 255, 0.96)", borderColor: "#2563eb" },
      { indices: [0, 2, 3], color: "rgba(254, 240, 138, 0.96)", borderColor: "#7c3aed" },
      { indices: [0, 3, 4], color: "rgba(255, 255, 255, 0.96)", borderColor: "#059669" },
      { indices: [0, 4, 1], color: "rgba(254, 205, 211, 0.96)", borderColor: "#e11d48" },
      { indices: [5, 2, 1], color: "rgba(254, 205, 211, 0.96)", borderColor: "#d97706" },
      { indices: [5, 3, 2], color: "rgba(255, 255, 255, 0.96)", borderColor: "#0d9488" },
      { indices: [5, 4, 3], color: "rgba(254, 240, 138, 0.96)", borderColor: "#c026d3" },
      { indices: [5, 1, 4], color: "rgba(255, 255, 255, 0.96)", borderColor: "#4f46e5" },
    ];

    // Orbiting Multi-Color Sparkles
    const sparkleCount = 36;
    const sparkleColors = ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#fb7185", "#fcd34d", "#34d399", "#2dd4bf"];
    const sparkles: { angle: number; speed: number; distance: number; yOffset: number; size: number; color: string }[] = [];
    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        angle: (i / sparkleCount) * Math.PI * 2,
        speed: 0.008 + (i % 4) * 0.003,
        distance: 115 + (i % 6) * 14,
        yOffset: (Math.sin(i * 1.5) * 40),
        size: 1.8 + (i % 3) * 1.4,
        color: sparkleColors[i % sparkleColors.length],
      });
    }

    let rotX = 0.2;
    let rotY = 0;
    let targetRotX = 0.2;
    let targetRotY = 0;
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let shockwave = 0;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (isMouseDown) {
        const deltaX = clientX - lastMouseX;
        const deltaY = clientY - lastMouseY;
        targetRotY += deltaX * 0.012;
        targetRotX -= deltaY * 0.012;
      } else {
        const normX = (clientX / rect.width) * 2 - 1;
        const normY = (clientY / rect.height) * 2 - 1;
        targetRotY = normX * 0.75;
        targetRotX = -normY * 0.75 + 0.2;
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

    // 3D Matrix Projection
    const project = (p: Point3D, rX: number, rY: number, rZ: number, fov: number, cx: number, cy: number, dpr: number) => {
      let x1 = p.x * Math.cos(rY) + p.z * Math.sin(rY);
      let y1 = p.y;
      let z1 = -p.x * Math.sin(rY) + p.z * Math.cos(rY);

      let x2 = x1;
      let y2 = y1 * Math.cos(rX) - z1 * Math.sin(rX);
      let z2 = y1 * Math.sin(rX) + z1 * Math.cos(rX);

      let x3 = x2 * Math.cos(rZ) - y2 * Math.sin(rZ);
      let y3 = x2 * Math.sin(rZ) + y2 * Math.cos(rZ);
      let z3 = z2;

      const scale = fov / (fov + z3 + 300);
      return {
        x: cx + x3 * scale * dpr,
        y: cy + y3 * scale * dpr,
        z: z3,
        scale,
      };
    };

    const render = () => {
      time += 0.015;
      rotX += (targetRotX - rotX) * 0.06;
      rotY += (targetRotY - rotY) * 0.06 + 0.008;

      if (shockwave > 0) {
        shockwave = Math.max(0, shockwave - 0.025);
      }

      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;
      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 420;

      const floatY = Math.sin(time * 2) * 8 * dpr;

      // Outer Multi-Color Holographic Gyroscope Orbit Rings
      ctx.save();
      const ringRadius = 145 * dpr;
      
      // Ring 1 (Cyan/Blue Gyro)
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + floatY, ringRadius, ringRadius * 0.35, rotX + 0.1, 0, Math.PI * 2);
      ctx.strokeStyle = shockwave > 0 ? "rgba(6, 182, 212, 0.9)" : "rgba(6, 182, 212, 0.45)";
      ctx.lineWidth = (shockwave > 0 ? 3 : 1.8) * dpr;
      ctx.stroke();

      // Ring 2 (Violet/Magenta Gyro)
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + floatY, ringRadius * 0.38, ringRadius, rotY * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.45)";
      ctx.lineWidth = 1.6 * dpr;
      ctx.stroke();

      // Ring 3 (Emerald/Amber Tilted Orbit)
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + floatY, ringRadius * 0.85, ringRadius * 0.85, rotY * 0.3 + 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.stroke();

      // Shockwave ring
      if (shockwave > 0) {
        const shockRadius = (1 - shockwave) * 190 * dpr + 40 * dpr;
        ctx.beginPath();
        ctx.arc(centerX, centerY + floatY, shockRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(236, 72, 153, ${shockwave * 0.8})`;
        ctx.lineWidth = 2.5 * dpr;
        ctx.stroke();
      }
      ctx.restore();

      // Orbiting Sparkles
      sparkles.forEach((s) => {
        s.angle += s.speed;
        const sx = Math.cos(s.angle) * s.distance;
        const sz = Math.sin(s.angle) * s.distance;
        const sy = s.yOffset + Math.sin(time * 3 + s.angle) * 12;

        const proj = project({ x: sx, y: sy, z: sz }, rotX, rotY, 0, fov, centerX, centerY + floatY, dpr);

        ctx.save();
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, s.size * proj.scale * dpr, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8 * proj.scale;
        ctx.fill();
        ctx.restore();
      });

      // Render 3D Octahedron Layer function
      const renderLayer = (verts: Point3D[], faces: Face3D[], rotOffset: number, lineWidth: number) => {
        const projectedVerts = verts.map((v) => project(v, rotX, rotY + rotOffset, 0, fov, centerX, centerY + floatY, dpr));

        const sortedFaces = faces.map((face) => {
          const p0 = projectedVerts[face.indices[0]];
          const p1 = projectedVerts[face.indices[1]];
          const p2 = projectedVerts[face.indices[2]];
          const avgZ = (p0.z + p1.z + p2.z) / 3;

          const ax = p1.x - p0.x;
          const ay = p1.y - p0.y;
          const bx = p2.x - p0.x;
          const by = p2.y - p0.y;
          const normalZ = ax * by - ay * bx;

          return { face, avgZ, normalZ, p0, p1, p2 };
        });

        sortedFaces.sort((a, b) => b.avgZ - a.avgZ);

        sortedFaces.forEach((f) => {
          if (f.normalZ > -0.01) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(f.p0.x, f.p0.y);
            ctx.lineTo(f.p1.x, f.p1.y);
            ctx.lineTo(f.p2.x, f.p2.y);
            ctx.closePath();

            ctx.fillStyle = f.face.color;
            ctx.fill();

            ctx.strokeStyle = f.face.borderColor;
            ctx.lineWidth = lineWidth * dpr;
            ctx.lineJoin = "round";
            ctx.stroke();
            ctx.restore();
          }
        });
      };

      // Render iridescent multi-color concentric diamond layers
      renderLayer(vertices1, faces1, 0, 2.0);
      renderLayer(vertices2, faces2, time * 0.4, 1.6);
      renderLayer(vertices3, faces3, -time * 0.6, 1.4);

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
      className="relative w-full h-[360px] sm:h-[420px] rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-white via-[#fbfcfe] to-[#f8faff] p-6 shadow-[0_16px_48px_rgba(59,130,246,0.12)] flex items-center justify-center select-none overflow-hidden group hover:border-indigo-400 transition-all"
    >
      {/* Radiant Multi-Color Ambient Glow Backdrop */}
      <div className="absolute inset-0 bg-radial from-cyan-500/10 via-purple-500/10 to-rose-500/5 opacity-90 pointer-events-none" />

      {/* 3D Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-blue-200 shadow-md text-[10px] font-mono font-bold text-blue-900 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>UNIHACK 3D EMBLEM</span>
      </div>

      {/* Top Right Specs Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-[10px] font-mono font-bold text-purple-900 shadow-sm">
        <Sparkles className="w-3 h-3 text-purple-500" />
        <span>IRIDESCENT CORE</span>
      </div>

      {/* Bottom Hint Floating HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[10px] font-mono text-slate-600 bg-white/90 border border-slate-200 px-4 py-2 rounded-2xl shadow-sm backdrop-blur-md pointer-events-none font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <span>Interactive 3D Vector Core</span>
        </span>
        <span className="text-slate-900 font-bold">Drag to Orbit 360°</span>
      </div>
    </div>
  );
}
