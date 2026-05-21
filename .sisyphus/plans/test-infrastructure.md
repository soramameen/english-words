# Test Infrastructure Setup Plan

## Context

### Original Request
Add test infrastructure and essential tests to React 19 + Vite flashcard learning app.

### Interview Summary
**Key Discussions:**
- **Coverage Level**: Minimal (basic protection for essential features only)
- **Test Types**: Unit, Component, Integration tests (no E2E)
- **Development Approach**: Tests after implementation (not TDD)
- **Technology Stack**: Vitest + React Testing Library + @testing-library/user-event

**Research Findings:**
- **Vitest**: Native to Vite, fast execution, better than Jest for Vite projects
- **React Testing Library**: User-centric testing approach
- **localStorage Mocking**: Use `vi.stubGlobal('localStorage')` or `vi.spyOn(Storage.prototype)`
- **Keyboard Testing**: Use `userEvent.keyboard()` with special characters ('{Space}', '{ArrowRight}', etc.)

### Metis Review
**Identified Gaps (addressed in plan):**

| Gap | Resolution |
|------|-----------|
| **localStorage mocking strategy** | Use `vi.stubGlobal('localStorage')` in setup file |
| **Keyboard event testing approach** | Use `userEvent.keyboard()` for realistic interaction testing |
| **Component isolation vs real hooks** | Tests use real hooks, not mocked implementations |
| **Integration test boundaries** | Test mode + status flow with actual localStorage persistence |
| **Test data strategy** | Create minimal fixture (3-5 words) for deterministic tests |
| **Error boundary behavior** | Tests include JSON parse error handling in useLocalStorage |

**Guardrails Applied:**
- DO NOT test CSS/styling (visual animations excluded)
- DO NOT add snapshot tests (maintenance burden)
- DO NOT test derived values exhaustively (progress formula tested once)
- LIMIT assertions to 3-5 per test (prevent AI slop)
- NO coverage thresholds in config (user explicitly excluded)
- DO NOT mock React internals (useState, useEffect)

---

## Work Objectives

### Core Objective
Add test infrastructure and write essential tests for hooks and components to provide basic protection against regressions.

### Concrete Deliverables
- Test configuration files (`vitest.config.js`, `vitest.setup.js`)
- Updated `package.json` with test scripts
- 3 hook test files (useLocalStorage, useWordStatus, useKeyboardShortcuts)
- 4 component test files (Flashcard, ActionButtons, HelpModal, SettingsModal)
- 1 integration test file (mode + status persistence flow)
- Test data fixture (minimal vocabulary subset)

### Definition of Done
- [ ] All tests pass (`npm test`)
- [ ] Tests run in watch mode without errors
- [ ] localStorage mocking works correctly
- [ ] No CSS/styling assertions
- [ ] No snapshot tests
- [ ] Each test has 3-5 assertions max

### Must Have
- Vitest + React Testing Library installed and configured
- localStorage mocked globally in setup
- Keyboard shortcuts testable
- Hook tests verify persistence
- Component tests verify user interactions

### Must NOT Have (Guardrails)
- **NO snapshot tests** (maintenance burden, minimal scope)
- **NO CSS/styling tests** (visual behavior, not logic)
- **NO tests for ProgressBar or TabButton** (simple presentational components)
- **NO tests for useModeState hook** (covered indirectly by integration)
- **NO E2E tests** (not in scope)
- **NO coverage thresholds** (explicitly excluded)
- **NO test utilities "for future use"** (only create if needed now)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Unit + Component + Integration (tests after implementation)
- **Framework**: Vitest + React Testing Library
- **Coverage approach**: Manual verification per test (no automated coverage reporting)

### Manual Verification Approach

**For Hook Tests:**
- [ ] Hook renders with correct initial state
- [ ] Hook updates state correctly on action
- [ ] localStorage is called with correct parameters
- [ ] Error handling works (JSON parse failures)

**For Component Tests:**
- [ ] Component renders with given props
- [ ] User interaction triggers correct callbacks
- [ ] Conditional rendering works (modal open/close, button visibility)
- [ ] Disabled state respected

**For Integration Tests:**
- [ ] Action updates localStorage
- [ ] State changes persist across hook re-renders
- [ ] Mode change filters words correctly
- [ ] Index persistence works

---

## Task Flow

