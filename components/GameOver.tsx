import React, { useEffect, useState } from 'react';
import { Character } from '../types';
import { generateSenseiWisdom } from '../services/geminiService';

interface GameOverProps {
  score: number;
  character: Character;
  onRestart: () => void;
  onHome: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, character, onRestart, onHome }) => {
  const [wisdom, setWisdom] = useState<string>('Consulting the spirits...');

  useEffect(() => {
    let mounted = true;
    generateSenseiWisdom(score, character).then((text) => {
      if (mounted) setWisdom(text);
    });
    return () => { mounted = false; };
  }, [score, character]);

  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-screen bg-black/80 backdrop-blur-md p-8 text-center animate-fade-in">
      <h2 className="text-5xl font-bold text-white mb-4">Meditation Complete</h2>
      
      <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-lg border border-white/20 mb-8 max-w-md w-full">
        <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Final Score</p>
        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-orange-500">
          {score}
        </div>
      </div>

      <div className="max-w-xl mb-12">
        <h3 className="text-emerald-400 font-bold mb-2">Sensei's Wisdom</h3>
        <p className="text-xl text-white italic font-serif leading-relaxed">
          "{wisdom}"
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onHome}
          className="px-8 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          Character Select
        </button>
        <button
          onClick={onRestart}
          className="px-8 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shadow-lg hover:shadow-emerald-500/30"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;
