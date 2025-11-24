import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../types';

interface DebrisProps {
  position: THREE.Vector3;
  skinColor: string;
  fleshColor: string;
}

const DebrisPiece: React.FC<{ startPos: THREE.Vector3, velocity: THREE.Vector3, color: string, scale: THREE.Vector3 }> = ({ startPos, velocity, color, scale }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(true);
  
  useFrame((_, delta) => {
    if (ref.current && visible) {
      ref.current.position.add(velocity.clone().multiplyScalar(delta));
      velocity.y -= 15 * delta; // Stronger Gravity
      ref.current.rotation.x += delta * 5;
      ref.current.rotation.z += delta * 5;
      
      // Shrink slowly
      ref.current.scale.multiplyScalar(0.99);

      if (ref.current.position.y < -6) {
        setVisible(false);
      }
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={ref} position={startPos} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const JuiceParticle: React.FC<{ startPos: THREE.Vector3, velocity: THREE.Vector3, color: string }> = ({ startPos, velocity, color }) => {
    const ref = useRef<THREE.Mesh>(null);
    const [visible, setVisible] = useState(true);
    const life = useRef(1.0);

    useFrame((_, delta) => {
        if (ref.current && visible) {
            ref.current.position.add(velocity.clone().multiplyScalar(delta));
            velocity.y -= 5 * delta; // Light gravity
            velocity.multiplyScalar(0.95); // Air resistance

            life.current -= delta * 1.5; // Fade out speed
            
            if (ref.current.material instanceof THREE.Material) {
                ref.current.material.opacity = life.current;
            }
            
            ref.current.scale.setScalar(life.current * 0.3);

            if (life.current <= 0) {
                setVisible(false);
            }
        }
    });

    if (!visible) return null;

    return (
        <mesh ref={ref} position={startPos}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={1} />
        </mesh>
    );
}

const Debris: React.FC<DebrisProps> = ({ position, skinColor, fleshColor }) => {
  // Memoize random values to prevent re-calculation on every render
  const debrisData = useMemo(() => {
    // Chunks
    const chunks = Array.from({ length: 6 }).map((_, i) => {
        const vx = (Math.random() - 0.5) * 10;
        const vy = (Math.random() * 8) + 2;
        const vz = (Math.random() - 0.5) * 10;
        const isSkin = i % 2 === 0;
        const s = 0.2 + Math.random() * 0.3;
        
        return {
            velocity: new THREE.Vector3(vx, vy, vz),
            color: isSkin ? skinColor : fleshColor,
            scale: new THREE.Vector3(s, s, s)
        };
    });

    // Juice Splash Particles
    const particles = Array.from({ length: 12 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const vz = (Math.random() - 0.5) * 5;

        return {
            velocity: new THREE.Vector3(vx, vy, vz),
            color: fleshColor
        };
    });

    return { chunks, particles };
  }, [skinColor, fleshColor]);

  return (
    <group>
        {debrisData.chunks.map((d, i) => (
            <DebrisPiece 
                key={`chunk-${i}`}
                startPos={position.clone()} 
                velocity={d.velocity.clone()} 
                color={d.color}
                scale={d.scale}
            />
        ))}
        {debrisData.particles.map((d, i) => (
            <JuiceParticle
                key={`part-${i}`}
                startPos={position.clone()}
                velocity={d.velocity.clone()}
                color={d.color}
            />
        ))}
    </group>
  );
};

export default Debris;