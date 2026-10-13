'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-md text-muted-foreground"
        aria-label="Toggle theme"
        disabled
      >
        <Moon className="size-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="size-8 rounded-md text-muted-foreground hover:text-foreground transition-colors"
      id="theme-toggle-btn"
    >
      {isDark ? (
        <Sun className="size-4 text-amber-400" />
      ) : (
        <Moon className="size-4 text-stone-700" />
      )}
    </Button>
  )
}
