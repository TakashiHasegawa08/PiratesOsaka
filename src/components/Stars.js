import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader, AdditiveBlending } from "three";

const Stars = ({ count = 1000 }) => {
  const groupRef = useRef();
  const texture = useLoader(TextureLoader, "/img/star.svg");

  const stars = Array.from({ length: count }, () => ({
    position: [
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
    ],
    scale: Math.random() * 0.15 + 0.01,
  }));

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {stars.map((star, i) => (
        <sprite
          key={i}
          position={star.position}
          scale={[star.scale, star.scale, 1]}
        >
          <spriteMaterial
            map={texture}
            transparent
            blending={AdditiveBlending}
            depthWrite={false} // 後ろのオブジェクトと重なったときの透明度確保
          />
        </sprite>
      ))}
    </group>
  );
};

export default Stars;
