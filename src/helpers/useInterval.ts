import { useEffect, useRef } from 'react'

const useInterval = (callback: () => any, delay: number | null) => {
  const savedCallback = useRef<() => any>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])

  const tick = () => {
    if (savedCallback.current) savedCallback.current()
  }
}

export default useInterval