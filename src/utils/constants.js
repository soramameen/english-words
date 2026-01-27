/**
 * Application Constants
 * Centralized configuration for modes, UI styling, keyboard controls, and storage keys
 */

/**
 * Learning modes for spaced repetition system
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

/**
 * Vocabulary duplicate ID mapping for data migration
 * Maps duplicate IDs to canonical IDs (keeps smaller ID as canonical)
 * Used to migrate user learning data when removing duplicate entries
 */
export const VOCAB_DUPLICATE_MAPPING = {
  431: 116,   // "absolute error" → 116
  434: 107,   // "approximation" → 107
  435: 120,   // "arithmetic operation" → 120
  439: 124,   // "binary representation" → 124
  450: 39,     // "decimal point" → 39
  451: 122,   // "decimal representation" → 122
  452: 56,     // "derivative" → 56
  453: 111,    // "digit" → 111
  458: 115,    // "error" → 115
  460: 25,     // "exponent" → 25
  461: 26,     // "exponential function" → 26
  470: 277,    // "identity" → 277
  471: 162,    // "implement" → 162
  478: 127,    // "mantissa" → 127
  483: 258,    // "normalization" → 258
  484: 386,    // "optimal" → 386
  487: 113,    // "overflow" → 113
  491: 52,     // "polynomial" → 52
  492: 82,     // "power" → 82
  510: 117,    // "relative error" → 117
  513: 19,     // "root" → 19
  515: 42,     // "sequence" → 42
  516: 13,     // "series" → 13
  517: 131,    // "sign" → 131
  519: 135,    // "significant digit" → 135
  522: 106,    // "store" → 106
  532: 136     // "value" → 136
};

/**
 * LocalStorage key for tracking migration completion
 * Prevents re-running migration on subsequent app loads
 */
export const MIGRATION_COMPLETED_KEY = 'vocabularyMigrationCompleted';
