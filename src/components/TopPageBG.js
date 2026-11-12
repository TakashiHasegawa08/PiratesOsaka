import React, { useEffect, useRef } from "react";

// =====================================================================
// TopPageBG — 線で描く背景モチーフ
//   数本の「ペン」がグリッド上を、直線と円弧（90°ターン）をつなぎながら
//   描き進む。通った線は一定の長さで後ろから消えていくので、
//   直線と曲線が画面のあちこちで交錯し続ける。
//   円弧の半径はロゴと同じ比率（外径98:内径50 ≒ 2:1）。
//   あわせて、黄金長方形の分割線→黄金らせん、の作図が1つずつ現れては消える。
//   スマホはペン1本＋らせんのみ（グリッドなし）で控えめに。
// =====================================================================

const BASE = "#F4EFE7"; // 薄いベージュ
const INK = "35,24,21";
const PINK = "232,82,152";
const LINE_A = 0.55; // 線の濃さ（ラッパーの opacity .4 と掛け合わさる）
const LINE_W = 1.2; // 線の太さ(px)
const GUIDE_A = 0.14; // カーブ時に一瞬見える円ガイド
const GRID_A = 0.05; // 全体のグリッド線
const SPEED = 110; // ペンの速さ(px/秒)

const SPIRAL_GUIDE_A = 0.26; // 黄金長方形の分割線
const SPIRAL_A = 0.7; // 黄金らせん本体
const PHI = (1 + Math.sqrt(5)) / 2;

