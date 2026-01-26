import { Check, X, RotateCcw } from 'lucide-react';
import { MODES } from '../utils/constants.js';

/**
 * ActionButtons Component
 * Footer buttons for promoting and demoting flashcards
 * 
 * @param {Object} props
 * @param {string} props.currentMode - Current learning mode ('learning', 'reviewing', 'mastered')
 * @param {number} props.activeWordsCount - Number of active words (used for disabled state)
 * @param {Function} props.onPromote - Callback when promote button is clicked
 * @param {Function} props.onDemote - Callback when demote button is clicked
 * @returns {JSX.Element}
 */
export default function ActionButtons({
  currentMode,
  activeWordsCount,
  onPromote,
  onDemote
}) {
  const isDisabled = activeWordsCount === 0;

  return (
    <footer className="bg-white p-4 pb-safe border-t border-gray-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
        
        <button 
          onClick={onDemote}
          disabled={isDisabled}
          className={`relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentMode === MODES.LEARNING
              ? 'bg-gray-50 border-gray-200 text-gray-400' 
              : 'bg-orange-50 border-orange-100 text-orange-600'
          }`}
        >
          <kbd className="absolute top-2 left-2 text-[10px] font-mono opacity-50 border border-current rounded px-1.5 py-0.5 hidden sm:block">
            ←
          </kbd>
          {currentMode === MODES.LEARNING ? (
            <RotateCcw size={24} className="mb-1" />
          ) : (
            <X size={24} className="mb-1" />
          )}
          <span className="text-xs font-bold uppercase tracking-wide">
            {currentMode === MODES.LEARNING ? 'Next / Skip' : 'Needs Work'}
          </span>
        </button>

        <button 
          onClick={onPromote}
          disabled={isDisabled}
          className={`relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentMode === MODES.MASTERED
              ? 'bg-gray-50 border-gray-200 text-gray-400'
              : 'bg-indigo-50 border-indigo-100 text-indigo-600'
          }`}
        >
          <kbd className="absolute top-2 right-2 text-[10px] font-mono opacity-50 border border-current rounded px-1.5 py-0.5 hidden sm:block">
            →
          </kbd>
          {currentMode === MODES.MASTERED ? (
            <RotateCcw size={24} className="mb-1" />
          ) : (
            <Check size={24} className="mb-1" />
          )}
          <span className="text-xs font-bold uppercase tracking-wide">
            {currentMode === MODES.MASTERED ? 'Review Next' : 'Got it!'}
          </span>
        </button>

      </div>
    </footer>
  );
}
