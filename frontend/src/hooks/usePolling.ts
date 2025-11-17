import { useEffect, useRef } from 'react'

interface UsePollingOptions {
  enabled?: boolean
  interval?: number
}

/**
 * Custom hook to poll a function at a specified interval
 * 
 * @param callback - Function to execute on each poll
 * @param options - Polling configuration
 */
export function usePolling(
  callback: () => void | Promise<void>,
  { enabled = true, interval = 5000 }: UsePollingOptions = {}
) {
  const savedCallback = useRef(callback)

  // Update ref when callback changes
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up polling
  useEffect(() => {
    if (!enabled) return

    const tick = async () => {
      await savedCallback.current()
    }

    // Execute immediately
    tick()

    // Then set up interval
    const id = setInterval(tick, interval)

    return () => clearInterval(id)
  }, [enabled, interval])
}
