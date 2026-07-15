import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Stars from "./Stars";

const KV = () => {
  const ref = useRef();
  const matRef = useRef();
  const scrollRef = useRef(0);
  const { size } = useThree();

  const texture = useLoader(THREE.TextureLoader, "/img/PO_rogo_251216.png");

  useEffect(() => {
    const handleScroll = () => (scrollRef.current = window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!texture) return;

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;

    // PNG縁の滲み保険
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    texture.needsUpdate = true;
  }, [texture]);

  // ✅ 画像の縦横比（変倍防止）
  const planeArgs = useMemo(() => {
    const img = texture?.image;
    if (!img?.width || !img?.height) return [1, 1];
    const aspect = img.width / img.height;
    return [aspect, 1];
  }, [texture]);

  // ✅ 角が出にくい “丸い” ブラー寄り（17-tap）＋ UVクランプ
  const material = useMemo(() => {
    const w = Math.max(1, size.width);
    const h = Math.max(1, size.height);

    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMap: { value: texture },
        uBlur: { value: 0.0 }, // px相当（useFrameで更新）
        uTexel: { value: new THREE.Vector2(1 / w, 1 / h) },
        uOpacity: { value: 0.95 }, // 透明度固定
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uBlur;
        uniform vec2 uTexel;
        uniform float uOpacity;
        varying vec2 vUv;

        vec4 sampleBlur(vec2 uv, float r){
          // 端が出るのを抑える（UV外サンプル防止）
          uv = clamp(uv, vec2(0.001), vec2(0.999));

          vec2 t = uTexel * r;

          // 17-tap（円形寄り）：角が出にくい
          vec4 c = texture2D(uMap, uv) * 0.16;

          // 1段目
          c += texture2D(uMap, uv + vec2( t.x, 0.0)) * 0.08;
          c += texture2D(uMap, uv + vec2(-t.x, 0.0)) * 0.08;
          c += texture2D(uMap, uv + vec2(0.0,  t.y)) * 0.08;
          c += texture2D(uMap, uv + vec2(0.0, -t.y)) * 0.08;

          c += texture2D(uMap, uv + vec2( t.x,  t.y)) * 0.07;
          c += texture2D(uMap, uv + vec2(-t.x,  t.y)) * 0.07;
          c += texture2D(uMap, uv + vec2( t.x, -t.y)) * 0.07;
          c += texture2D(uMap, uv + vec2(-t.x, -t.y)) * 0.07;

          // 2段目（少し広げる）
          vec2 t2 = t * 1.8;
          c += texture2D(uMap, uv + vec2( t2.x, 0.0)) * 0.05;
          c += texture2D(uMap, uv + vec2(-t2.x, 0.0)) * 0.05;
          c += texture2D(uMap, uv + vec2(0.0,  t2.y)) * 0.05;
          c += texture2D(uMap, uv + vec2(0.0, -t2.y)) * 0.05;

          c += texture2D(uMap, uv + vec2( t2.x,  t2.y)) * 0.04;
          c += texture2D(uMap, uv + vec2(-t2.x,  t2.y)) * 0.04;
          c += texture2D(uMap, uv + vec2( t2.x, -t2.y)) * 0.04;
          c += texture2D(uMap, uv + vec2(-t2.x, -t2.y)) * 0.04;

          return c;
        }

        void main() {
          float r = max(uBlur, 0.0);
          vec4 col = (r < 0.01) ? texture2D(uMap, vUv) : sampleBlur(vUv, r);

          // 透明PNG：alpha維持（opacityは固定）
          gl_FragColor = vec4(col.rgb, col.a * uOpacity);
        }
      `,
    });
  }, [texture, size.width, size.height]);

  // リサイズ追随（ブラーのpx感を維持）
  useEffect(() => {
    if (!material) return;
    material.uniforms.uTexel.value.set(
      1 / Math.max(1, size.width),
      1 / Math.max(1, size.height)
    );
  }, [material, size.width, size.height]);

  useEffect(() => {
    const mat = matRef.current;
    if (!mat?.uniforms) return;

    const vw = window.innerWidth || 9999;
    const isSP = vw <= 768;
    mat.uniforms.uBlur.value = isSP ? 4.0 : 14.0;
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    const mat = matRef.current; // ← ここ重要：実際にアタッチされてるmaterial
    if (!mat?.uniforms) return;

    const scrollY = scrollRef.current;
    const maxScroll = window.innerHeight * 2;
    const scrollRatio = Math.min(scrollY / maxScroll, 1);
    const easedRatio = 1 - Math.pow(1 - scrollRatio, 3);

    // スケール・回転
    const minScale = 4.0;
    const maxScale = 40.0;
    const scaleFactor = maxScale - scrollRatio * (maxScale - minScale);
    ref.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

    ref.current.rotation.x = Math.PI * 2 * (1 - easedRatio);
    ref.current.rotation.y = Math.PI * 2 * (1 - easedRatio);
    ref.current.rotation.z = Math.PI * 1 * (1 - easedRatio);

    // ✅ SP判定（viewport）
    const vw = window.innerWidth || 9999;
    const isSP = vw <= 768;

    const blurMaxPC = 14.0;
    const blurMaxSP = 4.0;
    const blurMax = isSP ? blurMaxSP : blurMaxPC;

    mat.uniforms.uBlur.value = (1 - easedRatio) * blurMax;
  });

  return (
    <>
      <Stars />
      <mesh ref={ref} position={[0, 0, 0]}>
        <planeGeometry args={planeArgs} />
        <primitive object={material} ref={matRef} attach="material" />
      </mesh>
    </>
  );
};

export default KV;
