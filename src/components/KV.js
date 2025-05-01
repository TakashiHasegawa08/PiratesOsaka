import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import Stars from "./Stars";
import BackgroundSphere from "./BackgroundSphere";

const KV = () => {
  const { scene } = useGLTF("/img/pirates_mark.glb?v=2");
  const ref = useRef();
  const scrollRef = useRef(0);

  const rotationRef = useRef({
    xSpeed: (Math.random() - 0.5) * 0.01,
    ySpeed: (Math.random() - 0.5) * 0.01,
    zSpeed: (Math.random() - 0.5) * 0.01,
  });

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // モデルの中心を修正
  useEffect(() => {
    scene.position.set(0, 0, 0); // モデル全体を0原点に
    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.center();

        const mat = child.material;

        console.log("✅ マテリアル名:", mat.name);
        console.log("📦 マテリアルタイプ:", mat.type);
        console.log("🎨 色:", mat.color?.getHexString());
        console.log("🔆 透明度:", mat.opacity);
        console.log("🧾 テクスチャ:", mat.map);

        // 半透明にしたい場合
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = 0.9;
          child.material.emissive = child.material.color.clone();
          child.material.emissiveIntensity = 0.3;
        }
        if (mat.name === "Material.003") {
          mat.transparent = true; // ← これがないと opacity 効かない
          mat.opacity = 0.5; // さらに薄くしたい場合（例：0.3〜0.5）

          // 発光させて視認性を高めたい場合
          mat.emissive = mat.color.clone();
          mat.emissiveIntensity = 0.2;
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (ref.current) {
      const scrollY = scrollRef.current;

      const minScale = 0.2;
      const maxScale = 8.0;
      const maxScroll = window.innerHeight * 2;

      const scrollRatio = Math.min(scrollY / maxScroll, 1);

      const scaleFactor = maxScale - scrollRatio * (maxScale - minScale);
      ref.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // 回転角度の目標 → 最初に3回転して、最後に0に戻る
      const totalRotationX = Math.PI * 2;
      const totalRotationY = Math.PI * 2;
      const totalRotationZ = Math.PI * 1;

      // 回転をスクロールに応じて「だんだん正面に近づける」
      const easedRatio = 1 - Math.pow(1 - scrollRatio, 3); // easeOutCubic
      ref.current.rotation.x = totalRotationX * (1 - easedRatio);
      ref.current.rotation.y = totalRotationY * (1 - easedRatio);
      ref.current.rotation.z = totalRotationZ * (1 - easedRatio);
    }
  });

  return (
    <>
      <Stars />
      <primitive
        ref={ref}
        object={scene}
        scale={2.0}
        position={[0, 0, 0]} // 中央に
      />
    </>
  );
};

export default KV;
