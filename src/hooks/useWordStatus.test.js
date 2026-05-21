import { renderHook, act } from '@testing-library/react';
import { useWordStatus } from './useWordStatus';

describe('useWordStatus', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Returns empty object {} initially', () => {
    const { result } = renderHook(() => useWordStatus());
    expect(result.current.wordStatus).toEqual({});
  });

  test('Updates status for a single word', () => {
    const { result } = renderHook(() => useWordStatus());

    act(() => {
      result.current.updateWordStatus(46, 'reviewing');
    });

    expect(result.current.wordStatus).toEqual({
      46: 'reviewing'
    });
  });

  test('Multiple word status updates merge correctly', () => {
    const { result } = renderHook(() => useWordStatus());

    act(() => {
      result.current.updateWordStatus(46, 'reviewing');
    });
    expect(result.current.wordStatus).toEqual({
      46: 'reviewing'
    });

    act(() => {
      result.current.updateWordStatus(48, 'mastered');
    });
    expect(result.current.wordStatus).toEqual({
      46: 'reviewing',
      48: 'mastered'
    });

    act(() => {
      result.current.updateWordStatus(46, 'learning');
    });
    expect(result.current.wordStatus).toEqual({
      46: 'learning',
      48: 'mastered'
    });
  });

  test('Calls setWordStatus updates localStorage', () => {
    const { result } = renderHook(() => useWordStatus());

    act(() => {
      result.current.updateWordStatus(46, 'reviewing');
    });

    expect(result.current.wordStatus).toEqual({
      46: 'reviewing'
    });

    act(() => {
      result.current.updateWordStatus(46, 'mastered');
    });

    expect(result.current.wordStatus).toEqual({
      46: 'mastered'
    });
  });
});
