/**
 * Application Constants
 * Centralized configuration for modes, UI styling, keyboard controls, and storage keys
 */

/**
 * Learning modes for the spaced repetition system
 * Three-stage progression: learning → reviewing → mastered
 */
export const MODES = {
  LEARNING: 'learning',
  REVIEWING: 'reviewing',
  MASTERED: 'mastered'
};

/**
 * Tailwind color classes for TabButton active states
 * Maps mode to CSS classes for JIT compiler safety
 */
export const MODE_COLORS = {
  blue: 'border-blue-500 text-blue-600 bg-blue-50',
  yellow: 'border-yellow-500 text-yellow-600 bg-yellow-50',
  green: 'border-green-500 text-green-600 bg-green-50'
};

/**
 * Color mapping for UI tabs by mode
 * Associates each learning mode with its UI color
 */
export const MODE_UI_COLORS = {
  learning: 'blue',
  reviewing: 'yellow',
  mastered: 'green'
};

/**
 * Keyboard event codes for flashcard interactions
 * Maps keyboard input to user actions
 */
export const KEYBOARD_KEYS = {
  FLIP_CARD: 'Space',
  PROMOTE: 'ArrowRight',
  DEMOTE: 'ArrowLeft',
  UNDO: 'Backspace'
};

/**
 * LocalStorage keys for persistent data
 * Must remain unchanged for backward compatibility with existing user data
 */
export const STORAGE_KEYS = {
  WORD_STATUS: 'wordStatus',
  MODE_INDICES: 'modeIndices',
  HAS_SEEN_HELP: 'hasSeenHelp'
};

/**
 * Icon names for each mode
 * Lucide-react icon identifiers (for future use in configuration)
 */
export const MODE_ICONS = {
  learning: 'Layers',
  reviewing: 'Brain',
  mastered: 'GraduationCap'
};

/**
 * Default initial state for mode indices
 * Used when localStorage has no previous data
 */
export const DEFAULT_INDICES = {
  learning: 0,
  reviewing: 0,
  mastered: 0
};
