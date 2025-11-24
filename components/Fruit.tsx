import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FruitData } from '../types';
import { GRAVITY, FRUIT_CONFIG } from '../constants';

interface FruitProps {
  data: FruitData;
  onSlice: (id: number, position: THREE.Vector3, points: number, type: any) => void;
  onMiss: (id: number) => void;
}

const Fruit: React.FC<FruitProps> = ({ data, onSlice, onMiss }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState(true);
  
  // Track time for manual physics calculation
  const timeRef = useRef(0);
  
  const config = FRUIT_CONFIG[data.type];

  // Random start rotation axis
  const rotAxis = useMemo(() => new THREE.Vector3(
    Math.random() - 0.5, 
    Math.random() - 0.5, 
    Math.random() - 0.5
  ).normalize(), []);

  useFrame((state, delta) => {
    if (!active || !meshRef.current) return;

    timeRef.current += delta;
    const t = timeRef.current;

    // Simple projectile motion: y = v0*t - 0.5*g*t^2
    const x = data.x + data.vx * t;
    const y = -4 + (data.vy * t) - (0.5 * GRAVITY * t * t);
    
    meshRef.current.position.set(x, y, 0);
    meshRef.current.rotateOnAxis(rotAxis, data.rotationSpeed * delta);

    // Check bounds (fallen off screen)
    if (y < -6) {
      setActive(false);
      onMiss(data.id);
    }
  });

  const handlePointerEnter = (e: any) => {
    if (active) {
      e.stopPropagation(); 
      setActive(false);
      if (meshRef.current) {
        onSlice(data.id, meshRef.current.position.clone(), data.points, data.type);
      }
    }
  };

  if (!active) return null;

  const renderGeometry = () => {
    if (data.type === 'banana') {
      // Rotate cylinder to look like it's tumbling length-wise more naturally
      return (
        <mesh rotation={[Math.PI / 4, 0, 0]}>
           <capsuleGeometry args={[0.3, 1.2, 4, 16]} />
           <meshStandardMaterial color={config.color} roughness={config.roughness} />
        </mesh>
      );
    }
    
    // Apples, Oranges, Melons are spheres
    return (
      <mesh>
        <sphereGeometry args={[config.radius, 32, 32]} />
        <meshStandardMaterial 
          color={config.color} 
          roughness={config.roughness} 
          metalness={0.1}
        />
      </mesh>
    );
  };

  const renderStem = () => {
    if (data.type === 'melon') return null; // Melons don't show stem usually in game
    
    // Simple stem for apple/orange
    return (
      <mesh position={[0, config.radius * 0.9, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#3f2e00" />
      </mesh>
    );
  };

  return (
    <group ref={meshRef} position={[data.x, -4, 0]} scale={data.scale}>
      <group 
        onPointerEnter={handlePointerEnter}
        onClick={handlePointerEnter} 
      >
        {renderGeometry()}
        {renderStem()}
        
        {/* Decorative Melon Stripes */}
        {data.type === 'melon' && (
           <mesh rotation={[0,0,Math.PI/2]} scale={[1.01, 1.01, 1.01]}>
             <sphereGeometry args={[1, 16, 16]} />
             <meshStandardMaterial color="#90EE90" wireframe transparent opacity={0.15} />
           </mesh>
        )}
      </group>
    </group>
  );
};

export default Fruit;