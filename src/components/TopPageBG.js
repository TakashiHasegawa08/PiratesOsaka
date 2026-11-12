import React, { useEffect, useRef } from "react";

// =====================================================================
// TopPageBG — ロゴの幾何から作ったソリッドな背景モチーフ
//   画面をグリッドに区切り、ロゴと同じ比率（外径98:内径50）の
//   円弧バンド・半円・バー・四分円がランダムなマスに
//   「ガイド線 → 塗りが伸びる → しばらく留まる → 抜ける」を繰り返す。
// =====================================================================

const BASE = "#F4EFE7"; // 薄いベージュ
const INK = "35,24,21";
const PINK = "232,82,152";
const FILL_A = 0.22; // 塗りの濃さ（ラッパーの opacity .4 と掛け合わさる）
const PINK_A = 0.3;
const GUIDE_A = 0.28; // 図形ごとのガイド線
const GRID_A = 0.07; // 全体のグリッド線
const RATIO = 50.5491231 / 98.1467678; // ロゴの内径 / 外径
const BAR = 47.5976446 / 98.1467678; // ロゴの縦棒の太さ / 外径
const TYPES = ["arc", "arc", "arc", "half", "half", "bar", "quarter", "dot"];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const eio = (x) => {
  x = clamp01(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export default function TopPageBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, cell = 120, cols = 0, rows = 0, maxGlyphs = 9;
    let ox = 0, oy = 0; // グリッドを画面中央に揃えるオフセット
    let glyphs = [];
    let used = new Set();
    let raf = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const isSp = W <= 768;
      const dpr = Math.min(isSp ? 1.5 : 2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.round(Math.max(84, Math.min(168, W / 8)));
      cols = Math.floor(W / cell);
      rows = Math.floor(H / cell);
      ox = (W - cols * cell) / 2;
      oy = (H - rows * cell) / 2;
      maxGlyphs = isSp ? 5 : 9;
    };

    const free = (g) => g.cells.forEach((k) => used.delete(k));

    const spawn = (now, warm) => {
      for (let tryN = 0; tryN < 24; tryN++) {
        const span = Math.random() < 0.3 && cols > 3 && rows > 3 ? 2 : 1;
        const c = Math.floor(rand(0, cols - span + 1));
        const r = Math.floor(rand(0, rows - span + 1));
        const cells = [];
        for (let i = 0; i < span; i++)
          for (let j = 0; j < span; j++) cells.push(`${c + i},${r + j}`);
        if (cells.some((k) => used.has(k))) continue;
        cells.forEach((k) => used.add(k));
        const tin = rand(1.1, 1.7), hold = rand(3.5, 7.5), tout = rand(0.9, 1.3);
        const type = pick(TYPES);
        glyphs.push({
          type, cells, c, r, span,
          rot: Math.floor(rand(0, 4)) * (Math.PI / 2),
          pink: type === "dot" ? Math.random() < 0.6 : Math.random() < 0.12,
          tin, hold, tout,
          // warm: 最初から図形が並んだ状態で始める
          start: warm ? now - rand(tin, tin + hold * 0.8) : now + rand(0, 1.2),
        });
        return;
      }
    };

    const fillColor = (g, a = 1) =>
      g.pink ? `rgba(${PINK},${PINK_A * a})` : `rgba(${INK},${FILL_A * a})`;

    // 円弧バンド：中心 (cx,cy)、外径 R、内径 r、角度 a0→a1
    const band = (cx, cy, R, r, a0, a1) => {
      if (a1 - a0 <= 0.0001) return;
      ctx.beginPath();
      ctx.arc(cx, cy, R, a0, a1);
      if (r > 0) ctx.arc(cx, cy, r, a1, a0, true);
      else ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();
    };

    const drawGlyph = (g, now) => {
      const lt = now - g.start;
      if (lt < 0) return true;
      const total = g.tin + g.hold + g.tout;
      if (lt > total) return false;
      const pIn = eio(lt / g.tin);
      const pOut = eio((lt - g.tin - g.hold) / g.tout);
      const pGuide = eio(lt / (g.tin * 0.7)) * (1 - eio((lt - g.tin) / 0.8));
      const s = g.span * cell;
      const x0 = ox + g.c * cell, y0 = oy + g.r * cell;

      ctx.save();
      ctx.translate(x0 + s / 2, y0 + s / 2);
      ctx.rotate(g.rot);
      const h = s / 2;
      ctx.fillStyle = fillColor(g);
      ctx.strokeStyle = `rgba(${INK},${GUIDE_A * pGuide})`;
      ctx.lineWidth = 1;

      if (g.type === "arc" || g.type === "quarter") {
        // 四分円バンド（左下を中心に、上→右へ伸びる）
        const cx = -h, cy = h, R = s, r = g.type === "arc" ? s * RATIO : 0;
        const a0 = -Math.PI / 2, sweep = Math.PI / 2;
        if (pGuide > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, R, a0, a0 + sweep * eio(lt / (g.tin * 0.7)));
          ctx.stroke();
        }
        band(cx, cy, R, r, a0 + sweep * pOut, a0 + sweep * pIn);
        if (pIn > 0 && pIn < 1) dotAt(cx + Math.cos(a0 + sweep * pIn) * (R + r) / 2, cy + Math.sin(a0 + sweep * pIn) * (R + r) / 2);
      } else if (g.type === "half") {
        // 半円バンド（下辺中央を中心に、左→右へ）
        const cx = 0, cy = h, R = h, r = h * RATIO;
        if (pGuide > 0) {
          ctx.beginPath();
          ctx.moveTo(-h - 12, cy);
          ctx.lineTo(-h - 12 + (s + 24) * eio(lt / (g.tin * 0.7)), cy);
          ctx.stroke();
        }
        band(cx, cy, R, r, Math.PI + Math.PI * pOut, Math.PI + Math.PI * pIn);
      } else if (g.type === "bar") {
        // バー（ロゴの縦棒の比率）
        const th = h * BAR;
        if (pGuide > 0) {
          ctx.beginPath();
          ctx.moveTo(-h, -th / 2);
          ctx.lineTo(-h + s * eio(lt / (g.tin * 0.7)), -th / 2);
          ctx.stroke();
        }
        const xa = -h + s * pOut, xb = -h + s * pIn;
        if (xb > xa) ctx.fillRect(xa, -th / 2, xb - xa, th);
      } else if (g.type === "dot") {
        // 十字のガイド＋小さな点（ペン先）
        const L = h * 0.9 * eio(lt / (g.tin * 0.7));
        if (pGuide > 0) {
          ctx.beginPath();
          ctx.moveTo(-L, 0); ctx.lineTo(L, 0);
          ctx.moveTo(0, -L); ctx.lineTo(0, L);
          ctx.stroke();
        }
        const rr = Math.max(3, s * 0.06) * pIn * (1 - pOut);
        if (rr > 0) {
          ctx.beginPath();
          ctx.arc(0, 0, rr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      return true;
    };

    function dotAt(x, y) {
      ctx.save();
      ctx.fillStyle = `rgba(${PINK},0.55)`;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const drawGrid = () => {
      ctx.strokeStyle = `rgba(${INK},${GRID_A})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= cols; i += 2) {
        const x = Math.round(ox + i * cell) + 0.5;
        ctx.moveTo(x, 0); ctx.lineTo(x, H);
      }
      for (let j = 0; j <= rows; j += 2) {
        const y = Math.round(oy + j * cell) + 0.5;
        ctx.moveTo(0, y); ctx.lineTo(W, y);
      }
      ctx.stroke();
    };

    const render = (ms) => {
      const now = ms / 1000;
      ctx.fillStyle = BASE;
      ctx.fillRect(0, 0, W, H);
      drawGrid();
      glyphs = glyphs.filter((g) => {
        const alive = drawGlyph(g, now);
        if (!alive) free(g);
        return alive;
      });
      for (let k = 0; glyphs.length < maxGlyphs && k < maxGlyphs; k++)
        spawn(now, false);
    };

    const init = () => {
      glyphs = [];
      used = new Set();
      const now = performance.now() / 1000;
      for (let i = 0; i < maxGlyphs; i++) spawn(now, true);
    };

    const loop = (ms) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      render(ms);
    };

    resize();
    init();
    if (reduce) {
      // 動きを減らす設定：図形が並んだ状態で止める
      glyphs.forEach((g) => (g.start = performance.now() / 1000 - g.tin - 0.1));
      render(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
    }

    let lastW = W;
    const onResize = () => {
      resize();
      if (Math.abs(W - lastW) > 1) {
        lastW = W;
        init();
      }
      if (reduce) render(performance.now());
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="TopPageBG header-fadein js-header-fadein">
      <canvas ref={canvasRef} className="TopPageBG__canvas" />
    </div>
  );
}
