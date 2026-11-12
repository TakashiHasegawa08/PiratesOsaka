import React, { useEffect, useRef } from "react";

// =====================================================================
// TopPageBG — 線で描く背景モチーフ
//   数本の「ペン」がグリッド上を、直線と円弧（90°ターン）をつなぎながら
//   描き進む。通った線は一定の長さで後ろから消えていくので、
//   直線と曲線が画面のあちこちで交錯し続ける。
//   円弧の半径はロゴと同じ比率（外径98:内径50 ≒ 2:1）。
// =====================================================================

const BASE = "#F4EFE7"; // 薄いベージュ
const INK = "35,24,21";
const PINK = "232,82,152";
const LINE_A = 0.55; // 線の濃さ（ラッパーの opacity .4 と掛け合わさる）
const LINE_W = 1.2; // 線の太さ(px)
const GUIDE_A = 0.14; // カーブ時に一瞬見える円ガイド
const GRID_A = 0.05; // 全体のグリッド線
const SPEED = 110; // ペンの速さ(px/秒)

const rand = (a, b) => a + Math.random() * (b - a);
const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // 右・下・左・上（画面座標）

export default function TopPageBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, cell = 120, ox = 0, oy = 0, cols = 0, rows = 0;
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
      cell = Math.round(Math.max(64, Math.min(120, W / 12)));
      cols = Math.floor(W / cell);
      rows = Math.floor(H / cell);
      ox = (W - cols * cell) / 2;
      oy = (H - rows * cell) / 2;
    };

    const gx = (i) => ox + i * cell;
    const gy = (j) => oy + j * cell;
    const inside = (i, j) => i >= 0 && j >= 0 && i <= cols && j <= rows;

    // 次のセグメントを作る（グリッド座標 i,j と向き h を進める）
    const nextSegment = (pen, now) => {
      const options = [];
      const straight = () => {
        const n = 1 + Math.floor(rand(0, 3));
        const [dx, dy] = DIRS[pen.h];
        return { kind: "line", ni: pen.i + dx * n, nj: pen.j + dy * n, nh: pen.h, n };
      };
      const turn = (side, k) => {
        // side: +1 = 右回り, -1 = 左回り / k: 半径（セル数）
        const nh = (pen.h + side + 4) % 4;
        const [fx, fy] = DIRS[pen.h];
        const [sx, sy] = DIRS[nh];
        return { kind: "arc", ni: pen.i + (fx + sx) * k, nj: pen.j + (fy + sy) * k, nh, k, side };
      };
      const r1 = Math.random();
      if (r1 < 0.5) options.push(straight());
      options.push(turn(Math.random() < 0.5 ? 1 : -1, Math.random() < 0.5 ? 1 : 2));
      options.push(turn(1, 1), turn(-1, 1), straight(), turn(1, 2), turn(-1, 2));
      const o = options.find((op) => inside(op.ni, op.nj)) || turn(1, 1);

      const x0 = gx(pen.i), y0 = gy(pen.j);
      let seg;
      if (o.kind === "line") {
        const x1 = gx(o.ni), y1 = gy(o.nj);
        seg = { kind: "line", x0, y0, x1, y1, len: Math.hypot(x1 - x0, y1 - y0) };
      } else {
        const r = o.k * cell;
        const [sx, sy] = DIRS[o.nh];
        const cx = x0 + sx * r, cy = y0 + sy * r; // 円の中心はターン方向側
        const a0 = Math.atan2(y0 - cy, x0 - cx);
        const da = (Math.PI / 2) * o.side;
        seg = { kind: "arc", cx, cy, r, a0, da, len: r * Math.PI / 2, born: now };
      }
      seg.start = pen.total;
      pen.total += seg.len;
      pen.segs.push(seg);
      pen.i = o.ni;
      pen.j = o.nj;
      pen.h = o.nh;
    };

    const makePen = (now) => {
      const pen = {
        i: Math.floor(rand(1, cols)),
        j: Math.floor(rand(1, rows)),
        h: Math.floor(rand(0, 4)),
        segs: [],
        total: 0,
        head: 0,
        tail: rand(5, 9) * cell, // 残す線の長さ
        speed: SPEED * rand(0.75, 1.25),
        pink: false,
      };
      return pen;
    };

    const init = (now) => {
      const n = W <= 768 ? 3 : 5;
      pens = [];
      for (let k = 0; k < n; k++) {
        const p = makePen(now);
        p.pink = k === 0;
        pens.push(p);
      }
      // 最初から線がある状態で始める
      for (let t = 0; t < 8; t += 1 / 30) step(1 / 30, now - 8 + t);
    };

    const step = (dt, now) => {
      pens.forEach((p) => {
        p.head += p.speed * dt;
        while (p.total < p.head + cell * 3) nextSegment(p, now);
        // 末尾より後ろのセグメントを捨てる
        while (p.segs.length && p.segs[0].start + p.segs[0].len < p.head - p.tail) p.segs.shift();
      });
    };

    const pointAt = (s, d) => {
      if (s.kind === "line") {
        const t = d / s.len;
        return [s.x0 + (s.x1 - s.x0) * t, s.y0 + (s.y1 - s.y0) * t];
      }
      const a = s.a0 + s.da * (d / s.len);
      return [s.cx + Math.cos(a) * s.r, s.cy + Math.sin(a) * s.r];
    };

    // [from, to] の範囲（ペンの道のり上）を描く
    const tracePart = (p, from, to) => {
      ctx.beginPath();
      let moved = false;
      p.segs.forEach((s) => {
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

    const drawGrid = () => {
      ctx.strokeStyle = `rgba(${INK},${GRID_A})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= cols; i += 2) {
        const x = Math.round(gx(i)) + 0.5;
        ctx.moveTo(x, 0); ctx.lineTo(x, H);
      }
      for (let j = 0; j <= rows; j += 2) {
        const y = Math.round(gy(j)) + 0.5;
        ctx.moveTo(0, y); ctx.lineTo(W, y);
      }
      ctx.stroke();
    };

    const render = (now) => {
      ctx.fillStyle = BASE;
      ctx.fillRect(0, 0, W, H);
      drawGrid();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      pens.forEach((p) => {
        const color = p.pink ? PINK : INK;

        // カーブを描いている間だけ、その円のガイドが薄く見える
        p.segs.forEach((s) => {
          if (s.kind !== "arc") return;
          const age = now - s.born;
          const f = Math.max(0, 1 - Math.abs(age - 0.8) / 1.6);
          if (f <= 0) return;
          ctx.strokeStyle = `rgba(${INK},${GUIDE_A * f})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(s.cx, s.cy, s.r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // 線本体：後ろほど薄く（4段階）
        ctx.lineWidth = LINE_W;
        const tailStart = p.head - p.tail;
        const parts = 4;
        for (let k = 0; k < parts; k++) {
          const a = tailStart + (p.tail * k) / parts;
          const b = tailStart + (p.tail * (k + 1)) / parts;
          ctx.strokeStyle = `rgba(${color},${LINE_A * ((k + 1) / parts)})`;
          tracePart(p, a, b);
        }

        // ペン先
        const s = p.segs.find((sg) => p.head >= sg.start && p.head <= sg.start + sg.len);
        if (s) {
          const [x, y] = pointAt(s, p.head - s.start);
          ctx.fillStyle = `rgba(${p.pink ? PINK : INK},0.8)`;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const loop = (ms) => {
      raf = requestAnimationFrame(loop);
      const now = ms / 1000;
      const dt = Math.min(0.05, now - last);
      last = now;
      if (document.hidden) return;
      step(dt, now);
      render(now);
    };

    resize();
    last = performance.now() / 1000;
    init(last);
    if (reduce) {
      render(last); // 動きを減らす設定：線が描かれた状態で止める
    } else {
      raf = requestAnimationFrame(loop);
    }

    let lastW = W;
    const onResize = () => {
      resize();
      if (Math.abs(W - lastW) > 1) {
        lastW = W;
        init(performance.now() / 1000);
      }
      if (reduce) render(performance.now() / 1000);
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
