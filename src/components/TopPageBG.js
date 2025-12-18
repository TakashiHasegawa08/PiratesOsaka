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

    const dpr = Math.min(2, window.devicePixelRatio || 1);
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
          });
        }
      }

      circlesRef.current = circles;
    };

    resize();
    init();

    let lastY = window.scrollY || 0;
    let scrollBoost = 0;

    const draw = (ms) => {
      const t = ms * 0.001;
      const { width, height } = canvas.getBoundingClientRect();

      const sy = window.scrollY || 0;
      const dScroll = sy - lastY;
      lastY = sy;

      scrollBoost += Math.min(34, Math.abs(dScroll));
      scrollBoost *= 0.9;
      const boost = Math.min(22, scrollBoost);

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
        const boostK = c.isBig ? 0.05 : c.isSmall ? 0.22 : 0.14;
        const wob = c.baseWobble + boost * boostK;

        const spd = c.isBig ? 0.55 : c.isSmall ? 1.15 : 0.85;

        const driftX = c.vx + Math.cos(t * 0.85 * spd + c.phase) * 0.11 * wob;
        const driftY = c.vy + Math.sin(t * 0.78 * spd + c.phase) * 0.11 * wob;

        const amp = c.isBig ? 14 : c.isSmall ? 34 : 24;

        c.x = c.baseX + driftX * amp;
        c.y = c.baseY + driftY * amp;

        const pad = c.r + 42;
        if (c.baseX < -pad) c.baseX = width + pad;
        if (c.baseX > width + pad) c.baseX = -pad;
        if (c.baseY < -pad) c.baseY = height + pad;
        if (c.baseY > height + pad) c.baseY = -pad;

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(110, 116, 128, ${c.a})`;
        ctx.lineWidth = c.lw;
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return (
    <div className="TopPageBG header-fadein js-header-fadein">
      <canvas ref={canvasRef} className="TopPageBG__canvas" />
    </div>
  );
}
