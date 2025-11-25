'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        'relative w-10 h-10 p-0 hover:bg-gray-800/50 dark:hover:bg-gray-800/50',
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className={cn(
        'h-5 w-5 transition-all absolute',
        theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
      )} />
      <Moon className={cn(
        'h-5 w-5 transition-all absolute',
        theme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
      )} />
    </Button>
  )
}