```
Task 1 (Config) → Task 2 (Setup) → Task 3 (Hooks: useLocalStorage)
                              → Task 4 (Hooks: useWordStatus)
                              → Task 5 (Hooks: useKeyboardShortcuts)
                              → Task 6 (Components: Flashcard)
                              → Task 7 (Components: ActionButtons)
                              → Task 8 (Components: HelpModal)
                              → Task 9 (Components: SettingsModal)
                              → Task 10 (Integration: Mode+Status)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 3, 4, 5 (Hook tests) | Independent hook implementations |
| B | 6, 7, 8, 9 (Component tests) | Independent component implementations |

| Task | Depends On | Reason |
|------|------------|--------|
| 2 | 1 | Setup depends on config |
| 3-5 | 2 | Hook tests depend on localStorage mocking in setup |
| 6-9 | 2 | Component tests depend on setup |
| 10 | 3, 4 | Integration test builds on hook logic |

---

## TODOs

### Infrastructure Setup

- [ ] 1. Install testing dependencies
  **What to do**:
  - Install: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`
  - Command: `npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`

  **Parallelizable**: NO

  **References**:
  - External: Vitest Installation - https://vitest.dev/guide/
  - External: React Testing Library Setup - https://testing-library.com/docs/react-testing-library/intro

  **Acceptance Criteria**:
  - [ ] All dependencies added to `package.json` devDependencies
  - [ ] `npm list` shows installed versions

- [ ] 2. Create vitest.config.js
  **What to do**:
  - Create `vitest.config.js` in project root
  - Configure: globals: true, environment: 'jsdom', include pattern for test files, setupFiles: ['./vitest.setup.js']

  **Parallelizable**: NO

  **References**:
  - External: Vitest Configuration - https://vitest.dev/config/
  - Existing: `vite.config.js` - Use as reference for project structure

  **Acceptance Criteria**:
  - [ ] File created at `/vitest.config.js`
  - [ ] Config includes: globals, environment: 'jsdom', setupFiles
  - [ ] No console errors when running `vitest --help`

- [ ] 3. Create vitest.setup.js (global test setup)
  **What to do**:
  - Import '@testing-library/jest-dom/vitest'
  - Import cleanup from '@testing-library/react'
  - Import afterEach from 'vitest'
  - Call cleanup() in afterEach hook

  **Parallelizable**: NO

  **References**:
  - External: React Testing Library Cleanup - https://testing-library.com/docs/react-testing-library/setup#cleanup
  - External: Vitest Setup Files - https://vitest.dev/config/setupfiles

  **Acceptance Criteria**:
  - [ ] File created at `/vitest.setup.js`
  - [ ] afterEach cleanup configured
  - [ ] jest-dom matchers available globally

- [ ] 4. Mock localStorage globally
  **What to do**:
  - In `vitest.setup.js`, add `vi.stubGlobal('localStorage', {})`
  - This provides a mock localStorage object for all tests

  **Parallelizable**: NO

  **References**:
  - External: Vitest Global Mocking - https://vitest.dev/api/vi#stubglobal
  - Existing: `src/hooks/useLocalStorage.js` - Shows localStorage usage patterns

  **Acceptance Criteria**:
  - [ ] `vi.stubGlobal('localStorage', {})` in setup file
  - [ ] localStorage is available in all tests without errors

- [ ] 5. Add test scripts to package.json
  **What to do**:
  - Add "test": "vitest"
  - Add "test:run": "vitest run"
  - Remove/add scripts as needed

  **Parallelizable**: NO

  **References**:
  - Existing: `package.json` - Current scripts section

  **Acceptance Criteria**:
  - [ ] `test` script runs `vitest`
  - [ ] `test:run` script runs `vitest run`
  - [ ] `npm run test` starts watch mode

### Hook Tests

- [ ] 6. Test useLocalStorage hook
  **What to do**:
  - Create `src/hooks/useLocalStorage.test.js`
  - Test 1: Returns initial value from localStorage (if key exists)
  - Test 2: Returns initialValue when key is missing
  - Test 3: Saves to localStorage on setValue call
  - Test 4: Handles JSON parse errors gracefully (fallback to initialValue)

  **Must NOT do**:
  - Test React internals (useState, useEffect behavior)
  - Test CSS or visual behavior

  **Parallelizable**: YES (with 4, 5)

  **References**:
  - Pattern: `src/hooks/useLocalStorage.js` - The hook implementation
  - External: Testing React Hooks - https://testing-library.com/docs/react-testing-library/api#renderhook

  **Acceptance Criteria**:
  - [ ] Test file created at `src/hooks/useLocalStorage.test.js`
  - [ ] Test reads from localStorage correctly
  - [ ] Test falls back to initialValue when key missing
  - [ ] Test handles JSON parse errors
  - [ ] `npm test useLocalStorage` → All tests pass

