import React from 'react';
import { CHARACTERS } from '../constants';
import { Character, CharacterId } from '../types';

interface MenuProps {
  onSelectCharacter: (char: Character) => void;
  selectedCharacterId: CharacterId;
  onStart: () => void;
}

const Menu: React.FC<MenuProps> = ({ onSelectCharacter, selectedCharacterId, onStart }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 bg-black/60 backdrop-blur-sm">
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-8 drop-shadow-lg tracking-wider text-center">
        ZEN MELON
      </h1>
      
      <p className="text-gray-300 mb-8 text-xl font-light">Choose your Element, Master.</p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-6xl w-full mb-12">
        {CHARACTERS.map((char) => (
          <button
            key={char.id}
            onClick={() => onSelectCharacter(char)}
            className={`
              relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform group
              ${selectedCharacterId === char.id 
                ? 'ring-4 ring-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.5)]' 
                : 'hover:scale-105 opacity-80 hover:opacity-100'}
              bg-gradient-to-br ${char.color}
            `}
          >
            <div className="relative z-10 flex flex-col items-center text-white h-full justify-between">
              <div className="text-4xl mb-4 opacity-90 group-hover:rotate-12 transition-transform">
                {/* Icons based on character ID - using emojis for simplicity in this demo */}
                {char.id === 'FIRE' && '🔥'}
                {char.id === 'WATER' && '🌊'}
                {char.id === 'WIND' && '🍃'}
                {char.id === 'EARTH' && '⛰️'}
                {char.id === 'LIGHTNING' && '⚡'}
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-1">{char.name}</h3>
                <p className="text-xs opacity-90 leading-tight">{char.description}</p>
              </div>
            </div>
            
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
          </button>
        ))}
      </div>

      <button
        onClick={onStart}
        className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-2xl rounded-full shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-1 transition-all active:scale-95 tracking-widest"
      >
        START JOURNEY
      </button>
    </div>
  );
};

export default Menu;
