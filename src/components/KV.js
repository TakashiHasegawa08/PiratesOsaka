import React, { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import Stars from "./Stars";

// =====================================================================
// 穴検出：全 subPath を個別 Shape 化 → 含有関係で親子を再構築
// 「o」の中などが塗り潰されないように、SVGLoader の winding 検出に頼らない。
// =====================================================================
function pointInPolygon(pt, polyPts) {
  let inside = false;
  const { x, y } = pt;
  for (let i = 0, j = polyPts.length - 1; i < polyPts.length; j = i++) {
    const xi = polyPts[i].x,
      yi = polyPts[i].y;
    const xj = polyPts[j].x,
      yj = polyPts[j].y;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function centroid(pts) {
  let sx = 0,
    sy = 0;
  for (const p of pts) {
    sx += p.x;
    sy += p.y;
  }
  return { x: sx / pts.length, y: sy / pts.length };
}

function buildShapesWithHoles(allShapes) {
  if (allShapes.length === 0) return [];
  const items = allShapes.map((s) => {
    const pts = s.getPoints(64);
    return {
      shape: s,
      pts,
      testPt: centroid(pts), // 端点ではなく重心で判定（精度◎）
      area: Math.abs(THREE.ShapeUtils.area(pts)),
      parent: null,
      depth: 0,
    };
  });

  // 重心が他シェイプに含まれるか → 「最小面積の親」を選ぶ
  for (let i = 0; i < items.length; i++) {
    let best = null;
    for (let j = 0; j < items.length; j++) {
      if (i === j) continue;
      if (items[j].area <= items[i].area) continue;
      if (pointInPolygon(items[i].testPt, items[j].pts)) {
        if (!best || items[j].area < best.area) best = items[j];
      }
    }
    items[i].parent = best;
  }

  for (const it of items) {
    let d = 0,
      cur = it.parent;
    while (cur) {
      d++;
      cur = cur.parent;
    }
    it.depth = d;
  }

  for (const it of items) it.shape.holes = [];

  // 偶数ネスト = 独立ソリッド、奇数ネスト = 親の穴
  const result = [];
  for (const it of items) {
    if (it.depth % 2 === 0) {
      result.push(it.shape);
    } else {
      const hole = new THREE.Path();
      hole.curves = it.shape.curves.slice(); // カーブのまま渡して滑らかさ維持
      if (it.shape.currentPoint)
        hole.currentPoint = it.shape.currentPoint.clone();
      it.parent.shape.holes.push(hole);
    }
  }
  return result;
}

// =====================================================================
// SVG を高解像度キャンバステクスチャとして読み込む（止め絵用）
// =====================================================================
function useSvgCanvasTexture(url, scale = 4) {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        const m = text.match(/viewBox\s*=\s*"([\d.\-\s]+)"/);
        let vbW = 345,
          vbH = 247;
        if (m) {
          const parts = m[1].trim().split(/\s+/).map(Number);
          if (parts.length >= 4) {
            vbW = parts[2];
            vbH = parts[3];
          }
        }
        const blob = new Blob([text], { type: "image/svg+xml" });
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          if (cancelled) {
            URL.revokeObjectURL(blobUrl);
            return;
          }
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(vbW * scale));
          canvas.height = Math.max(1, Math.round(vbH * scale));
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(blobUrl);
          const t = new THREE.CanvasTexture(canvas);
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 8;
          t.magFilter = THREE.LinearFilter;
          t.minFilter = THREE.LinearMipmapLinearFilter;
          t.needsUpdate = true;
          setInfo({ texture: t, aspect: vbW / vbH });
        };
        img.onerror = () => URL.revokeObjectURL(blobUrl);
        img.src = blobUrl;
      });
    return () => {
      cancelled = true;
    };
  }, [url, scale]);
  return info;
}