- [ ] 7. Test useWordStatus hook
  **What to do**:
  - Create `src/hooks/useWordStatus.test.js`
  - Test 1: Returns empty object {} initially
  - Test 2: Updates status for a single word (e.g., wordId: 46, status: 'reviewing')
  - Test 3: Multiple word status updates merge correctly
  - Test 4: Calls setWordStatus updates localStorage

  **Must NOT do**:
  - Test internal localStorage logic (covered by useLocalStorage tests)

  **Parallelizable**: YES (with 3, 5)

  **References**:
  - Pattern: `src/hooks/useWordStatus.js` - Thin wrapper over useLocalStorage
  - Test Data: Create minimal fixture: `[{id: 46, en: 'test', ja: 'テスト', category: 'General'}]`

  **Acceptance Criteria**:
  - [ ] Test file created at `src/hooks/useWordStatus.test.js`
  - [ ] Initial state is empty object
  - [ ] Word status updates correctly
  - [ ] `npm test useWordStatus` → All tests pass

- [ ] 8. Test useKeyboardShortcuts hook
  **What to do**:
  - Create `src/hooks/useKeyboardShortcuts.test.js`
  - Test 1: Calls callback when matching key is pressed (e.g., 'Space')
  - Test 2: Does NOT call callback when enabled=false
  - Test 3: Does NOT call callback when focus is in input or textarea element
  - Test 4: Cleans up event listener on unmount

  **Must NOT do**:
  - Test all possible key combinations (only test key mappings in useKeyboardShortcuts)

  **Parallelizable**: YES (with 3, 4)

  **References**:
  - Pattern: `src/hooks/useKeyboardShortcuts.js` - Event listener setup
  - External: userEvent.keyboard API - https://testing-library.com/docs/user-event/user-event-api#keyboardevent
  - Existing: `src/utils/constants.js` - KEYBOARD_KEYS constants

  **Acceptance Criteria**:
  - [ ] Test file created at `src/hooks/useKeyboardShortcuts.test.js`
  - [ ] Callback triggers on matching key
  - [ ] Callback does NOT trigger when disabled
  - [ ] Input/textarea focus prevents callback
  - [ ] Cleanup removes event listener
  - [ ] `npm test useKeyboardShortcuts` → All tests pass

### Component Tests

- [ ] 9. Test Flashcard component
  **What to do**:
  - Create `src/components/Flashcard.test.jsx`
  - Test 1: Renders word.en on front side (English)
  - Test 2: Renders word.ja on back side when showAnswer=true
  - Test 3: Calls onFlip when card is clicked
  - Test 4: Undo button exists when canUndo=true
  - Test 5: Undo button disabled when canUndo=false

  **Must NOT do**:
  - Test CSS animation (flip effect)
  - Test styling classes or layout

  **Parallelizable**: YES (with 10, 11)

  **References**:
  - Pattern: `src/components/Flashcard.jsx` - Component implementation
  - External: React Testing Library Render - https://testing-library.com/docs/react-testing-library/api#render
  - External: userEvent.click - https://testing-library.com/docs/user-event/user-event-api#click

  **Acceptance Criteria**:
  - [ ] Test file created at `src/components/Flashcard.test.jsx`
  - [ ] Renders English word correctly
  - [ ] Renders Japanese word when flipped
  - [ ] Click triggers onFlip
  - [ ] Undo button respects canUndo prop
  - [ ] `npm test Flashcard` → All tests pass

- [ ] 10. Test ActionButtons component
  **What to do**:
  - Create `src/components/ActionButtons.test.jsx`
  - Test 1: Shows 2 buttons in LEARNING mode
  - Test 2: Shows 3 buttons in REVIEWING mode
  - Test 3: Shows 2 buttons in MASTERED mode
  - Test 4: All buttons disabled when activeWordsCount=0
  - Test 5: Clicking Promote button calls onPromote handler

  **Must NOT do**:
  - Test internal mode state logic (covered by integration)

  **Parallelizable**: YES (with 9, 11)

  **References**:
  - Pattern: `src/components/ActionButtons.jsx` - Mode-dependent button rendering
  - External: userEvent.click - https://testing-library.com/docs/user-event/user-event-api#click
  - Existing: `src/utils/constants.js` - MODES constants

  **Acceptance Criteria**:
  - [ ] Test file created at `src/components/ActionButtons.test.jsx`
  - [ ] Correct button count per mode
  - [ ] Disabled state respected
  - [ ] Callbacks fire correctly
  - [ ] `npm test ActionButtons` → All tests pass

