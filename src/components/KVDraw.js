import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// =====================================================================
// KVDraw — 描線でロゴを組み立てる KV
//   1) ロゴの骨格（半径98/50の円×2組・水平/垂直線）が製図ガイドとして引かれる
//   2) ピンクのペン先が輪郭をトレースして黒い線を描く
//   3) 塗りが入り、ガイドが消える
//   スクロール：ロゴが縮小し、ガイドが再び浮かび上がる
// =====================================================================

const LOGO_URL = "/img/PO_rogo_251216.svg";
const INK = 0x231815;
const PINK = 0xe85298;
const GUIDE = 0xb9b0ab;
const GUIDE_LIGHT = 0xcfc8c4;

// ロゴの幾何（SVG viewBox 座標）
const R_OUT = 98.1467678;
const R_IN = 50.5491231;
const C1 = [98.1467678, 98.1467678];
const C2 = [246.8426586, 98.1467678];
const H_LINES = [98.1467678, 0, 246.8376047, 196.2935357];
const V_LINES = [0, 47.5976446, 148.6959356, 297.3917817];

// タイミング（秒）
const T_STROKE_MAIN = [0.7, 2.0]; // [開始, 長さ]
const T_TEXT = 2.0;
const T_FILL = [2.75, 0.7];
const T_GUIDE_OUT = [3.3, 0.8];

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const eio = (x) => {
  x = clamp01(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const eout = (x) => 1 - Math.pow(1 - clamp01(x), 3);

// 太さのある線（2三角形×セグメント）。drawRange で描画量を進める
function ribbonGeometry(pts, w) {
  const n = pts.length / 2;
  const segs = n - 1;
  const pos = new Float32Array(segs * 18);
  for (let i = 0; i < segs; i++) {
    const ax = pts[i * 2], ay = pts[i * 2 + 1];
    const bx = pts[i * 2 + 2], by = pts[i * 2 + 3];
    const dx = bx - ax, dy = by - ay;
    const l = Math.hypot(dx, dy) || 1;
    const nx = (-dy / l) * (w / 2), ny = (dx / l) * (w / 2);
    const v = [
      ax - nx, ay - ny, ax + nx, ay + ny, bx + nx, by + ny,
      ax - nx, ay - ny, bx + nx, by + ny, bx - nx, by - ny,
    ];
    for (let k = 0; k < 6; k++) {
      pos[i * 18 + k * 3] = v[k * 2];
      pos[i * 18 + k * 3 + 1] = v[k * 2 + 1];
      pos[i * 18 + k * 3 + 2] = 0;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.userData.segs = segs;
  g.setDrawRange(0, 0);
  return g;
}
const setProgress = (g, p) =>
  g.setDrawRange(0, Math.floor(g.userData.segs * clamp01(p)) * 6);

// SVG ファイルを読み込んで、パス文字列・viewBox・ラスタ画像を用意
async function loadLogo(url) {
  const text = await (await fetch(url)).text();
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const svg = doc.documentElement;
  const vb = (svg.getAttribute("viewBox") || "0 0 345 247")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const ds = [];
  svg.querySelectorAll("path, rect, polygon").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "path") ds.push(el.getAttribute("d"));
    if (tag === "rect") {
      const x = +el.getAttribute("x"), y = +el.getAttribute("y");
      const w = +el.getAttribute("width"), h = +el.getAttribute("height");
      ds.push(`M${x},${y}h${w}v${h}h${-w}Z`);
    }
    if (tag === "polygon") {
      const p = el.getAttribute("points").trim().split(/[\s,]+/).map(Number);
      let d = `M${p[0]},${p[1]}`;
      for (let i = 2; i < p.length; i += 2) d += `L${p[i]},${p[i + 1]}`;
      ds.push(d + "Z");
    }
  });
  const raster = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = 2048;
      c.height = Math.round((2048 * vb[3]) / vb[2]);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c);
    };
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(text);
  });
  return { w: vb[2], h: vb[3], main: ds[0], text: ds.slice(1), raster };
}

// パスの輪郭を点列にサンプリング（サブパスごと）
function sampleOutline(hiddenSvg, d, step) {
  const ns = "http://www.w3.org/2000/svg";
  return d
    .split(/(?=M)/g)
    .filter(Boolean)
    .map((sd) => {
      const p = document.createElementNS(ns, "path");
      p.setAttribute("d", sd);
      hiddenSvg.appendChild(p);
      const L = p.getTotalLength();
      const n = Math.max(8, Math.ceil(L / step));
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const q = p.getPointAtLength((L * i) / n);
        pts.push(q.x, q.y);
      }
      hiddenSvg.removeChild(p);
      return pts;
    });
}

