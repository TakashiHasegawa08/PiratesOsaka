import React, { useEffect, useRef, useState } from "react";

export default function TopPageBG() {
  const canvasRef = useRef(null);
  const circlesRef = useRef([]);
  const rafRef = useRef(null);

  const [count, setCount] = useState(45);

  useEffect(() => {
    const update = () => {
      setCount(window.innerWidth <= 768 ? 20 : 45);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(isMobile ? 1.5 : 2, window.devicePixelRatio || 1);
    const rand = (min, max) => min + Math.random() * (max - min);

    const biasedY = (height, bias = 0.72) => {
      const u = Math.random();
      const k = 2.2;
      const t = Math.pow(u, k);
      const down = (1 - t) * height;

      const mix = 0.18;
      const normal = u * height;

      return down * (1 - mix) + normal * mix + height * (bias - 0.5) * 0.15;
    };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pickRadius = (minR, maxR) => {
      const u = Math.random();
      if (u < 0.62) return rand(minR, minR + (maxR - minR) * 0.22); // small
      if (u < 0.84)
        return rand(minR + (maxR - minR) * 0.18, minR + (maxR - minR) * 0.58); // medium
      return rand(minR + (maxR - minR) * 0.55, maxR); // large
    };

    const init = () => {
      const { width, height } = canvas.getBoundingClientRect();

      const MIN_R = 3;
      const MAX_R = Math.min(width, height) * 0.2;

      const TRY = 26;
      const OVERLAP = 0.22;

      const circles = [];

      for (let i = 0; i < count; i++) {
        let placed = false;

        for (let t = 0; t < TRY; t++) {
          const r = pickRadius(MIN_R, MAX_R);

          const isBig = r > MAX_R * 0.68;
          const isSmall = r < MAX_R * 0.22;

          const x = rand(0, width);
          const y = biasedY(height, 0.72);

          let ok = true;
          for (const p of circles) {
            const dx = x - p.x;
            const dy = y - p.y;
            const dist = Math.hypot(dx, dy);
            const minDist = (r + p.r) * (1 - OVERLAP);
            if (dist < minDist) {
              ok = false;
              break;
            }
          }

          if (ok) {
            const baseWobble = isBig
              ? rand(0.35, 0.75)
              : isSmall
              ? rand(1.4, 2.8)
              : rand(0.8, 1.8);

            const vRange = isBig ? 0.045 : isSmall ? 0.16 : 0.11;

            circles.push({
              x,
              y,
              baseX: x,
              baseY: y,
              r,
              lw: isBig ? rand(0.9, 1.6) : rand(0.6, 1.2),
              a: isBig ? rand(0.16, 0.32) : rand(0.26, 0.56),
              vx: rand(-vRange, vRange),
              vy: rand(-vRange, vRange),
              phase: rand(0, Math.PI * 2),
              baseWobble,
              isBig,
              isSmall,
              motionX: 0,
              motionY: 0,
              velocityX: 0,
              velocityY: 0,
              kick: 0,
              burstAngle: rand(0, Math.PI * 2),
              burstStrength: rand(0.72, 1.2),
            });

            placed = true;
            break;
          }
        }

        if (!placed) {
          const r = pickRadius(MIN_R, MAX_R);
          const isBig = r > MAX_R * 0.68;
          const isSmall = r < MAX_R * 0.22;

          const x = rand(0, width);
          const y = biasedY(height, 0.72);

          const baseWobble = isBig
            ? rand(0.35, 0.75)
            : isSmall
            ? rand(1.4, 2.8)
            : rand(0.8, 1.8);

          const vRange = isBig ? 0.045 : isSmall ? 0.16 : 0.11;

          circles.push({
            x,
            y,
            baseX: x,
            baseY: y,
            r,
            lw: isBig ? rand(1.2, 2.3) : rand(0.9, 1.8),
            a: isBig ? rand(0.16, 0.32) : rand(0.26, 0.56),
            vx: rand(-vRange, vRange),
            vy: rand(-vRange, vRange),
            phase: rand(0, Math.PI * 2),
            baseWobble,
            isBig,
            isSmall,
            motionX: 0,
            motionY: 0,
            velocityX: 0,
            velocityY: 0,
            kick: 0,
            burstAngle: rand(0, Math.PI * 2),
            burstStrength: rand(0.72, 1.2),
          });
        }
      }

      circlesRef.current = circles;
    };

    resize();
    init();

    let canvasWidth = canvas.getBoundingClientRect().width;
    const scrollState = {
      lastY: window.scrollY || document.documentElement.scrollTop || 0,
      pending: 0,
    };
    let lastTime = 0;

    const onScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop || 0;
      const delta = currentY - scrollState.lastY;

      scrollState.lastY = currentY;
      scrollState.pending = Math.max(
        isMobile ? -24 : -90,
        Math.min(isMobile ? 24 : 90, scrollState.pending + delta),
      );
    };

    const draw = (ms) => {
      const t = ms * 0.001;
      const deltaTime = Math.min(
        0.05,
        lastTime ? (ms - lastTime) * 0.001 : 1 / 60,
      );
      lastTime = ms;
      const { width, height } = canvas.getBoundingClientRect();
      const scrollImpulse = scrollState.pending;
      scrollState.pending *= 0.45;

      if (Math.abs(scrollState.pending) < 0.1) {
        scrollState.pending = 0;
      }

      // ✅ 背景：上をさらに明るく
      ctx.clearRect(0, 0, width, height);

      // 1) ベース（ちょい明るめに）
      ctx.fillStyle = "#f4f6fb";
      ctx.fillRect(0, 0, width, height);

      // 2) 上からのライト（強め・広め）
      const topLight = ctx.createRadialGradient(
        width * 0.5,
        height * -0.35, // ← 光源をさらに上へ（上が白くなる）
        0,
        width * 0.5,
        height * -0.35,
        Math.max(width, height) * 1.35 // ← 広がりもUP
      );
      topLight.addColorStop(0, "rgba(255,255,255,1.0)");
      topLight.addColorStop(0.22, "rgba(255,255,255,0.85)");
      topLight.addColorStop(0.48, "rgba(255,255,255,0.45)");
      topLight.addColorStop(1, "rgba(255,255,255,0.0)");
      ctx.fillStyle = topLight;
      ctx.fillRect(0, 0, width, height);

      // 2.5) 上部だけ さらに薄く白を足す（“照明感”の最後のひと押し）
      const topWash = ctx.createLinearGradient(0, 0, 0, height * 0.55);
      topWash.addColorStop(0, "rgba(255,255,255,0.22)");
      topWash.addColorStop(1, "rgba(255,255,255,0.0)");
      ctx.fillStyle = topWash;
      ctx.fillRect(0, 0, width, height);

      // 3) 下側のほんのり影（締め）
      const bottomShade = ctx.createLinearGradient(0, height * 0.35, 0, height);
      bottomShade.addColorStop(0, "rgba(0,0,0,0.0)");
      bottomShade.addColorStop(1, "rgba(0,0,0,0.06)");
      ctx.fillStyle = bottomShade;
      ctx.fillRect(0, 0, width, height);

      circlesRef.current.forEach((c) => {
        const spd = c.isBig ? 0.55 : c.isSmall ? 1.15 : 0.85;
        const floatAmplitude = c.isBig ? 26 : c.isSmall ? 48 : 36;
        const floatX = Math.cos(t * 0.48 * spd + c.phase) * floatAmplitude;
        const floatY = Math.sin(t * 0.42 * spd + c.phase) * floatAmplitude;

        if (!prefersReducedMotion) {
          const response =
            (c.isBig ? 6.2 : c.isSmall ? 10.5 : 8.4) *
            (isMobile ? 0.48 : 1);
          const burst = Math.abs(scrollImpulse) * response * c.burstStrength;
          const burstDirection = c.burstAngle + Math.sin(t * 0.7 + c.phase) * 0.35;

          c.velocityX += Math.cos(burstDirection) * burst;
          c.velocityY += Math.sin(burstDirection) * burst;
          c.velocityX *= Math.exp(-3.2 * deltaTime);
          c.velocityY *= Math.exp(-3.2 * deltaTime);
          c.motionX += c.velocityX * deltaTime;
          c.motionY += c.velocityY * deltaTime;
          c.kick = Math.min(0.14, c.kick + Math.abs(scrollImpulse) * 0.0014);
          c.kick *= Math.exp(-7 * deltaTime);

          const movementLimit =
            (c.isBig ? 160 : c.isSmall ? 240 : 200) *
            (isMobile ? 0.65 : 1);
          if (Math.abs(c.motionX) > movementLimit) {
            c.motionX = Math.sign(c.motionX) * movementLimit;
            c.velocityX *= -0.35;
          }
          if (Math.abs(c.motionY) > movementLimit) {
            c.motionY = Math.sign(c.motionY) * movementLimit;
            c.velocityY *= -0.35;
          }
        }

        c.x = c.baseX + floatX + c.motionX;
        c.y = c.baseY + floatY + c.motionY;
        const sphereRadius = c.r * (1 + c.kick);
        const hue = 205 + Math.sin(c.phase) * 18;
        const sphereGradient = ctx.createRadialGradient(
          c.x - sphereRadius * 0.32,
          c.y - sphereRadius * 0.38,
          sphereRadius * 0.06,
          c.x,
          c.y,
          sphereRadius,
        );

        sphereGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
        sphereGradient.addColorStop(0.2, `hsla(${hue}, 62%, 90%, 0.3)`);
        sphereGradient.addColorStop(0.58, `hsla(${hue}, 56%, 74%, 0.22)`);
        sphereGradient.addColorStop(1, `hsla(${hue}, 48%, 62%, 0.075)`);

        ctx.beginPath();
        ctx.arc(c.x, c.y, sphereRadius, 0, Math.PI * 2);
        ctx.fillStyle = sphereGradient;
        ctx.fill();
        ctx.strokeStyle = `hsla(${hue}, 40%, 60%, ${c.a * 0.72})`;
        ctx.lineWidth = c.lw * 0.8;
        ctx.stroke();
      });

      if (!prefersReducedMotion) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      const nextWidth = canvas.getBoundingClientRect().width;
      const widthChanged = Math.abs(nextWidth - canvasWidth) > 1;

      resize();
      if (widthChanged) {
        canvasWidth = nextWidth;
        init();
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [count]);

  return (
    <div className="TopPageBG header-fadein js-header-fadein">
      <canvas ref={canvasRef} className="TopPageBG__canvas" />
    </div>
  );
}
