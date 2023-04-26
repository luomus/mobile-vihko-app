import { useEffect, useRef } from 'react'

const useChange = (effect: () => any, deps: any) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) effect()
    else didMount.current = true
  }, deps)
}

export default useChange