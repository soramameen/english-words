import { useState, useCallback, useRef } from 'react';
import Flashcard from './components/Flashcard';
import TabButton from './components/TabButton';
import ProgressBar from './components/ProgressBar';
import ActionButtons from './components/ActionButtons';
import HelpModal from './components/modals/HelpModal';
import SettingsModal from './components/modals/SettingsModal';
import { BookOpen, Trophy, Settings, CircleHelp, Layers, Brain, GraduationCap } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWordStatus } from './hooks/useWordStatus';
import { useModeState } from './hooks/useModeState';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { KEYBOARD_KEYS, STORAGE_KEYS, MODES, MODE_UI_COLORS } from './utils/constants';
import vocabularyData from './data/vocabulary.json';

function App() {
  const { wordStatus, updateWordStatus } = useWordStatus();
  const { currentMode, setCurrentMode, indices, setIndices, activeWords, currentWord, counts, progress, safeIndex } = useModeState(vocabularyData, wordStatus);
  const [hasSeenHelp, setHasSeenHelp] = useLocalStorage(STORAGE_KEYS.HAS_SEEN_HELP, false);
  const [history, setHistory] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const timeoutRef = useRef(null);
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  const handleOpenHelp = () => {
    setIsHelpOpen(true);
    if (!hasSeenHelp) setHasSeenHelp(true);
  };
  const handleNext = useCallback(() => {
    clearTimers();
    if (activeWords.length > 0) {
      setHistory(prev => [...prev, { type: 'navigation', indices: { ...indices }, mode: currentMode }].slice(-10));
    }
    if (!showAnswer) {
      setShowAnswer(true);
      timeoutRef.current = setTimeout(() => {
        setShowAnswer(false);
        if (activeWords.length > 0) {
          timeoutRef.current = setTimeout(() => {
            setIndices(prev => ({ ...prev, [currentMode]: (safeIndex + 1) % activeWords.length }));
          }, 600);
        }
      }, 1000);
    } else {
      setShowAnswer(false);
      if (activeWords.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setIndices(prev => ({ ...prev, [currentMode]: (safeIndex + 1) % activeWords.length }));
        }, 300);
      }
    }
  }, [activeWords.length, indices, currentMode, safeIndex, showAnswer, clearTimers, setIndices]);
  const updateStatus = useCallback((newStatus) => {
    if (!currentWord) return;
    clearTimers();
    setShowAnswer(false);
    setHistory(prev => [...prev, { type: 'status', indices: { ...indices }, wordId: currentWord.id, previousStatus: wordStatus[currentWord.id] || 'learning', mode: currentMode }].slice(-10));
    timeoutRef.current = setTimeout(() => {
      updateWordStatus(currentWord.id, newStatus);
      if (activeWords.length <= 1 || safeIndex >= activeWords.length - 1) {
        setIndices(prev => ({ ...prev, [currentMode]: 0 }));
      }
    }, 300);
  }, [currentWord, activeWords.length, indices, currentMode, wordStatus, safeIndex, clearTimers, updateWordStatus, setIndices]);
  const handleUndo = useCallback(() => {
    clearTimers();
    if (history.length === 0) return;
    const lastAction = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setShowAnswer(false);
    if (lastAction.type === 'navigation') {
      setIndices(lastAction.indices);
      setCurrentMode(lastAction.mode);
    } else if (lastAction.type === 'status') {
      updateWordStatus(lastAction.wordId, lastAction.previousStatus);
      setIndices(lastAction.indices);
      setCurrentMode(lastAction.mode);
    }
  }, [history, clearTimers, setIndices, setCurrentMode, updateWordStatus]);
  const promote = useCallback(() => {
    if (currentMode === MODES.LEARNING) updateStatus(MODES.REVIEWING);
    else if (currentMode === MODES.REVIEWING) updateStatus(MODES.MASTERED);
    else handleNext();
  }, [currentMode, updateStatus, handleNext]);
  const demote = useCallback(() => {
    if (currentMode === MODES.MASTERED) updateStatus(MODES.REVIEWING);
    else if (currentMode === MODES.REVIEWING) updateStatus(MODES.LEARNING);
    else handleNext();
  }, [currentMode, updateStatus, handleNext]);
  const resetAllProgress = () => {
    if (window.confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
      updateWordStatus(null, {});
      setIndices({ learning: 0, reviewing: 0, mastered: 0 });
      setHistory([]);
      setCurrentMode(MODES.LEARNING);
      setIsSettingsOpen(false);
      setHasSeenHelp(false);
    }
  };
  useKeyboardShortcuts({
    [KEYBOARD_KEYS.FLIP_CARD]: () => setShowAnswer(!showAnswer),
    [KEYBOARD_KEYS.PROMOTE]: promote,
    [KEYBOARD_KEYS.DEMOTE]: demote,
    [KEYBOARD_KEYS.UNDO]: handleUndo
  }, activeWords.length > 0);
  return (
    <div className="h-[100dvh] w-full bg-gray-50 flex flex-col overflow-hidden font-sans text-gray-800">
      <header className="bg-white px-4 py-3 shadow-sm z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-indigo-600" size={24} />
          <h1 className="font-extrabold text-xl tracking-tight text-gray-800">EngVocab</h1>
        </div>
        <div className="flex space-x-1">
          <div className="relative">
            <button onClick={handleOpenHelp} className={`p-2 rounded-full transition relative z-10 ${!hasSeenHelp ? 'bg-indigo-100 text-indigo-600 animate-pulse' : 'hover:bg-gray-100 text-gray-500'}`}>
              <CircleHelp size={20} />
            </button>
            {!hasSeenHelp && !isHelpOpen && (
              <div className="absolute top-10 right-0 bg-indigo-600 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-lg whitespace-nowrap animate-bounce z-20">
                Click here first!<div className="absolute -top-1 right-3 w-2 h-2 bg-indigo-600 transform rotate-45"></div>
              </div>
            )}
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"><Settings size={20} /></button>
        </div>
      </header>
      <ProgressBar progress={progress} />
      <div className="flex bg-white border-b border-gray-100 shrink-0">
        <TabButton isActive={currentMode === MODES.LEARNING} onClick={() => { setCurrentMode(MODES.LEARNING); setShowAnswer(false); }} count={counts.learning} icon={Layers} label="Learning" color={MODE_UI_COLORS.learning} />
        <TabButton isActive={currentMode === MODES.REVIEWING} onClick={() => { setCurrentMode(MODES.REVIEWING); setShowAnswer(false); }} count={counts.reviewing} icon={Brain} label="Reviewing" color={MODE_UI_COLORS.reviewing} />
        <TabButton isActive={currentMode === MODES.MASTERED} onClick={() => { setCurrentMode(MODES.MASTERED); setShowAnswer(false); }} count={counts.mastered} icon={GraduationCap} label="Mastered" color={MODE_UI_COLORS.mastered} />
      </div>
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 bg-gray-50 overflow-y-auto">
        {activeWords.length > 0 ? (
          <>
            <div className="w-full max-w-md flex-1 flex flex-col justify-center min-h-[300px]">
              <Flashcard word={currentWord} showAnswer={showAnswer} onFlip={() => setShowAnswer(!showAnswer)} onUndo={handleUndo} canUndo={history.length > 0} />
            </div>
            <div className="text-gray-400 text-sm mt-6 font-mono font-medium tracking-wider">{safeIndex + 1} / {activeWords.length}</div>
          </>
        ) : (
          <div className="text-center p-8 max-w-xs mx-auto opacity-60">
            <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">No Words Here</h3>
            <p className="text-sm text-gray-500">{currentMode === MODES.LEARNING ? "You've reviewed everything!" : currentMode === MODES.REVIEWING ? "Mark words as 'Reviewing' to see them here." : "Keep studying to master more words!"}</p>
          </div>
        )}
      </main>
      <ActionButtons currentMode={currentMode} activeWordsCount={activeWords.length} onPromote={promote} onDemote={demote} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onResetProgress={resetAllProgress} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;
