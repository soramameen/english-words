import { useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, DEFAULT_INDICES, MODES } from '../utils/constants';

/**
 * Custom hook managing learning mode state and derived calculations.
 * 
 * Manages:
 * - Current learning mode (learning, reviewing, or mastered)
 * - Per-mode word indices for carousel navigation
 * - Derived state: active words in current mode, counts per mode, overall progress
 * 
 * @param {Array} words - Array of word objects to filter by mode
 * @param {Object} wordStatus - Map of word ID to status ('learning', 'reviewing', 'mastered')
 * 
 * @returns {Object} Hook state object containing:
 *   - currentMode {string} - Current learning mode ('learning', 'reviewing', 'mastered')
 *   - setCurrentMode {Function} - Update current mode
 *   - indices {Object} - Per-mode carousel indices { learning: 0, reviewing: 0, mastered: 0 }
 *   - setIndices {Function} - Update indices object
 *   - activeWords {Array} - Words filtered by currentMode (memoized)
 *   - currentWord {Object|undefined} - Current word in carousel (from activeWords[safeIndex])
 *   - counts {Object} - Word count by status { learning: N, reviewing: N, mastered: N } (memoized)
 *   - progress {number} - Mastery progress 0-100 (memoized)
 *   - safeIndex {number} - Safe carousel index (bounds-checked)
 * 
 * @example
 * const {
 *   currentMode,
 *   setCurrentMode,
 *   indices,
 *   setIndices,
 *   activeWords,
 *   currentWord,
 *   counts,
 *   progress,
 *   safeIndex
 * } = useModeState(words, wordStatus);
 */
export function useModeState(words, wordStatus) {
  // Current learning mode (learning, reviewing, mastered)
  const [currentMode, setCurrentMode] = useState(MODES.LEARNING);

  // Per-mode carousel indices - persisted to localStorage
  const [indices, setIndices] = useLocalStorage(STORAGE_KEYS.MODE_INDICES, DEFAULT_INDICES);

  // --- Derived State (Memoized for performance) ---

  /**
   * Words filtered by current mode
   * Re-calculated only when words, wordStatus, or currentMode changes
   */
  const activeWords = useMemo(() => {
    return words.filter(w => {
      const status = wordStatus[w.id] || 'learning';
      return status === currentMode;
    });
  }, [words, wordStatus, currentMode]);

  /**
   * Count of words in each learning stage
   * Used for progress tracking and UI display
   */
  const counts = useMemo(() => {
    const res = { learning: 0, reviewing: 0, mastered: 0 };
    words.forEach(w => {
      const status = wordStatus[w.id] || 'learning';
      res[status]++;
    });
    return res;
  }, [words, wordStatus]);

  /**
   * Overall mastery progress (0-100)
   * Calculated as: (mastered words / total words) * 100
   */
  const progress = useMemo(() => {
    if (words.length === 0) return 0;
    return Math.round((counts.mastered / words.length) * 100);
  }, [counts.mastered, words.length]);

  /**
   * Safe carousel index that respects activeWords bounds
   * Uses modulo operator to wrap around on overflow
   */
  const currentIndex = indices[currentMode] || 0;
  const safeIndex = activeWords.length > 0 ? currentIndex % activeWords.length : 0;

  /**
   * Current word being displayed in carousel
   * Undefined when no words in current mode
   */
  const currentWord = activeWords[safeIndex];

  return {
    currentMode,
    setCurrentMode,
    indices,
    setIndices,
    activeWords,
    currentWord,
    counts,
    progress,
    safeIndex
  };
}
