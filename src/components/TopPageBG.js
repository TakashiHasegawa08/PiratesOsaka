import React, { useEffect, useRef } from "react";

// =====================================================================
// TopPageBG — 線で描く背景モチーフ（シンプル版）
//   ペンが画面の外から直線で入ってきて、45°カーブしたあと、
//   斜めの直線で画面の外までまっすぐ進む。線は後ろから消えていく。
//   常に LINES 本のペンが描いている状態を保ち、1本が画面の外へ抜けると次が別の場所から現れる。
//   カーブの大きさは毎回ランダム、速さは一定。
//   ペン先はピンクの点。
// =====================================================================

const BASE = "#F4EFE7"; // 薄いベージュ
const INK = "35,24,21";
const PINK = "232,82,152";
const LINE_A = 0.5; // 線の濃さ（ラッパーの opacity .4 と掛け合わさる）
const LINE_W = 1.2; // 線の太さ(px)
const SPEED = 110; // ペンの速さ(px/秒)・全ペン共通
const R_MIN = 0.6; // カーブ半径の最小（単位）
const R_MAX = 3.2; // カーブ半径の最大（単位）
// 同時に描いているペンの本数（画面の外へ抜けたら次が出る。消えかけの線はこれとは別に残る）
const LINES = 2;

const rand = (a, b) => a + Math.random() * (b - a);
const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // 右・下・左・上（画面座標）

const pointAt = (s, d) => {
  if (s.kind === "line") {
    const t = d / s.len;
    return [s.x0 + (s.x1 - s.x0) * t, s.y0 + (s.y1 - s.y0) * t];
  }
  const a = s.a0 + s.da * (d / s.len);
  return [s.cx + Math.cos(a) * s.r, s.cy + Math.sin(a) * s.r];
};