// =====================================================================
// 本体
// =====================================================================
const KV = () => {
  const group = useRef();
  const mesh3D = useRef();
  const meshFlat = useRef();
  const scrollRef = useRef(0);
  const { gl, scene } = useThree();

  const svgData = useLoader(SVGLoader, "/img/PO_rogo_251216.svg");
  const flatInfo = useSvgCanvasTexture("/img/PO_rogo_251216.svg", 4);

  // 環境マップ（曲面のハイライト用）
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const prev = scene.environment;
    scene.environment = envTex;
    return () => {
      scene.environment = prev;
      envTex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    const handleScroll = () => (scrollRef.current = window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SVG → Geometry（全 subPath を拾って再構築）
  const geo = useMemo(() => {
    if (!svgData) return null;

    const rawShapes = [];
    for (const path of svgData.paths) {
      for (const subPath of path.subPaths) {
        const shape = new THREE.Shape();
        shape.curves = subPath.curves.slice();
        if (subPath.currentPoint)
          shape.currentPoint = subPath.currentPoint.clone();
        rawShapes.push(shape);
      }
    }
    const shapes = buildShapesWithHoles(rawShapes);

    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: 50,
      bevelEnabled: false,
      curveSegments: 32,
    });

    g.computeBoundingBox();
    const bb = g.boundingBox;
    const cx = (bb.min.x + bb.max.x) / 2;
    const cy = (bb.min.y + bb.max.y) / 2;
    const cz = (bb.min.z + bb.max.z) / 2;
    g.translate(-cx, -cy, -cz);
    g.scale(1, -1, 1);

    const width = bb.max.x - bb.min.x;
    const height = bb.max.y - bb.min.y;
    const maxDim = Math.max(width, height);
    g.scale(1 / maxDim, 1 / maxDim, 1 / maxDim);
    g.computeVertexNormals();

    return {
      geometry: g,
      normW: width / maxDim,
      normH: height / maxDim,
    };
  }, [svgData]);

  // 3Dマテリアル：非メタル・半透明・clearcoatで曲面にグラデハイライト
  const material3D = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#231815"),
      metalness: 0.0,
      roughness: 0.4,
      clearcoat: 0.7, // ツヤ膜 → 曲面にハイライトが走る
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0.6, // 全体半透明
      envMapIntensity: 0.7, // 環境反射を控えめに
      side: THREE.DoubleSide,
      depthWrite: false, // 半透明の重なり対策
    });
  }, []);

  // 止め絵マテリアル：SVG をそのまま貼る（depthTest無効で必ず前に出る）
  const materialFlat = useMemo(() => {
    if (!flatInfo) return null;
    return new THREE.MeshBasicMaterial({
      map: flatInfo.texture,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false, // SVG本来の色をそのまま出す
    });
  }, [flatInfo]);

  useEffect(() => () => geo?.geometry?.dispose(), [geo]);
  useEffect(() => () => material3D.dispose(), [material3D]);
  useEffect(() => () => materialFlat?.dispose(), [materialFlat]);

  useFrame(() => {
    if (!group.current) return;
    const scrollY = scrollRef.current;
    const maxScroll = window.innerHeight * 2;
    const scrollRatio = Math.min(scrollY / maxScroll, 1);
    const easedRatio = 1 - Math.pow(1 - scrollRatio, 3);

    // スケール・回転（既存のまま）
    const minScale = 4.0;
    const maxScale = 40.0;
    const scaleFactor = maxScale - scrollRatio * (maxScale - minScale);
    group.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    group.current.rotation.x = Math.PI * 2 * (1 - easedRatio);
    group.current.rotation.y = Math.PI * 2 * (1 - easedRatio);
    group.current.rotation.z = Math.PI * 1 * (1 - easedRatio);

    // 終端クロスフェード：scrollRatio 0.88 → 1.0 で 3D → SVG
    const FADE_START = 0.88;
    const fadeT = Math.max(
      0,
      Math.min(1, (scrollRatio - FADE_START) / (1 - FADE_START)),
    );
    const base3DOpacity = 0.6;
    material3D.opacity = base3DOpacity * (1 - fadeT);
    if (materialFlat) materialFlat.opacity = fadeT;

    if (mesh3D.current) mesh3D.current.visible = material3D.opacity > 0.001;
    if (meshFlat.current)
      meshFlat.current.visible = (materialFlat?.opacity ?? 0) > 0.001;
  });

  if (!geo) return null;

  return (
    <>
      <Stars />
      {/* 非メタルでも曲面グラデが出るよう、環境＋弱いディレクショナル */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={0.9} />
      <directionalLight position={[-4, -2, 3]} intensity={0.35} />

      <group ref={group}>
        {/* 3Dメッシュ */}
        <mesh ref={mesh3D} geometry={geo.geometry} material={material3D} />

        {/* 止め絵用：SVGをそのまま貼る板ポリ（3Dメッシュと同じサイズ） */}
        {materialFlat && (
          <mesh ref={meshFlat} renderOrder={2} position={[0, 0, 0]}>
            <planeGeometry args={[geo.normW, geo.normH]} />
            <primitive object={materialFlat} attach="material" />
          </mesh>
        )}
      </group>
    </>
  );
};

export default KV;
