import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state synchronized with localStorage
 * Handles JSON serialization/deserialization with error handling
 * 
 * @param {string} key - The localStorage key to use
 * @param {*} initialValue - The initial value if localStorage is empty or parse fails
 * @returns {[*, Function]} - [storedValue, setValue] tuple
 * 
 * @example
 * const [count, setCount] = useLocalStorage('count', 0);
 * const [user, setUser] = useLocalStorage('user', { name: 'John' });
 */
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      // If item exists and is not null, parse it
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.error(`Failed to parse ${key} from localStorage`, e);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error(`Failed to set ${key} in localStorage`, e);
    }
  };

  // Sync value with localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (e) {
      console.error(`Failed to persist ${key} to localStorage`, e);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