- [ ] 11. Test HelpModal component
  **What to do**:
  - Create `src/components/modals/HelpModal.test.jsx`
  - Test 1: Renders when isOpen=true
  - Test 2: Does NOT render when isOpen=false
  - Test 3: Calls onClose when close button clicked
  - Test 4: Calls onClose when overlay (outside modal) clicked

  **Must NOT do**:
  - Test modal content/wording (not test focus)

  **Parallelizable**: YES (with 9, 10)

  **References**:
  - Pattern: `src/components/modals/HelpModal.jsx` - Modal implementation
  - External: Query by role/text - https://testing-library.com/docs/react-testing-library/cheatsheet

  **Acceptance Criteria**:
  - [ ] Test file created at `src/components/modals/HelpModal.test.jsx`
  - [ ] Renders when open
  - [ ] Does not render when closed
  - [ ] onClose called on close actions
  - [ ] `npm test HelpModal` → All tests pass

- [ ] 12. Test SettingsModal component
  **What to do**:
  - Create `src/components/modals/SettingsModal.test.jsx`
  - Test 1: Renders when isOpen=true
  - Test 2: Does NOT render when isOpen=false
  - Test 3: Calls onClose when close button clicked
  - Test 4: Calls onClose when overlay clicked
  - Test 5: Reset button calls onResetProgress handler

  **Must NOT do**:
  - Test modal layout or styling

  **Parallelizable**: YES (with 9, 10, 11)

  **References**:
  - Pattern: `src/components/modals/SettingsModal.jsx` - Modal with reset action
  - External: Query by role - https://testing-library.com/docs/react-testing-library/cheatsheet

  **Acceptance Criteria**:
  - [ ] Test file created at `src/components/modals/SettingsModal.test.jsx`
  - [ ] Renders when open
  - [ ] Does not render when closed
  - [ ] onClose called on close actions
  - [ ] onResetProgress called on reset button
  - [ ] `npm test SettingsModal` → All tests pass

### Integration Test

- [ ] 13. Test mode + status persistence flow
  **What to do**:
  - Create `src/integration/mode-status-persistence.test.jsx`
  - Test 1: Promoting word from Learning to Reviewing updates localStorage
  - Test 2: Changing mode to Learning filters words correctly
  - Test 3: Mode index persists after mode change (simulating page reload)
  - Test 4: All words mastered shows correct progress calculation

  **Must NOT do**:
  - Test UI components directly (covered in component tests)
  - Test exhaustive progress calculations

  **Parallelizable**: NO

  **References**:
  - Pattern: `src/hooks/useWordStatus.js`, `src/hooks/useModeState.js` - State management
  - Test Data: Minimal fixture with 3 words in different modes
  - External: waitFor - https://testing-library.com/docs/react-testing-library/api#waitfor

  **Acceptance Criteria**:
  - [ ] Test file created at `src/integration/mode-status-persistence.test.jsx`
  - [ ] Word status updates persist to localStorage
  - [ ] Mode change filters words correctly
  - [ ] Index persistence works
  - [ ] `npm test integration` → All tests pass

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1-2 | `test(infra): install deps and create vitest config` | vitest.config.js, package.json | `vitest --help` |
| 3-5 | `test(hooks): add unit tests for hooks` | useLocalStorage.test.js, useWordStatus.test.js, useKeyboardShortcuts.test.js | `npm test` |
| 6-9 | `test(components): add component tests` | Flashcard.test.jsx, ActionButtons.test.jsx, HelpModal.test.jsx, SettingsModal.test.jsx | `npm test` |
| 10 | `test(integration): add mode-status persistence test` | integration/mode-status-persistence.test.jsx | `npm test` |

---

## Success Criteria

### Verification Commands
```bash
npm test                    # Starts watch mode, all tests should pass
npm run test:run            # Runs all tests once
```

### Final Checklist
- [ ] All infrastructure files created (vitest.config.js, vitest.setup.js)
- [ ] All hook tests pass (useLocalStorage, useWordStatus, useKeyboardShortcuts)
- [ ] All component tests pass (Flashcard, ActionButtons, HelpModal, SettingsModal)
- [ ] Integration test passes (mode + status persistence)
- [ ] No CSS/styling assertions in any test
- [ ] No snapshot tests in any test
- [ ] Each test has 3-5 assertions max
- [ ] localStorage mocked correctly in all tests
