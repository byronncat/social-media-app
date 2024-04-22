import { useState, useEffect } from 'react'

export function useDebounce<T>(
  initialValue: T,
  time: number
): [T, React.Dispatch<T>, T] {
  const [value, setValue] = useState<T>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)
  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedValue(value)
    }, time)
    return () => {
      clearTimeout(debounce)
    }
  }, [value, time])
  return [debouncedValue, setValue, value]
}
