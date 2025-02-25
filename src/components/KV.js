import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const KV = () => {
  const pointsMeshRef = useRef();
  const originalPositionsRef = useRef();
  const isAnimatingRef = useRef(true);
  const hoverIndices = useRef(new Set());

  useEffect(() => {
    const loadImageAndGeneratePoints = async () => {
      const img = new Image();
      img.src = "/img/PO_KV_2503.png";
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        const positions = [];
        const density = 1;

        for (let y = 0; y < img.height; y += density) {
          for (let x = 0; x < img.width; x += density) {
            const index = (y * img.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const alpha = data[index + 3];

            if (r > 200 && g > 200 && b > 200 && alpha > 200) {
              const px = x - img.width / 2;
              const py = -(y - img.height / 2);
              positions.push(px, py, 0);
            }
          }
        }

        // デバイスごとにY座標を調整
        const isMobile = window.innerWidth <= 768; // スマホの判定
        for (let i = 1; i < positions.length; i += 3) {
          if (isMobile) {
            positions[i] -= 150; // スマホの場合にY座標を下げる
          } else {
            positions[i] -= 50; // PCの場合にY座標を少し下げる
          }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );

        const pointsMaterial = new THREE.PointsMaterial({
          color: 0x000000,
          size: 1.2,
        });

        const pointsMesh = new THREE.Points(geometry, pointsMaterial);

        if (pointsMeshRef.current) {
          pointsMeshRef.current.add(pointsMesh);

          originalPositionsRef.current = positions.slice();

          const positionArray = geometry.attributes.position.array;
          for (let i = 0; i < positionArray.length; i++) {
            positionArray[i] += (Math.random() - 0.5) * 2500;
          }
          geometry.attributes.position.needsUpdate = true;
        }
      };
    };

    loadImageAndGeneratePoints();
  }, []);

  const handlePointerMove = (event) => {
    if (!pointsMeshRef.current || !originalPositionsRef.current) return;

    const canvasBounds = event.target.getBoundingClientRect();
    const mouseX =
      ((event.clientX || event.touches?.[0]?.clientX) - canvasBounds.left) /
      canvasBounds.width;
    const mouseY =
      ((event.clientY || event.touches?.[0]?.clientY) - canvasBounds.top) /
      canvasBounds.height;

    // キャンバス座標に変換
    const x = (mouseX - 0.5) * canvasBounds.width;
    const y = -(mouseY - 0.5) * canvasBounds.height;

    const geometry = pointsMeshRef.current.children[0].geometry;
    const positionArray = geometry.attributes.position.array;

    for (let i = 0; i < positionArray.length; i += 3) {
      const dx = positionArray[i] - x;
      const dy = positionArray[i + 1] - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        hoverIndices.current.add(i / 3);

        const influence = Math.pow(1 - distance / 150, 2);
        positionArray[i] += (Math.random() - 0.5) * 50 * influence;
        positionArray[i + 1] += (Math.random() - 0.5) * 50 * influence;
      }
    }

    geometry.attributes.position.needsUpdate = true;
  };

  useFrame(() => {
    if (
      pointsMeshRef.current &&
      pointsMeshRef.current.children.length > 0 &&
      originalPositionsRef.current
    ) {
      const geometry = pointsMeshRef.current.children[0].geometry;
      const positionArray = geometry.attributes.position.array;

      let isComplete = true;

      for (let i = 0; i < positionArray.length; i++) {
        const original = originalPositionsRef.current[i];
        const current = positionArray[i];
        const delta = (original - current) * 0.03;

        positionArray[i] += delta;

        if (hoverIndices.current.has(i / 3)) {
          hoverIndices.current.delete(i / 3);
        } else if (Math.abs(delta) > 0.1) {
          isComplete = false;
        }
      }

      if (isAnimatingRef.current && isComplete) {
        isAnimatingRef.current = false;
      }

      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group
      ref={pointsMeshRef}
      onPointerMove={(e) => handlePointerMove(e.nativeEvent)}
      onPointerDown={(e) => handlePointerMove(e.nativeEvent)}
    />
  );
};

export default function App() {
  return (
    <div id="KV">
      <Canvas camera={{ position: [0, 0, 1000], fov: 65 }}>
        <ambientLight intensity={1} />
        <KV />
      </Canvas>
    </div>
  );
}
