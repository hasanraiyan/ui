import { useRef } from 'react';

export default function useDebounce(callback, delay) {
  const timeoutRef = useRef();

  function debounced(...args) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }

  return debounced;
}
