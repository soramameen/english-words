import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Flashcard from './components/Flashcard';
import { Check, X, BookOpen, Trophy, Settings, RotateCcw, Brain, GraduationCap, Layers, CircleHelp, ArrowLeft } from 'lucide-react';
import vocabularyData from './data/vocabulary.json';

const TabButton = ({ isActive, onClick, count, icon, label, color }) => {
  const Icon = icon;
  // Explicit Tailwind classes for JIT compiler safety
  const activeClasses = {
    blue: 'border-blue-500 text-blue-600 bg-blue-50',
    yellow: 'border-yellow-500 text-yellow-600 bg-yellow-50',
    green: 'border-green-500 text-green-600 bg-green-50'
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 flex flex-col items-center justify-center transition-all border-b-2 ${
        isActive ? activeClasses[color] : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      <div className="flex items-center space-x-1">
        <Icon size={18} />
        <span className="text-xs font-bold uppercase">{label}</span>
      </div>
      <span className="text-xs font-mono mt-0.5">{count}</span>
    </button>
  );
};

function App() {
  // --- State Initialization ---
  
  const [wordStatus, setWordStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('wordStatus');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to parse wordStatus from localStorage', e);
      return {};
    }
  });

  const [currentMode, setCurrentMode] = useState('learning');

  const [indices, setIndices] = useState(() => {
    try {
      const saved = localStorage.getItem('modeIndices');
      return saved ? JSON.parse(saved) : { learning: 0, reviewing: 0, mastered: 0 };
    } catch (e) {
      console.error('Failed to parse modeIndices from localStorage', e);
      return { learning: 0, reviewing: 0, mastered: 0 };
    }
  });

  const [hasSeenHelp, setHasSeenHelp] = useState(() => {
    return localStorage.getItem('hasSeenHelp') === 'true';
  });

  const [history, setHistory] = useState([]); // Undo history

  const [showAnswer, setShowAnswer] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Use vocabularyData directly to avoid first-render flicker
  const [words] = useState(vocabularyData);

  // --- Persistence ---

  useEffect(() => {
    localStorage.setItem('wordStatus', JSON.stringify(wordStatus));
  }, [wordStatus]);

  useEffect(() => {
    localStorage.setItem('modeIndices', JSON.stringify(indices));
  }, [indices]);

  // --- Derived State (Memoized for performance) ---

  const activeWords = useMemo(() => {
    return words.filter(w => {
      const status = wordStatus[w.id] || 'learning';
      return status === currentMode;
    });
  }, [words, wordStatus, currentMode]);

  const counts = useMemo(() => {
    const res = { learning: 0, reviewing: 0, mastered: 0 };
    words.forEach(w => {
      const status = wordStatus[w.id] || 'learning';
      res[status]++;
    });
    return res;
  }, [words, wordStatus]);

  const progress = useMemo(() => {
    if (words.length === 0) return 0;
    return Math.round((counts.mastered / words.length) * 100);
  }, [counts.mastered, words.length]);

  const currentIndex = indices[currentMode] || 0;
  const safeIndex = activeWords.length > 0 ? currentIndex % activeWords.length : 0;
  const currentWord = activeWords[safeIndex];

  // --- Handlers ---

  const handleOpenHelp = () => {
    setIsHelpOpen(true);
    if (!hasSeenHelp) {
      setHasSeenHelp(true);
      localStorage.setItem('hasSeenHelp', 'true');
    }
  };

  const handleNext = useCallback(() => {
    setShowAnswer(false);

    if (activeWords.length > 0) {
      setHistory(prev => {
        const newHistory = [...prev, {
          type: 'navigation',
          indices: { ...indices },
          mode: currentMode
        }];
        return newHistory.slice(-10);
      });
    }

    if (activeWords.length > 0) {
      setTimeout(() => {
        const nextIndex = (safeIndex + 1) % activeWords.length;
        setIndices(prev => ({ ...prev, [currentMode]: nextIndex }));
      }, 300);
    }
  }, [activeWords.length, indices, currentMode, safeIndex]);

  const updateStatus = useCallback((newStatus) => {
    if (!currentWord) return;

    setShowAnswer(false);

    setHistory(prev => {
      const newHistory = [...prev, {
        type: 'status',
        indices: { ...indices },
        wordId: currentWord.id,
        previousStatus: wordStatus[currentWord.id] || 'learning',
        mode: currentMode
      }];
      return newHistory.slice(-10);
    });

    setTimeout(() => {
      setWordStatus(prev => ({
        ...prev,
        [currentWord.id]: newStatus
      }));

      if (activeWords.length <= 1 || safeIndex >= activeWords.length - 1) {
        setIndices(prev => ({ ...prev, [currentMode]: 0 }));
      }
    }, 300);
  }, [currentWord, activeWords.length, indices, currentMode, wordStatus, safeIndex]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setShowAnswer(false);

    if (lastAction.type === 'navigation') {
      setIndices(lastAction.indices);
      setCurrentMode(lastAction.mode);
    } else if (lastAction.type === 'status') {
      setWordStatus(prev => ({
        ...prev,
        [lastAction.wordId]: lastAction.previousStatus
      }));
      setIndices(lastAction.indices);
      setCurrentMode(lastAction.mode);
    }
  }, [history]);

  const promote = useCallback(() => {
    if (currentMode === 'learning') updateStatus('reviewing');
    else if (currentMode === 'reviewing') updateStatus('mastered');
    else handleNext();
  }, [currentMode, updateStatus, handleNext]);

  const demote = useCallback(() => {
    if (currentMode === 'mastered') updateStatus('reviewing');
    else if (currentMode === 'reviewing') updateStatus('learning');
    else handleNext();
  }, [currentMode, updateStatus, handleNext]);

  const resetAllProgress = () => {
    if (window.confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
      setWordStatus({});
      setIndices({ learning: 0, reviewing: 0, mastered: 0 });
      setHistory([]); // Clear history
      setCurrentMode('learning');
      setIsSettingsOpen(false);
      setHasSeenHelp(false);
      localStorage.removeItem('hasSeenHelp');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space' && activeWords.length > 0) {
        e.preventDefault();
        setShowAnswer(!showAnswer);
      }

      if (e.code === 'ArrowRight' && activeWords.length > 0) {
        e.preventDefault();
        promote();
      }

      if (e.code === 'ArrowLeft' && activeWords.length > 0) {
        e.preventDefault();
        demote();
      }

      if (e.code === 'Backspace' && history.length > 0) {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWords.length, showAnswer, promote, demote, handleUndo, history.length]);



  return (
    <div className="h-[100dvh] w-full bg-gray-50 flex flex-col overflow-hidden font-sans text-gray-800">
      
      <header className="bg-white px-4 py-3 shadow-sm z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-indigo-600" size={24} />
          <h1 className="font-extrabold text-xl tracking-tight text-gray-800">EngVocab</h1>
        </div>
        <div className="flex space-x-1">
          <div className="relative">
            <button 
              onClick={handleOpenHelp}
              className={`p-2 rounded-full transition relative z-10 ${!hasSeenHelp ? 'bg-indigo-100 text-indigo-600 animate-pulse' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <CircleHelp size={20} />
            </button>
            {!hasSeenHelp && !isHelpOpen && (
              <div className="absolute top-10 right-0 bg-indigo-600 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-lg whitespace-nowrap animate-bounce z-20">
                Click here first!
                <div className="absolute -top-1 right-3 w-2 h-2 bg-indigo-600 transform rotate-45"></div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="w-full bg-gray-200 h-1.5 shrink-0">
        <div 
          className="bg-green-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex bg-white border-b border-gray-100 shrink-0">
        <TabButton 
          isActive={currentMode === 'learning'} 
          onClick={() => { setCurrentMode('learning'); setShowAnswer(false); }} 
          count={counts.learning}
          icon={Layers} 
          label="Learning" 
          color="blue" 
        />
        <TabButton 
          isActive={currentMode === 'reviewing'} 
          onClick={() => { setCurrentMode('reviewing'); setShowAnswer(false); }} 
          count={counts.reviewing}
          icon={Brain} 
          label="Reviewing" 
          color="yellow" 
        />
        <TabButton 
          isActive={currentMode === 'mastered'} 
          onClick={() => { setCurrentMode('mastered'); setShowAnswer(false); }} 
          count={counts.mastered}
          icon={GraduationCap} 
          label="Mastered" 
          color="green" 
        />
      </div>

      <main className="flex-1 relative flex flex-col items-center justify-center p-4 bg-gray-50 overflow-y-auto">
        
        {activeWords.length > 0 ? (
          <>
            <div className="w-full max-w-md flex-1 flex flex-col justify-center min-h-[300px]">
              <Flashcard 
                word={currentWord} 
                showAnswer={showAnswer} 
                onFlip={() => setShowAnswer(!showAnswer)}
                onUndo={handleUndo}
                canUndo={history.length > 0} 
              />
            </div>
            <div className="text-gray-400 text-sm mt-6 font-mono font-medium tracking-wider">
              {safeIndex + 1} / {activeWords.length}
            </div>
          </>
        ) : (
          <div className="text-center p-8 max-w-xs mx-auto opacity-60">
            <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">No Words Here</h3>
            <p className="text-sm text-gray-500">
              {currentMode === 'learning' ? "You've reviewed everything!" : 
               currentMode === 'reviewing' ? "Mark words as 'Reviewing' to see them here." :
               "Keep studying to master more words!"}
            </p>
          </div>
        )}

      </main>

      <footer className="bg-white p-4 pb-safe border-t border-gray-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
          
          <button 
            onClick={demote}
            disabled={activeWords.length === 0}
            className={`relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              currentMode === 'learning' 
                ? 'bg-gray-50 border-gray-200 text-gray-400' 
                : 'bg-orange-50 border-orange-100 text-orange-600'
            }`}
          >
            <kbd className="absolute top-2 left-2 text-[10px] font-mono opacity-50 border border-current rounded px-1.5 py-0.5 hidden sm:block">
              ←
            </kbd>
            {currentMode === 'learning' ? <RotateCcw size={24} className="mb-1" /> : <X size={24} className="mb-1" />}
            <span className="text-xs font-bold uppercase tracking-wide">
              {currentMode === 'learning' ? 'Next / Skip' : 'Needs Work'}
            </span>
          </button>

          <button 
            onClick={promote}
            disabled={activeWords.length === 0}
            className={`relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              currentMode === 'mastered'
                ? 'bg-gray-50 border-gray-200 text-gray-400'
                : 'bg-indigo-50 border-indigo-100 text-indigo-600'
            }`}
          >
            <kbd className="absolute top-2 right-2 text-[10px] font-mono opacity-50 border border-current rounded px-1.5 py-0.5 hidden sm:block">
              →
            </kbd>
            {currentMode === 'mastered' ? <RotateCcw size={24} className="mb-1" /> : <Check size={24} className="mb-1" />}
            <span className="text-xs font-bold uppercase tracking-wide">
              {currentMode === 'mastered' ? 'Review Next' : 'Got it!'}
            </span>
          </button>

        </div>
      </footer>

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Settings className="mr-2" size={20} /> Settings
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Storage</h3>
                  <button 
                    onClick={resetAllProgress}
                    className="w-full py-3 px-4 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 transition flex items-center justify-center"
                  >
                    <RotateCcw size={18} className="mr-2" />
                    Reset All Progress
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    This will clear all mastered status and reset you to the beginning.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {isHelpOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsHelpOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">アプリの使い方</h2>
              
              <div className="space-y-6 text-sm text-gray-700">
                <div>
                  <h3 className="font-bold text-indigo-600 mb-2 text-base">3つの学習ステージ</h3>
                  <ul className="space-y-3 pl-2">
                    <li className="flex items-start">
                      <span className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0"></span>
                      <span>
                        <span className="font-bold text-blue-600 block">Learning (学習中)</span>
                        初めて見る単語や、まだ覚えていない単語です。
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 mt-1.5 mr-2 shrink-0"></span>
                      <span>
                        <span className="font-bold text-yellow-600 block">Reviewing (復習中)</span>
                        一度「覚えた」としたけれど、定着させるために復習している単語です。
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-3 h-3 rounded-full bg-green-500 mt-1.5 mr-2 shrink-0"></span>
                      <span>
                        <span className="font-bold text-green-600 block">Mastered (習得済み)</span>
                        完全にマスターした単語です。素晴らしい！
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-indigo-600 mb-2 text-base">進め方</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                      <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg mr-3 shrink-0">
                        <Check size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">Got it!</span>
                        <span className="text-gray-600 text-xs">次のステージへ進みます。<br/>(Learning → Reviewing → Mastered)</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                      <div className="bg-orange-100 text-orange-700 p-2 rounded-lg mr-3 shrink-0">
                        <X size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">Needs Work</span>
                        <span className="text-gray-600 text-xs">前のステージに戻します。<br/>(Mastered → Reviewing → Learning)</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                      <div className="bg-gray-200 text-gray-600 p-2 rounded-lg mr-3 shrink-0">
                        <RotateCcw size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">Next / Skip</span>
                        <span className="text-gray-600 text-xs">ステータスを変えずに、次の単語へ進みます。</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                      <div className="bg-gray-200 text-gray-600 p-2 rounded-lg mr-3 shrink-0">
                        <ArrowLeft size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">1つ戻る (Undo)</span>
                        <span className="text-gray-600 text-xs">カード左上の矢印ボタンで、直前の操作を取り消せます。</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-indigo-600 mb-2 text-base">キーボードショートカット</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 flex items-center justify-between">
                      <span className="text-gray-600">カードをめくる</span>
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-gray-700">Space</kbd>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 flex items-center justify-between">
                      <span className="text-gray-600">Got it!</span>
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-gray-700">→</kbd>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 flex items-center justify-between">
                      <span className="text-gray-600">Next / Skip</span>
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-gray-700">←</kbd>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 flex items-center justify-between">
                      <span className="text-gray-600">1つ戻る</span>
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-gray-700 text-xs">Backspace</kbd>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-center">
                  <p className="text-xs text-indigo-800 font-medium">
                    💡 学習データは自動的に保存されます。<br/>いつでも好きな時に中断・再開できます。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition shadow-sm"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
