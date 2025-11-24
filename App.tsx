import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import GameScene from './components/GameScene';
import GameOver from './components/GameOver';
import { CHARACTERS } from './constants';
import { GameState, Character, CharacterId } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameState(GameState.PLAYING);
  };

  const handleScore = (points: number) => {
    setScore(s => s + points);
  };

  const handleMiss = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        // Defer state update slightly to avoid render loop issues or harsh cuts
        setTimeout(() => setGameState(GameState.GAME_OVER), 0);
        return 0;
      }
      return newLives;
    });
  };

  // Keyboard shortcut for quick restart if needed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameState === GameState.PLAYING) {
        setGameState(GameState.MENU);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900 select-none">
      
      {/* 3D Background / Game Layer */}
      <GameScene 
        gameState={gameState} 
        character={selectedCharacter}
        onScore={handleScore}
        onMiss={handleMiss}
      />

      {/* UI Layers */}
      
      {/* HUD (Only visible when playing) */}
      {gameState === GameState.PLAYING && (
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
          <div className="flex flex-col">
            <span className="text-white/60 text-sm font-bold tracking-widest uppercase">Score</span>
            <span className="text-5xl font-black text-white drop-shadow-md">{score}</span>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full border-2 border-white/50 transition-colors duration-300 ${i < lives ? 'bg-red-500' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Menu Layer */}
      {gameState === GameState.MENU && (
        <Menu 
          selectedCharacterId={selectedCharacter.id}
          onSelectCharacter={setSelectedCharacter}
          onStart={startGame}
        />
      )}

      {/* Game Over Layer */}
      {gameState === GameState.GAME_OVER && (
        <GameOver 
          score={score}
          character={selectedCharacter}
          onRestart={startGame}
          onHome={() => setGameState(GameState.MENU)}
        />
      )}
      
      {/* Simple attribution/version footer */}
      {gameState === GameState.MENU && (
        <div className="absolute bottom-4 right-6 text-white/20 text-xs z-20">
            Zen Melon v1.1 • Powered by React Three Fiber
        </div>
      )}
    </div>
  );
};

export default App;