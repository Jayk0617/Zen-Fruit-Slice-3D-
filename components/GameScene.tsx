import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Blade from './Blade';
import Fruit from './Fruit';
import Debris from './Debris';
import { FruitData, Character, GameState, FruitType } from '../types';
import { SPAWN_RATE_MS, FRUIT_CONFIG } from '../constants';

interface GameSceneProps {
  gameState: GameState;
  character: Character;
  onScore: (points: number) => void;
  onMiss: () => void;
}

// Camera control component for Shake effects
const CameraRig = ({ shakeIntensity }: { shakeIntensity: React.MutableRefObject<number> }) => {
    useFrame((state) => {
        const shake = shakeIntensity.current;
        if (shake > 0) {
            const dx = (Math.random() - 0.5) * shake;
            const dy = (Math.random() - 0.5) * shake;
            // Base position is (0, 0, 8)
            state.camera.position.set(dx, dy, 8 + (Math.random() - 0.5) * shake);
            
            // Decay
            shakeIntensity.current = THREE.MathUtils.lerp(shake, 0, 0.1);
            if (shakeIntensity.current < 0.05) shakeIntensity.current = 0;
        } else {
            // Smoothly return to center if not shaking
            state.camera.position.lerp(new THREE.Vector3(0, 0, 8), 0.1);
        }
    });
    return null;
};

const GameScene: React.FC<GameSceneProps> = ({ gameState, character, onScore, onMiss }) => {
  const [fruits, setFruits] = useState<FruitData[]>([]);
  const [debrisList, setDebrisList] = useState<{ id: number, pos: THREE.Vector3, skinColor: string, fleshColor: string }[]>([]);
  const fruitIdCounter = useRef(0);
  const debrisIdCounter = useRef(0);
  const shakeIntensity = useRef(0);

  // Spawning Logic
  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
        setFruits([]);
        setDebrisList([]);
        shakeIntensity.current = 0;
        return;
    }

    const interval = setInterval(() => {
      fruitIdCounter.current += 1;
      
      const types: FruitType[] = ['melon', 'melon', 'apple', 'apple', 'orange', 'banana'];
      const type = types[Math.floor(Math.random() * types.length)];
      const config = FRUIT_CONFIG[type];

      let vyMin = 10;
      let vyVar = 4;
      let vxSpread = 2;

      if (type === 'banana') { 
        vyMin = 13; vyVar = 3; 
        vxSpread = 4;
      } else if (type === 'apple') {
        vyMin = 11; 
      }

      const newFruit: FruitData = {
        id: fruitIdCounter.current,
        x: (Math.random() - 0.5) * 5, 
        vx: (Math.random() - 0.5) * vxSpread, 
        vy: vyMin + Math.random() * vyVar, 
        scale: 0.8 + Math.random() * 0.4,
        rotationSpeed: 1 + Math.random() * 2,
        type: type,
        points: config.points
      };
      setFruits(prev => [...prev, newFruit]);
    }, SPAWN_RATE_MS);

    return () => clearInterval(interval);
  }, [gameState]);

  const handleSlice = (id: number, position: THREE.Vector3, points: number, type: FruitType) => {
    onScore(points);
    
    // Trigger Screen Shake
    shakeIntensity.current = 0.5;

    // Remove fruit
    setFruits(prev => prev.filter(f => f.id !== id));
    
    const config = FRUIT_CONFIG[type];

    // Add debris
    debrisIdCounter.current += 1;
    setDebrisList(prev => [
      ...prev, 
      { 
          id: debrisIdCounter.current, 
          pos: position, 
          skinColor: config.color,
          fleshColor: config.fleshColor
      }
    ]);
    
    // Cleanup debris after a few seconds
    setTimeout(() => {
      setDebrisList(prev => prev.slice(1));
    }, 2000);
  };

  const handleMiss = (id: number) => {
    setFruits(prev => {
        const exists = prev.find(f => f.id === id);
        if (exists) {
            onMiss();
            return prev.filter(f => f.id !== id);
        }
        return prev;
    });
  };

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <CameraRig shakeIntensity={shakeIntensity} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 15, 0]} angle={0.3} intensity={0.8} />
        <directionalLight position={[0, 10, 5]} intensity={0.5} />

        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="sunset" />

        {/* Game Objects */}
        {gameState === GameState.PLAYING && fruits.map(f => (
          <Fruit 
            key={f.id} 
            data={f} 
            onSlice={handleSlice} 
            onMiss={handleMiss}
          />
        ))}

        {/* Effects */}
        {debrisList.map(d => (
            <Debris 
              key={d.id} 
              position={d.pos} 
              skinColor={d.skinColor}
              fleshColor={d.fleshColor}
            />
        ))}

        {/* Input */}
        <Blade color={character.trailColor} />
      </Canvas>
    </div>
  );
};

export default GameScene;