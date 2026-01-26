import { Check, X, RotateCcw, ArrowRight } from 'lucide-react';
import { MODES } from '../utils/constants.js';

export default function ActionButtons({
  currentMode,
  activeWordsCount,
  onPromote,
  onDemote,
  onNext
}) {
  const isDisabled = activeWordsCount === 0;

  // Reviewingモードの時だけ3列、それ以外は2列
  // ボタンのサイズを均等にするためにサイズを調整
  const gridConfig = currentMode === MODES.REVIEWING ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <footer className="bg-white p-4 pb-safe border-t border-gray-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className={`max-w-md mx-auto grid ${gridConfig} gap-3`}>

        <button 
          onClick={onDemote}
          disabled={isDisabled}
          className={`relative flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all active:scale-95 disabled:opacity-50 ${
            currentMode === MODES.LEARNING
              ? 'bg-gray-50 border-gray-200 text-gray-400' 
              : 'bg-orange-50 border-orange-100 text-orange-600'
          }`}
        >
          <X size={20} className="mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-tight text-center">
            Needs Work
          </span>
        </button>

        {/* 中央: Keep in Review (Next) - Reviewingモード時のみ表示 */}
        {currentMode === MODES.REVIEWING && (
          <button
            onClick={onNext}
            disabled={isDisabled}
            className="flex flex-col items-center justify-center py-3 rounded-xl border-2 border-gray-100 bg-white text-gray-500 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
          >
            <ArrowRight size={20} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight">
              Keep in<br/>Review
            </span>
          </button>
        )}

        <button 
          onClick={onPromote}
          disabled={isDisabled}
          className={`relative flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all active:scale-95 disabled:opacity-50 ${
            currentMode === MODES.MASTERED
              ? 'bg-gray-50 border-gray-200 text-gray-400'
              : 'bg-indigo-50 border-indigo-100 text-indigo-600'
          }`}
        >
          {currentMode === MODES.MASTERED ? <RotateCcw size={20} className="mb-1" /> : <Check size={20} className="mb-1" />}
          <span className="text-[10px] font-bold uppercase tracking-tight text-center">
            {currentMode === MODES.MASTERED ? 'Review Next' : 'Got it!'}
          </span>
        </button>

      </div>
    </footer>
  );
}