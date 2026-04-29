import { useLayoutEffect, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ThemeMode = 'light' | 'dark'

type ThemeProviderProps = {
  children: ReactNode
  className?: string
}

const themeTokens = {
  '--background': 'oklch(0.145 0 0)',
  '--foreground': 'oklch(0.985 0 0)',
  '--card': 'oklch(0.205 0 0)',
  '--card-foreground': 'oklch(0.985 0 0)',
  '--popover': 'oklch(0.269 0 0)',
  '--popover-foreground': 'oklch(0.985 0 0)',
  '--primary': 'oklch(0.696 0.17 162.48)',
  '--primary-foreground': 'oklch(0.979 0.021 166.113)',
  '--secondary': 'oklch(0.269 0 0)',
  '--secondary-foreground': 'oklch(0.985 0 0)',
  '--muted': 'oklch(0.269 0 0)',
  '--muted-foreground': 'oklch(0.708 0 0)',
  '--accent': 'oklch(0.371 0 0)',
  '--accent-foreground': 'oklch(0.985 0 0)',
  '--destructive': 'oklch(0.704 0.191 22.216)',
  '--destructive-foreground': 'oklch(0.985 0 0)',
  '--border': 'oklch(1 0 0 / 10%)',
  '--input': 'oklch(1 0 0 / 15%)',
  '--ring': 'oklch(0.378 0.077 168.94)',
  '--chart-1': 'oklch(0.845 0.143 164.978)',
  '--chart-2': 'oklch(0.696 0.17 162.48)',
  '--chart-3': 'oklch(0.596 0.145 163.225)',
  '--chart-4': 'oklch(0.508 0.118 165.612)',
  '--chart-5': 'oklch(0.432 0.095 166.913)',
  '--sidebar': 'oklch(0.205 0 0)',
  '--sidebar-foreground': 'oklch(0.985 0 0)',
  '--sidebar-primary': 'oklch(0.696 0.17 162.48)',
  '--sidebar-primary-foreground': 'oklch(0.979 0.021 166.113)',
  '--sidebar-accent': 'oklch(0.269 0 0)',
  '--sidebar-accent-foreground': 'oklch(0.985 0 0)',
  '--sidebar-border': 'oklch(1 0 0 / 10%)',
  '--sidebar-ring': 'oklch(0.378 0.077 168.94)',
  '--header': 'oklch(0.145 0 0)',
  '--header-foreground': 'oklch(0.985 0 0)',
  '--footer': 'oklch(0.145 0 0)',
  '--footer-foreground': 'oklch(0.985 0 0)',
  '--code': 'oklch(0.2 0 0)',
  '--code-foreground': 'oklch(0.708 0 0)',
  '--code-highlight': 'oklch(0.27 0 0)',
  '--code-number': 'oklch(0.72 0 0)',
  '--code-selection': 'oklch(0.922 0 0)',
  '--code-border': 'oklch(1 0 0 / 10%)',
  '--radius': '0.5rem',
} as const

const clientTheme: {
  client: string
  mode: ThemeMode
  tokens: typeof themeTokens
} = {
  client: 'demo',
  mode: 'dark',
  tokens: themeTokens,
}

const ThemeProvider = ({ children, className }: ThemeProviderProps) => {
  useLayoutEffect(() => {
    const root = document.documentElement

    root.dataset.client = clientTheme.client
    root.classList.toggle('dark', clientTheme.mode === 'dark')
    root.style.colorScheme = clientTheme.mode

    Object.entries(clientTheme.tokens).forEach(([token, value]) => {
      root.style.setProperty(token, value)
    })
  }, [])

  return (
    <div className={cn('min-h-screen bg-background text-foreground', className)}>
      {children}
    </div>
  )
}

export default ThemeProvider