const rand = (a, b) => a + Math.random() * (b - a);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const eio = (x) => {
  x = clamp01(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
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
      const dc = (op) => Math.hypot(op.ni - cols / 2, op.nj - rows / 2);
      const o =
        options.find((op) => inside(op.ni, op.nj)) ||
        options.slice().sort((a, b) => dc(a) - dc(b))[0]; // はみ出しそうなら中央寄りへ

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

    // ---------- 黄金らせん ----------
    // 黄金長方形を正方形で分割していく線（直線）を引き、
    // その正方形を四分円でつないだらせん（曲線）を描いて、しばらく残して消える。
    let spirals = [];
    let nextSpiralAt = 0;
    const SP_T = { squares: 0.22, squareDur: 0.5, arcStart: 1.0, arcDur: 3.6, hold: 8, fade: 1.6 };

    const makeSpiral = (born) => {
      const isSp = W <= 768;
      const L = Math.min(
        rand(cell * (isSp ? 2.4 : 3), cell * (isSp ? 3.4 : 5)),
        Math.min(W, H) * (isSp ? 0.62 : 0.55),
      );
      const steps = 9;
      let px = 0, py = 0, h = 0, r = L;
      const arcs = [], squares = [];
      let minX = 0, minY = 0, maxX = 0, maxY = 0;
      for (let k = 0; k < steps; k++) {
        const [fx, fy] = DIRS[h];
        const nh = (h + 1) % 4;
        const [sx, sy] = DIRS[nh];
        const cx = px + sx * r, cy = py + sy * r;
        const ex = px + (fx + sx) * r, ey = py + (fy + sy) * r;
        arcs.push({ cx, cy, r, a0: Math.atan2(py - cy, px - cx), len: (r * Math.PI) / 2 });
        const sq = [px, py, px + fx * r, py + fy * r, ex, ey, cx, cy];
        squares.push(sq);
        for (let i = 0; i < 8; i += 2) {
          minX = Math.min(minX, sq[i]); maxX = Math.max(maxX, sq[i]);
          minY = Math.min(minY, sq[i + 1]); maxY = Math.max(maxY, sq[i + 1]);
        }
        px = ex; py = ey; h = nh; r /= PHI;
      }
      const rot = Math.floor(rand(0, 4)) * (Math.PI / 2);
      const mirror = Math.random() < 0.5 ? -1 : 1;
      const bw0 = maxX - minX, bh0 = maxY - minY;
      const odd = Math.round(rot / (Math.PI / 2)) % 2 === 1;
      const bw = odd ? bh0 : bw0, bh = odd ? bw0 : bh0;
      const m = 16;
      const place = (size, span) =>
        span - size - m * 2 > 0 ? rand(size / 2 + m, span - size / 2 - m) : span / 2;
      return {
        arcs, squares, born, rot, mirror,
        total: arcs.reduce((s, a) => s + a.len, 0),
        bcx: (minX + maxX) / 2, bcy: (minY + maxY) / 2,
        x: place(bw, W), y: place(bh, H),
      };
    };

    const drawSpiral = (sp, now) => {
      const t = now - sp.born;
      const end = SP_T.hold + SP_T.fade;
      if (t > end) return false;
      if (t < 0) return true;
      const fade = 1 - clamp01((t - SP_T.hold) / SP_T.fade);
      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.rotate(sp.rot);
      ctx.scale(sp.mirror, 1);
      ctx.translate(-sp.bcx, -sp.bcy);

      // 分割線（正方形を一辺ずつ描く）
      ctx.strokeStyle = `rgba(${INK},${SPIRAL_GUIDE_A * fade})`;
      ctx.lineWidth = 1;
      sp.squares.forEach((q, k) => {
        const p = eio((t - k * SP_T.squares) / SP_T.squareDur) * 4;
        if (p <= 0) return;
        ctx.beginPath();
        ctx.moveTo(q[0], q[1]);
        for (let e = 0; e < 4; e++) {
          const a = (e * 2) % 8, b = ((e + 1) * 2) % 8;
          const f = clamp01(p - e);
          if (f <= 0) break;
          ctx.lineTo(q[a] + (q[b] - q[a]) * f, q[a + 1] + (q[b + 1] - q[a + 1]) * f);
        }
        ctx.stroke();
      });

      // らせん本体
      const head = eio((t - SP_T.arcStart) / SP_T.arcDur) * sp.total;
      if (head > 0) {
        ctx.strokeStyle = `rgba(${INK},${SPIRAL_A * fade})`;
        ctx.lineWidth = LINE_W * 1.3;
        ctx.beginPath();
        let acc = 0, hx = 0, hy = 0;
        for (const a of sp.arcs) {
          if (acc >= head) break;
          const f = Math.min(1, (head - acc) / a.len);
          const a1 = a.a0 + (Math.PI / 2) * f;
          ctx.arc(a.cx, a.cy, a.r, a.a0, a1, false);
          hx = a.cx + Math.cos(a1) * a.r;
          hy = a.cy + Math.sin(a1) * a.r;
          acc += a.len;
        }
        ctx.stroke();
        if (head < sp.total) {
          ctx.fillStyle = `rgba(${PINK},0.85)`;
          ctx.beginPath();
          ctx.arc(hx, hy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      return true;
    };

    const init = (now) => {
      const isSp = W <= 768;
      const n = isSp ? 1 : 4;
      pens = [];
      for (let k = 0; k < n; k++) {
        const p = makePen(now);
        p.pink = !isSp && k === 0;
        if (isSp) p.tail = rand(3, 5) * cell; // スマホは短く
        pens.push(p);
      }
      // 最初から線がある状態で始める
      for (let t = 0; t < 8; t += 1 / 30) step(1 / 30, now - 8 + t);
      spirals = [makeSpiral(now - 2.5)]; // 描きかけのらせんから始める
      nextSpiralAt = Infinity;
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
      if (W > 768) drawGrid(); // スマホはグリッドなし
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 黄金らせん：1つ描き終えて消えたら、少し間をおいて次を別の場所に
      spirals = spirals.filter((sp) => drawSpiral(sp, now));
      if (!spirals.length) {
        if (nextSpiralAt === Infinity) nextSpiralAt = now + rand(1.2, 3);
        else if (now >= nextSpiralAt) {
          spirals.push(makeSpiral(now));
          nextSpiralAt = Infinity;
        }
      }

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
      spirals = [makeSpiral(last - 6)]; // らせんが描き終わった状態
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
