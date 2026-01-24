import React from 'react';
import { RotateCcw, ArrowLeft } from 'lucide-react';

export default function Flashcard({ word, showAnswer, onFlip, onUndo, canUndo }) {
  if (!word) return null;

  return (
    <div 
      className="w-full aspect-[4/3] perspective-1000 cursor-pointer mx-auto relative group"
      onClick={onFlip}
    >
      <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${showAnswer ? 'rotate-y-180' : ''}`}>
        
        {/* Front Side (English) */}
        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center backface-hidden border border-gray-100 p-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUndo();
            }}
            disabled={!canUndo}
            className={`absolute top-4 left-4 p-2 rounded-full transition-all z-20 ${
              canUndo 
                ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100' 
                : 'text-gray-200 cursor-not-allowed'
            }`}
            aria-label="Undo"
          >
            <ArrowLeft size={20} />
          </button>

          <span className="text-xs font-bold tracking-wider text-gray-400 absolute top-6 right-6">ENGLISH</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center leading-tight break-words max-w-full">
            {word.en}
          </h2>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
             <kbd className="text-[10px] font-mono text-gray-400 border border-gray-200 rounded px-2 py-1 bg-gray-50">Space</kbd>
          </div>
          <div className="absolute bottom-6 right-6 text-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity">
            <RotateCcw size={24} />
          </div>
        </div>

        {/* Back Side (Japanese) */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl flex flex-col items-center justify-center backface-hidden rotate-y-180 border-2 border-indigo-100 p-6">
          <span className="text-xs font-bold tracking-wider text-indigo-400 absolute top-6 left-6">JAPANESE</span>
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center leading-relaxed break-words max-w-full">
            {word.ja}
          </h2>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
             <kbd className="text-[10px] font-mono text-indigo-300 border border-indigo-200 rounded px-2 py-1 bg-white/50">Space</kbd>
          </div>
        </div>

      </div>
    </div>
  );
}
