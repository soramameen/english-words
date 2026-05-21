import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  // Clean localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  // Test 1: Returns initial value from localStorage (if key exists)
  test('returns value from localStorage when key exists', () => {
    const testValue = { user: 'test', count: 42 };
    localStorage.setItem('testKey', JSON.stringify(testValue));

    const { result } = renderHook(() => useLocalStorage('testKey'));

    expect(result.current[0]).toEqual(testValue);
  });

  // Test 2: Returns initialValue when key is missing
  test('returns initialValue when key is missing', () => {
    const initialValue = { user: 'default', count: 0 };
    const { result } = renderHook(() => useLocalStorage('missingKey', initialValue));

    expect(result.current[0]).toEqual(initialValue);
    expect(result.current[1]).toEqual(expect.any(Function));
  });

  // Test 3: Saves to localStorage on setValue call
  test('saves value to localStorage on setValue call', () => {
    const { result } = renderHook(() => useLocalStorage('saveKey', 'initialValue'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(localStorage.getItem('saveKey')).toBe('"newValue"');
  });

  // Test 4: Handles JSON parse errors gracefully (fallback to initialValue)
  test('handles JSON parse errors gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('errorKey', 'invalid-json-string');

    const initialValue = { user: 'default', count: 0 };
    const { result } = renderHook(() => useLocalStorage('errorKey', initialValue));

    expect(result.current[0]).toEqual(initialValue);
    expect(result.current[1]).toEqual(expect.any(Function));
  });
});
