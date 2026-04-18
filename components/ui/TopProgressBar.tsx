'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function TopProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const finishRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearTimers() {
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
    if (finishRef.current) {
      clearTimeout(finishRef.current)
      finishRef.current = null
    }
  }

  function start() {
    clearTimers()
    setVisible(true)
    setProgress(8)
    tickRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p
        const delta = p < 40 ? 8 : p < 70 ? 3 : 1
        return Math.min(90, p + delta)
      })
    }, 200)
  }

  function finish() {
    clearTimers()
    setProgress(100)
    finishRef.current = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 220)
  }

  // Intercept anchor clicks that trigger client-side navigation
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a') as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#')) return

      try {
        const url = new URL(anchor.href, window.location.href)
        if (url.origin !== window.location.origin) return
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return
        }
        start()
      } catch {
        // ignore
      }
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close the bar whenever the route actually changed
  useEffect(() => {
    if (!visible) return
    finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  useEffect(() => () => clearTimers(), [])

  if (!visible) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] h-0.5 w-full"
    >
      <div
        className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.7)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
