import { VOCAB_DUPLICATE_MAPPING, MIGRATION_COMPLETED_KEY, STORAGE_KEYS } from '../utils/constants';

/**
 * Migrates user learning data from duplicate vocabulary IDs to canonical IDs
 * Ensures user progress is preserved when duplicate entries are removed from vocabulary.json
 *
 * Priority for conflicting statuses: mastered > reviewing > learning
 *
 * @param {Object} wordStatus - Current wordStatus from localStorage
 * @returns {Object} Migrated wordStatus with canonical IDs
 */
export function migrateWordStatus(wordStatus) {
  if (!wordStatus || typeof wordStatus !== 'object') {
    return wordStatus;
  }

  const migrated = {};
  const statusPriority = {
    [MODES.MASTERED]: 3,
    [MODES.REVIEWING]: 2,
    [MODES.LEARNING]: 1
  };

  // Process each entry and map duplicate IDs to canonical IDs
  Object.entries(wordStatus).forEach(([id, status]) => {
    const canonicalId = VOCAB_DUPLICATE_MAPPING[id] || id;

    if (!migrated[canonicalId]) {
      // First occurrence or no duplicate - use as-is
      migrated[canonicalId] = status;
    } else {
      // Conflict exists - use higher priority status
      const currentPriority = statusPriority[status] || 0;
      const existingPriority = statusPriority[migrated[canonicalId]] || 0;

      if (currentPriority > existingPriority) {
        migrated[canonicalId] = status;
      }
      // If priorities are equal, keep existing (won't overwrite)
    }
  });

  return migrated;
}

/**
 * Checks if vocabulary migration has already been performed
 * Prevents re-running migration on subsequent app loads
 *
 * @returns {boolean} True if migration has been completed
 */
export function isMigrationCompleted() {
  try {
    return localStorage.getItem(MIGRATION_COMPLETED_KEY) === 'true';
  } catch (e) {
    console.error('Failed to check migration status:', e);
    return false;
  }
}

/**
 * Marks vocabulary migration as completed
 * Persists flag to localStorage
 */
export function markMigrationCompleted() {
  try {
    localStorage.setItem(MIGRATION_COMPLETED_KEY, 'true');
  } catch (e) {
    console.error('Failed to mark migration as completed:', e);
  }
}

/**
 * Performs one-time vocabulary migration for user learning data
 * Should be called when app initializes, before using wordStatus
 *
 * @param {Object} wordStatus - Current wordStatus from localStorage
 * @returns {Object} Migrated and cleaned wordStatus
 */
export function performMigrationIfNeeded(wordStatus) {
  if (isMigrationCompleted()) {
    return wordStatus; // Already migrated, return as-is
  }

  console.log('Performing vocabulary migration...');
  const migrated = migrateWordStatus(wordStatus);
  markMigrationCompleted();
  console.log('Vocabulary migration completed');

  return migrated;
}
