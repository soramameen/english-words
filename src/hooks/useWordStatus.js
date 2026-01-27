import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { performMigrationIfNeeded } from '../utils/vocabularyMigration';

/**
 * Custom hook for managing word learning status state
 * Handles persistent storage of word status across app sessions
 * Maps each word ID to its current learning stage (learning, reviewing, or mastered)
 * Performs one-time migration of duplicate vocabulary IDs to canonical IDs
 *
 * @returns {Object} Object containing:
 *   - wordStatus: Object mapping word IDs to status strings ('learning', 'reviewing', 'mastered')
 *   - updateWordStatus: Function to update status for a specific word
 *
 * @example
 * const { wordStatus, updateWordStatus } = useWordStatus();
 *
 * // Get current status for a word
 * const status = wordStatus[wordId] || 'learning';
 *
 * // Update status for a word
 * updateWordStatus(wordId, 'reviewing');
 */
export function useWordStatus() {
  const [wordStatus, setWordStatus] = useLocalStorage(STORAGE_KEYS.WORD_STATUS, {});

  const migratedWordStatus = performMigrationIfNeeded(wordStatus);

  if (migratedWordStatus !== wordStatus) {
    setWordStatus(migratedWordStatus);
  }

  /**
   * Update status for a specific word
   *
   * @param {number} wordId - The ID of word to update
   * @param {string} newStatus - The new status value ('learning', 'reviewing', or 'mastered')
   */
  const updateWordStatus = (wordId, newStatus) => {
    setWordStatus(prev => ({
      ...prev,
      [wordId]: newStatus
    }));
  };

  return { wordStatus: migratedWordStatus, updateWordStatus };
}
