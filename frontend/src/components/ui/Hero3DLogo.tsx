"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, ShieldCheck, Cpu, RefreshCw, Layers } from "lucide-react";

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

    // 3D Geometry: Concentric Layered Octahedral Diamonds (Araxyss 3D Brand Emblem)
    // Layer 1: Outer Faceted Diamond
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
      { indices: [0, 1, 2], color: "rgba(56, 43, 34, 0.88)", borderColor: "#b18597" },
      { indices: [0, 2, 3], color: "rgba(43, 32, 26, 0.92)", borderColor: "#b18597" },
      { indices: [0, 3, 4], color: "rgba(65, 50, 40, 0.85)", borderColor: "#b18597" },
      { indices: [0, 4, 1], color: "rgba(75, 58, 48, 0.80)", borderColor: "#b18597" },
      { indices: [5, 2, 1], color: "rgba(43, 32, 26, 0.90)", borderColor: "#b18597" },
      { indices: [5, 3, 2], color: "rgba(56, 43, 34, 0.85)", borderColor: "#b18597" },
      { indices: [5, 4, 3], color: "rgba(65, 50, 40, 0.92)", borderColor: "#b18597" },
      { indices: [5, 1, 4], color: "rgba(50, 38, 30, 0.88)", borderColor: "#b18597" },
    ];

    // Layer 2: Middle Rose Core Diamond
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
      { indices: [0, 1, 2], color: "rgba(177, 133, 151, 0.85)", borderColor: "#fff0f0" },
      { indices: [0, 2, 3], color: "rgba(195, 150, 168, 0.90)", borderColor: "#fff0f0" },
      { indices: [0, 3, 4], color: "rgba(160, 118, 135, 0.80)", borderColor: "#fff0f0" },
      { indices: [0, 4, 1], color: "rgba(180, 135, 153, 0.85)", borderColor: "#fff0f0" },
      { indices: [5, 2, 1], color: "rgba(160, 118, 135, 0.88)", borderColor: "#fff0f0" },
      { indices: [5, 3, 2], color: "rgba(177, 133, 151, 0.92)", borderColor: "#fff0f0" },
      { indices: [5, 4, 3], color: "rgba(195, 150, 168, 0.85)", borderColor: "#fff0f0" },
      { indices: [5, 1, 4], color: "rgba(170, 126, 144, 0.88)", borderColor: "#fff0f0" },
    ];

    // Layer 3: Inner Luminous Core
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
      { indices: [0, 1, 2], color: "rgba(255, 240, 240, 0.95)", borderColor: "#382b22" },
      { indices: [0, 2, 3], color: "rgba(249, 196, 210, 0.95)", borderColor: "#382b22" },
      { indices: [0, 3, 4], color: "rgba(255, 240, 240, 0.95)", borderColor: "#382b22" },
      { indices: [0, 4, 1], color: "rgba(249, 196, 210, 0.95)", borderColor: "#382b22" },
      { indices: [5, 2, 1], color: "rgba(249, 196, 210, 0.95)", borderColor: "#382b22" },
      { indices: [5, 3, 2], color: "rgba(255, 240, 240, 0.95)", borderColor: "#382b22" },
      { indices: [5, 4, 3], color: "rgba(249, 196, 210, 0.95)", borderColor: "#382b22" },
      { indices: [5, 1, 4], color: "rgba(255, 240, 240, 0.95)", borderColor: "#382b22" },
    ];

    // Orbiting Sparkles
    const sparkleCount = 28;
    const sparkles: { angle: number; speed: number; distance: number; yOffset: number; size: number; color: string }[] = [];
    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        angle: (i / sparkleCount) * Math.PI * 2,
        speed: 0.008 + (i % 3) * 0.004,
        distance: 120 + (i % 5) * 12,
        yOffset: (Math.sin(i * 1.5) * 35),
        size: 1.5 + (i % 3) * 1.2,
        color: i % 2 === 0 ? "#b18597" : i % 3 === 0 ? "#10b981" : "#382b22",
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
      // Y rotation
      let x1 = p.x * Math.cos(rY) + p.z * Math.sin(rY);
      let y1 = p.y;
      let z1 = -p.x * Math.sin(rY) + p.z * Math.cos(rY);

      // X rotation
      let x2 = x1;
      let y2 = y1 * Math.cos(rX) - z1 * Math.sin(rX);
      let z2 = y1 * Math.sin(rX) + z1 * Math.cos(rX);

      // Z rotation
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

      // Ambient floating wave
      const floatY = Math.sin(time * 2) * 8 * dpr;

      // Outer Holographic Gyroscope Orbit Rings
      ctx.save();
      const ringRadius = 145 * dpr;
      
      // Ring 1 (Equatorial Gyro)
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + floatY, ringRadius, ringRadius * 0.35, rotX + 0.1, 0, Math.PI * 2);
      ctx.strokeStyle = shockwave > 0 ? "rgba(177, 133, 151, 0.9)" : "rgba(177, 133, 151, 0.4)";
      ctx.lineWidth = (shockwave > 0 ? 2.5 : 1.4) * dpr;
      ctx.stroke();

      // Ring 2 (Polar Gyro)
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + floatY, ringRadius * 0.38, ringRadius, rotY * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(177, 133, 151, 0.25)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.stroke();

      // Shockwave ring
      if (shockwave > 0) {
        const shockRadius = (1 - shockwave) * 180 * dpr + 40 * dpr;
        ctx.beginPath();
        ctx.arc(centerX, centerY + floatY, shockRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(177, 133, 151, ${shockwave * 0.7})`;
        ctx.lineWidth = 2 * dpr;
        ctx.stroke();
      }
      ctx.restore();

      // Orbiting Sparkles
      sparkles.forEach((s) => {
        s.angle += s.speed;
        const sx = Math.cos(s.angle) * s.distance;
        const sz = Math.sin(s.angle) * s.distance;
        const sy = s.yOffset + Math.sin(time * 3 + s.angle) * 10;

        const proj = project({ x: sx, y: sy, z: sz }, rotX, rotY, 0, fov, centerX, centerY + floatY, dpr);

        ctx.save();
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, s.size * proj.scale * dpr, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6 * proj.scale;
        ctx.fill();
        ctx.restore();
      });

      // Render 3D Octahedron Layer function
      const renderLayer = (verts: Point3D[], faces: Face3D[], rotOffset: number, lineWidth: number) => {
        const projectedVerts = verts.map((v) => project(v, rotX, rotY + rotOffset, 0, fov, centerX, centerY + floatY, dpr));

        // Compute face depths for painter's algorithm
        const sortedFaces = faces.map((face) => {
          const p0 = projectedVerts[face.indices[0]];
          const p1 = projectedVerts[face.indices[1]];
          const p2 = projectedVerts[face.indices[2]];
          const avgZ = (p0.z + p1.z + p2.z) / 3;

          // Normal vector for backface culling
          const ax = p1.x - p0.x;
          const ay = p1.y - p0.y;
          const bx = p2.x - p0.x;
          const by = p2.y - p0.y;
          const normalZ = ax * by - ay * bx;

          return {
            face,
            avgZ,
            normalZ,
            p0,
            p1,
            p2,
          };
        });

        sortedFaces.sort((a, b) => b.avgZ - a.avgZ);

        sortedFaces.forEach((f) => {
          if (f.normalZ > -0.01) { // Visible face
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

      // Render concentric diamond layers
      renderLayer(vertices1, faces1, 0, 1.8);
      renderLayer(vertices2, faces2, time * 0.4, 1.4);
      renderLayer(vertices3, faces3, -time * 0.6, 1.2);

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
      className="relative w-full h-[360px] sm:h-[420px] rounded-3xl border-2 border-[#b18597] bg-[#ffffff] p-6 shadow-[0_16px_48px_rgba(177,133,151,0.18)] flex items-center justify-center select-none overflow-hidden group"
    >
      {/* Subtle radial blush backdrop */}
      <div className="absolute inset-0 bg-radial from-[#fff0f0] via-transparent to-transparent opacity-80 pointer-events-none" />

      {/* 3D Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff]/90 border-2 border-[#b18597] shadow-sm text-[10px] font-mono font-bold text-[#382b22] backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>ARAXYSS 3D EMBLEM</span>
      </div>

      {/* Top Right Specs Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff0f0] border border-[#b18597] text-[10px] font-mono font-bold text-[#703d52] shadow-sm">
        <Sparkles className="w-3 h-3 text-[#b18597]" />
        <span>CONCENTRIC CORE</span>
      </div>

      {/* Bottom Hint Floating HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[10px] font-mono text-[#5e4d46] bg-[#faf6f6]/90 border border-[#e8dede] px-4 py-2 rounded-2xl shadow-sm backdrop-blur-md pointer-events-none font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#b18597]" />
          <span>Interactive 3D Vector Core</span>
        </span>
        <span className="text-[#2b201a] font-bold">Drag to Orbit 360°</span>
      </div>
    </div>
  );
}
