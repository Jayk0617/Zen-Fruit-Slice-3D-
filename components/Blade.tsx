import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';
import '../types';

interface BladeProps {
  color: string;
}

const Blade: React.FC<BladeProps> = ({ color }) => {
  const { viewport, mouse } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      // Map normalized mouse coordinates (-1 to 1) to viewport world coordinates
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      // Keep z slightly in front of fruits
      ref.current.position.set(x, y, 1);
    }
  });

  return (
    <>
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {ref.current && (
        <Trail
          width={1.2}
          length={6}
          color={new THREE.Color(color)}
          attenuation={(t) => t * t}
          target={ref}
        >
          <mesh>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </Trail>
      )}
    </>
  );
};

export default Blade;