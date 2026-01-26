import { useEffect } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 *
 * @param {Object} keyMap - Maps key codes to callback functions
 *   Example: { 'Space': () => flipCard(), 'ArrowRight': () => promote() }
 * @param {boolean} [enabled=true] - Whether the listener should be active
 *
 * @example
 * useKeyboardShortcuts({
 *   'Space': handleFlip,
 *   'ArrowRight': handlePromote,
 *   'ArrowLeft': handleDemote,
 *   'Backspace': handleUndo
 * }, activeWords.length > 0);
 */
export function useKeyboardShortcuts(keyMap, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (e) => {
      // Ignore events from input/textarea elements
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Check if this key is mapped
      if (e.code in keyMap) {
        e.preventDefault();
        keyMap[e.code]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyMap, enabled]);
}
