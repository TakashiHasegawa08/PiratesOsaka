import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const BackgroundPlane = () => {
  const texture = useLoader(THREE.TextureLoader, "/img/space.png");
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} position={[0, 0, -50]}>
      {/* カメラの後方に大きな平面を配置 */}
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export default BackgroundPlane;