export default function KVDraw() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let disposed = false;
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return; // WebGL が使えない環境では何も描かない
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xffffff, 0);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
    wrap.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
    const scene = new THREE.Scene();
    const root = new THREE.Group();
    scene.add(root);

    const hidden = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    hidden.style.cssText =
      "position:absolute;width:1px;height:1px;visibility:hidden;left:-9999px;top:0";
    document.body.appendChild(hidden);

    let logo = null;
    let outlines = null;
    let parts = null;
    let texture = null;
    let W = 0, H = 0;
    const start = performance.now();

    const disposeParts = () => {
      if (!parts) return;
      parts.disposables.forEach((d) => d.dispose());
      root.clear();
      parts = null;
    };

    const build = () => {
      if (!logo) return;
      disposeParts();
      const r = wrap.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      renderer.setSize(W, H, false);
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.updateProjectionMatrix();

      const isSp = W <= 768;
      const S = Math.min((W * (isSp ? 0.72 : 0.5)) / logo.w, (H * 0.42) / logo.h);
      const toW = (x, y) => [(x - logo.w / 2) * S, -(y - logo.h / 2) * S];
      const mapPts = (pts) => {
        const out = [];
        for (let i = 0; i < pts.length; i += 2) out.push(...toW(pts[i], pts[i + 1]));
        return out;
      };

      const disposables = [];
      const mesh = (geo, color, order) => {
        const mat = new THREE.MeshBasicMaterial({
          color, transparent: true, depthTest: false, side: THREE.DoubleSide,
        });
        const m = new THREE.Mesh(geo, mat);
        m.renderOrder = order;
        root.add(m);
        disposables.push(geo, mat);
        return m;
      };

      // ガイド（円・線）
      const guides = [];
      const ext = Math.max(W, H) * 2; // スクロール縮小時も画面端まで届く長さ
      [[C1, R_OUT], [C2, R_OUT], [C1, R_IN], [C2, R_IN]].forEach(([c, rad], i) => {
        const pts = [];
        const a0 = i % 2 ? 0 : Math.PI;
        for (let k = 0; k <= 240; k++) {
          const a = a0 + (k / 240) * Math.PI * 2;
          pts.push(...toW(c[0] + Math.cos(a) * rad, c[1] + Math.sin(a) * rad));
        }
        guides.push({ m: mesh(ribbonGeometry(pts, 1), GUIDE, 1), t0: 0.05 + i * 0.12, dur: 1.0 });
      });
      H_LINES.forEach((y, i) => {
        const yy = toW(0, y)[1];
        guides.push({ m: mesh(ribbonGeometry([-ext, yy, ext, yy], 1), GUIDE_LIGHT, 1), t0: i * 0.1, dur: 0.9 });
      });
      V_LINES.forEach((x, i) => {
        const xx = toW(x, 0)[0];
        guides.push({ m: mesh(ribbonGeometry([xx, ext, xx, -ext], 1), GUIDE_LIGHT, 1), t0: 0.15 + i * 0.1, dur: 0.9 });
      });

      // 輪郭ストローク
      const strokes = [];
      outlines.main.forEach((pts) => {
        const p = mapPts(pts);
        strokes.push({
          m: mesh(ribbonGeometry(p, Math.max(1.4, S * 0.75)), INK, 3),
          pts: p, t0: T_STROKE_MAIN[0], dur: T_STROKE_MAIN[1],
        });
      });
      outlines.text.forEach((subs, li) => {
        subs.forEach((pts) => {
          strokes.push({
            m: mesh(ribbonGeometry(mapPts(pts), Math.max(0.8, S * 0.35)), INK, 3),
            t0: T_TEXT + li * 0.06, dur: 0.55,
          });
        });
      });

      // 塗り
      const fillGeo = new THREE.PlaneGeometry(logo.w * S, logo.h * S);
      const fillMat = new THREE.MeshBasicMaterial({
        map: texture, transparent: true, opacity: 0, depthTest: false,
      });
      const fill = new THREE.Mesh(fillGeo, fillMat);
      fill.renderOrder = 2;
      root.add(fill);
      disposables.push(fillGeo, fillMat);

      // ペン先
      const dotGeo = new THREE.CircleGeometry(Math.max(4, S * 2.4), 32);
      const dotMat = new THREE.MeshBasicMaterial({ color: PINK, transparent: true, depthTest: false });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.renderOrder = 5;
      root.add(dot);
      disposables.push(dotGeo, dotMat);

      parts = { guides, strokes, fillMat, dot, dotMat, disposables };
    };

    const update = (t) => {
      if (!parts) return;
      const { guides, strokes, fillMat, dot, dotMat } = parts;

      // スクロール（KV は 300vh。2画面分で完了）
      const sr = eio(window.scrollY / (window.innerHeight * 2));
      root.scale.setScalar(1 - 0.38 * sr);

      const introGuide = 1 - eout((t - T_GUIDE_OUT[0]) / T_GUIDE_OUT[1]);
      const guideAlpha = 0.9 * Math.max(introGuide, sr * 0.7);
      guides.forEach((g) => {
        setProgress(g.m.geometry, eio((t - g.t0) / g.dur));
        g.m.material.opacity = guideAlpha;
      });
      strokes.forEach((s) => setProgress(s.m.geometry, eio((t - s.t0) / s.dur)));

      const main = strokes[0];
      const p = eio((t - main.t0) / main.dur);
      const n = main.pts.length / 2;
      const i = Math.min(n - 1, Math.floor(p * (n - 1)));
      dot.position.set(main.pts[i * 2], main.pts[i * 2 + 1], 0);
      dotMat.opacity = p > 0 && p < 1 ? 1 : 0;

      fillMat.opacity = eout((t - T_FILL[0]) / T_FILL[1]);
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!parts || document.hidden) return;
      if (window.scrollY > window.innerHeight * 3.2) return; // KV が見えない間は止める
      update(reduce ? 20 : (now - start) / 1000);
      renderer.render(scene, camera);
    };

    loadLogo(LOGO_URL)
      .then((l) => {
        if (disposed) return;
        logo = l;
        outlines = {
          main: sampleOutline(hidden, l.main, 0.5),
          text: l.text.map((d) => sampleOutline(hidden, d, 0.25)),
        };
        texture = new THREE.CanvasTexture(l.raster);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        build();
        raf = requestAnimationFrame(frame);
      })
      .catch(() => {});

    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        const r = wrap.getBoundingClientRect();
        if (Math.abs(r.width - W) > 2 || Math.abs(r.height - H) > 2) build();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      disposeParts();
      if (texture) texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      hidden.remove();
    };
  }, []);

  return <div ref={wrapRef} className="kvDraw" aria-hidden="true" />;
}
