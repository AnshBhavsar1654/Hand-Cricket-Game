"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "#6366f1", // indigo (player)
  "#f43f5e", // rose (cpu)
  "#fbbf24", // amber
  "#34d399", // emerald
  "#60a5fa", // sky
  "#f472b6", // pink
  "#a78bfa", // violet
];

const PARTICLE_COUNT = 80;
const GRAVITY = 0.12;
const FADE_RATE = 0.012;
const DURATION = 1800;

function createParticle(cx, cy) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 4 + Math.random() * 8;
  return {
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed * (0.5 + Math.random()),
    vy: Math.sin(angle) * speed * (0.5 + Math.random()) - 4,
    w: 4 + Math.random() * 6,
    h: 3 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 12,
    opacity: 1,
  };
}

export default function Confetti({ trigger }) {
  const canvasRef = useRef(null);
  const prevTrigger = useRef(trigger);
  const rafRef = useRef(null);

  useEffect(() => {
    if (trigger === prevTrigger.current || trigger === 0) return;
    prevTrigger.current = trigger;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.35;

    const particles = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(cx, cy)
    );

    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed > DURATION) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.vy += GRAVITY;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.opacity = Math.max(0, 1 - elapsed / DURATION);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}