export default function TopPageBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, unit = 100;
    let pens = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const isSp = W <= 768;
      const dpr = Math.min(isSp ? 1.5 : 2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      unit = Math.round(Math.max(64, Math.min(120, W / 12)));
    };

    // ひとつの軌跡：短い助走 → 円弧1〜2回 → 画面外までの直線
    const makePath = () => {
      const m = unit * 0.5;
      for (let attempt = 0; attempt < 30; attempt++) {
        // カーブに入る位置と、そこへ向かう向き（上下左右のどれか）
        const tx = rand(W * 0.12, W * 0.88), ty = rand(H * 0.12, H * 0.88);
        const [hx, hy] = DIRS[Math.floor(rand(0, 4))];
        let th = Math.atan2(hy, hx); // 進行方向（角度）
        // 画面の外（進行方向の反対側）からまっすぐ入ってくる
        const back = (hx > 0 ? tx : hx < 0 ? W - tx : hy > 0 ? ty : H - ty) + 20;
        let x = tx - hx * back, y = ty - hy * back;
        const segs = [];
        let total = 0;
        const push = (sg) => { sg.start = total; total += sg.len; segs.push(sg); [x, y] = pointAt(sg, sg.len); };
        const line = (len) =>
          push({ kind: "line", x0: x, y0: y, x1: x + Math.cos(th) * len, y1: y + Math.sin(th) * len, len });

        // 直線で入ってくる → 45°カーブ → 直線で抜けていく
        line(back);
        const r = unit * rand(R_MIN, Math.min(R_MAX, (Math.min(W, H) * 0.42) / unit));
        const side = Math.random() < 0.5 ? 1 : -1;
        const turn = (Math.PI / 4) * side;
        const cx = x + Math.cos(th + (side * Math.PI) / 2) * r;
        const cy = y + Math.sin(th + (side * Math.PI) / 2) * r;
        push({ kind: "arc", cx, cy, r, a0: Math.atan2(y - cy, x - cx), da: turn, len: r * Math.abs(turn) });
        th += turn;
        if (x < m || x > W - m || y < m || y > H - m) continue; // カーブの終点が画面内のものだけ使う

        // 斜めの直線で画面の外まで
        const dx = Math.cos(th), dy = Math.sin(th);
        const tX = dx > 1e-6 ? (W - x) / dx : dx < -1e-6 ? -x / dx : Infinity;
        const tY = dy > 1e-6 ? (H - y) / dy : dy < -1e-6 ? -y / dy : Infinity;
        const toEdge = Math.min(tX, tY);
        line(W + H);
        return { segs, total, exitAt: segs[segs.length - 1].start + toEdge };
      }
      return null;
    };

    const makePen = (delay) => {
      const path = makePath();
      if (!path) return null;
      return {
        ...path,
        head: -SPEED * delay, // delay 秒後に描き始める
        tail: (W <= 768 ? rand(5, 7) : rand(7, 11)) * unit, // 残す線の長さ
        speed: SPEED,
        spawned: false,
      };
    };

    const init = () => {
      pens = [];
      // 最初から線が見えている状態にする（進み具合をずらして並べる）
      for (let k = 0; k < LINES; k++) {
        const p = makePen(0);
        if (!p) continue;
        p.head = ((k + 0.3 + rand(0, 0.3)) / LINES) * p.exitAt;
        pens.push(p);
      }
    };

    const step = (dt) => {
      pens.forEach((p) => (p.head += p.speed * dt));
      // 線が全部画面から消えたペンは片付ける
      pens = pens.filter((p) => p.head - p.tail < p.exitAt + 20);
      // 画面内で描いている（まだ外へ抜けていない）ペンが LINES 本になるよう補充
      const drawing = pens.filter((p) => p.head < p.exitAt).length;
      for (let k = drawing; k < LINES; k++) {
        const next = makePen(rand(0.2, 1.2));
        if (next) pens.push(next);
      }
    };

    const trace = (segs, from, to) => {
      ctx.beginPath();
      let moved = false;
      segs.forEach((s) => {
        const a = Math.max(from, s.start), b = Math.min(to, s.start + s.len);
        if (b <= a) return;
        const [x, y] = pointAt(s, a - s.start);
        if (!moved) { ctx.moveTo(x, y); moved = true; } else ctx.lineTo(x, y);
        if (s.kind === "line") {
          ctx.lineTo(...pointAt(s, b - s.start));
        } else {
          const aa = s.a0 + s.da * ((a - s.start) / s.len);
          const bb = s.a0 + s.da * ((b - s.start) / s.len);
          ctx.arc(s.cx, s.cy, s.r, aa, bb, s.da < 0);
        }
      });
      ctx.stroke();
    };

    const headDot = (p) => {
      if (p.head <= 0) return;
      const s = p.segs.find((sg) => p.head >= sg.start && p.head <= sg.start + sg.len);
      if (!s) return;
      const [x, y] = pointAt(s, p.head - s.start);
      if (x < -10 || y < -10 || x > W + 10 || y > H + 10) return;
      ctx.fillStyle = `rgba(${PINK},0.9)`;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      ctx.fillStyle = BASE;
      ctx.fillRect(0, 0, W, H);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = LINE_W;
      pens.forEach((p) => {
        const t0 = p.head - p.tail;
        for (let k = 0; k < 4; k++) {
          // 後ろほど薄く（4段階）
          ctx.strokeStyle = `rgba(${INK},${LINE_A * ((k + 1) / 4)})`;
          trace(p.segs, Math.max(0, t0 + (p.tail * k) / 4), Math.max(0, t0 + (p.tail * (k + 1)) / 4));
        }
        headDot(p);
      });
    };

    const loop = (ms) => {
      raf = requestAnimationFrame(loop);
      const now = ms / 1000;
      const dt = Math.min(0.05, now - last);
      last = now;
      if (document.hidden) return;
      step(dt);
      render();
    };

    resize();
    init();
    last = performance.now() / 1000;
    if (reduce) {
      render(); // 動きを減らす設定：線が描かれた状態で止める
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
      if (reduce) render();
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
