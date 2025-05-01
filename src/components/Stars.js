import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Stars = ({ count = 1000 }) => {
  const groupRef = useRef();

  // ランダムな位置に星を配置
  const positions = Array.from({ length: count }, () => [
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
  ]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          {/* 星の大きさ */}
          <sphereGeometry args={[0.05, 64, 64]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
    </group>
  );
};

export default Stars;
