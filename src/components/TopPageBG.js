import React, { useEffect, useRef } from "react";

// =====================================================================
// TopPageBG — 線で描く背景モチーフ（シンプル版）
//   ・ペンがグリッド上を、直線と円弧（90°ターン）をつなぎながら描き進む。
//     通った線は一定の長さで後ろから消えていく。
//   ・ときどき、黄金比で半径が縮んでいく曲線（らせんの外側の数周だけ）が
//     ひと筆書きで描かれ、同じように後ろから消える。
//   ・ペン先はピンクの点。
// =====================================================================

const BASE = "#F4EFE7"; // 薄いベージュ
const INK = "35,24,21";
const PINK = "232,82,152";
const LINE_A = 0.5; // 線の濃さ（ラッパーの opacity .4 と掛け合わさる）
const LINE_W = 1.2; // 線の太さ(px)
const SPEED = 100; // ペンの速さ(px/秒)
const PENS_PC = 2;
const PENS_SP = 1;
const CURL_ARCS = 4; // らせんの周回数（四分円の数）
const PHI = (1 + Math.sqrt(5)) / 2;

const rand = (a, b) => a + Math.random() * (b - a);
const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // 右・下・左・上（画面座標）

// 道のり上の点
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

    let W = 0, H = 0, cell = 120, ox = 0, oy = 0, cols = 0, rows = 0;
    let pens = [];
    let curl = null;
    let nextCurlAt = 0;
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

    // ---------- ペン（直線＋90°ターン） ----------
    const nextSegment = (pen) => {
      const straight = () => {
        const n = 1 + Math.floor(rand(0, 3));
        const [dx, dy] = DIRS[pen.h];
        return { kind: "line", ni: pen.i + dx * n, nj: pen.j + dy * n, nh: pen.h };
      };
      const turn = (side, k) => {
        const nh = (pen.h + side + 4) % 4;
        const [fx, fy] = DIRS[pen.h];
        const [sx, sy] = DIRS[nh];
        return { kind: "arc", ni: pen.i + (fx + sx) * k, nj: pen.j + (fy + sy) * k, nh, k, side };
      };
      const options = [];
      if (Math.random() < 0.55) options.push(straight());
      options.push(turn(Math.random() < 0.5 ? 1 : -1, Math.random() < 0.5 ? 1 : 2));
      options.push(turn(1, 1), turn(-1, 1), straight(), turn(1, 2), turn(-1, 2));
      const dc = (op) => Math.hypot(op.ni - cols / 2, op.nj - rows / 2);
      const o =
        options.find((op) => inside(op.ni, op.nj)) ||
        options.slice().sort((a, b) => dc(a) - dc(b))[0];

      const x0 = gx(pen.i), y0 = gy(pen.j);
      let seg;
      if (o.kind === "line") {
        const x1 = gx(o.ni), y1 = gy(o.nj);
        seg = { kind: "line", x0, y0, x1, y1, len: Math.hypot(x1 - x0, y1 - y0) };
      } else {
        const r = o.k * cell;
        const [sx, sy] = DIRS[o.nh];
        const cx = x0 + sx * r, cy = y0 + sy * r;
        seg = {
          kind: "arc", cx, cy, r,
          a0: Math.atan2(y0 - cy, x0 - cx),
          da: (Math.PI / 2) * o.side,
          len: (r * Math.PI) / 2,
        };
      }
      seg.start = pen.total;
      pen.total += seg.len;
      pen.segs.push(seg);
      pen.i = o.ni;
      pen.j = o.nj;
      pen.h = o.nh;
    };

    const makePen = () => ({
      i: Math.floor(rand(1, cols)),
      j: Math.floor(rand(1, rows)),
      h: Math.floor(rand(0, 4)),
      segs: [],
      total: 0,
      head: 0,
      tail: (W <= 768 ? rand(3, 5) : rand(4, 7)) * cell, // 残す線の長さ
      speed: SPEED * rand(0.8, 1.2),
    });

    // ---------- 黄金比の曲線（らせんの外側だけ、ひと筆書き） ----------
    const makeCurl = () => {
      const L = cell * rand(1.8, 2.8);
      let px = 0, py = 0, h = Math.floor(rand(0, 4)), r = L;
      const side = Math.random() < 0.5 ? 1 : -1;
      const segs = [];
      let total = 0, minX = 0, minY = 0, maxX = 0, maxY = 0;
      for (let k = 0; k < CURL_ARCS; k++) {
        const nh = (h + side + 4) % 4;
        const [sx, sy] = DIRS[nh];
        const cx = px + sx * r, cy = py + sy * r;
        const seg = {
          kind: "arc", cx, cy, r,
          a0: Math.atan2(py - cy, px - cx),
          da: (Math.PI / 2) * side,
          len: (r * Math.PI) / 2, start: total,
        };
        segs.push(seg);
        total += seg.len;
        [[cx - r, cy - r], [cx + r, cy + r]].forEach(([x, y]) => {
          minX = Math.min(minX, x); maxX = Math.max(maxX, x);
          minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        });
        [px, py] = pointAt(seg, seg.len);
        h = nh;
        r /= PHI;
      }
      // 画面内のどこかに置く
      const bw = maxX - minX, bh = maxY - minY;
      const dx = bw < W ? rand(-minX, W - maxX) : W / 2;
      const dy = bh < H ? rand(-minY, H - maxY) : H / 2;
      segs.forEach((s) => { s.cx += dx; s.cy += dy; });
      return { segs, total, head: 0, tail: 0, speed: SPEED * 0.9 };
    };

    const init = () => {
      const n = W <= 768 ? PENS_SP : PENS_PC;
      pens = [];
      for (let k = 0; k < n; k++) pens.push(makePen());
      for (let t = 0; t < 8; t += 1 / 30) step(1 / 30, 0); // 最初から線がある状態に
      curl = null;
      nextCurlAt = performance.now() / 1000 + rand(2, 5);
    };

    const step = (dt, now) => {
      pens.forEach((p) => {
        p.head += p.speed * dt;
        while (p.total < p.head + cell * 3) nextSegment(p);
        while (p.segs.length && p.segs[0].start + p.segs[0].len < p.head - p.tail) p.segs.shift();
      });
      if (curl) {
        curl.head = Math.min(curl.total, curl.head + curl.speed * dt);
        // 描き終えたら少し置いて、描き始めから消していく
        if (curl.head >= curl.total) curl.wait = (curl.wait || 0) + dt;
        if (curl.wait > 1.5) curl.tail += curl.speed * dt;
        if (curl.tail >= curl.total) {
          curl = null;
          nextCurlAt = now + rand(5, 10);
        }
      } else if (now && now >= nextCurlAt) {
        curl = makeCurl();
      }
    };

    // [from, to] の範囲を描く
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

    const headDot = (segs, d) => {
      const s = segs.find((sg) => d >= sg.start && d <= sg.start + sg.len);
      if (!s) return;
      const [x, y] = pointAt(s, d - s.start);
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
        // 後ろほど薄く（4段階）
        const t0 = p.head - p.tail;
        for (let k = 0; k < 4; k++) {
          ctx.strokeStyle = `rgba(${INK},${LINE_A * ((k + 1) / 4)})`;
          trace(p.segs, t0 + (p.tail * k) / 4, t0 + (p.tail * (k + 1)) / 4);
        }
        headDot(p.segs, p.head);
      });

      if (curl) {
        ctx.strokeStyle = `rgba(${INK},${LINE_A})`;
        trace(curl.segs, curl.tail, curl.head);
        if (curl.head < curl.total) headDot(curl.segs, curl.head);
      }
    };

    const loop = (ms) => {
      raf = requestAnimationFrame(loop);
      const now = ms / 1000;
      const dt = Math.min(0.05, now - last);
      last = now;
      if (document.hidden) return;
      step(dt, now);
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
