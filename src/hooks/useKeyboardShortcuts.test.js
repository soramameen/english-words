import { renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { KEYBOARD_KEYS } from '../utils/constants';

describe('useKeyboardShortcuts', () => {
  let mockCallback;

  beforeEach(() => {
    mockCallback = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('calls callback when matching key is pressed', () => {
    const { result } = renderHook(() =>
      useKeyboardShortcuts({ [KEYBOARD_KEYS.FLIP_CARD]: mockCallback })
    );

    userEvent.keyboard(' ');

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('does NOT call callback when enabled=false', () => {
    renderHook(() =>
      useKeyboardShortcuts({ [KEYBOARD_KEYS.FLIP_CARD]: mockCallback }, false)
    );

    userEvent.keyboard(' ');

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('does NOT call callback when focus is in input or textarea element', () => {
    renderHook(() =>
      useKeyboardShortcuts({ [KEYBOARD_KEYS.FLIP_CARD]: mockCallback })
    );

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    userEvent.keyboard(' ');

    document.body.removeChild(input);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('cleans up event listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ [KEYBOARD_KEYS.FLIP_CARD]: mockCallback })
    );

    unmount();

    userEvent.keyboard(' ');

    expect(mockCallback).not.toHaveBeenCalled();
  });
});

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('calls callback when matching key is pressed', () => {
    const { result, unmount } = renderHook(() =>
      useKeyboardShortcuts({ [KEYBOARD_KEYS.SPACE]: mockCallback })
    );

    const handleKeyDown = () => {
      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        key: ' ',
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(event);
    };

    window.addEventListener('keydown', handleKeyDown);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    window.removeEventListener('keydown', handleKeyDown);
  });

  test('does NOT call callback when enabled=false', () => {
    const { result } = renderHook(() =>
      useKeyboardShortcuts({ [KEYBOARD_KEYS.SPACE]: mockCallback }, false)
    );

    userEvent.keyboard(' ');

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('does NOT call callback when focus is in input or textarea element', () => {
    const { result } = renderHook(() =>
      useKeyboardShortcuts({ [KEYBOARD_KEYS.SPACE]: mockCallback })
    );

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    userEvent.keyboard(' ');

    document.body.removeChild(input);
    input.focus();

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('cleans up event listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ [KEYBOARD_KEYS.SPACE]: mockCallback })
    );

    unmount();

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
