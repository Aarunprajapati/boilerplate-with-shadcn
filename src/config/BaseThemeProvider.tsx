/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme-mode'

type ThemeModeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

type Props = {
  children: ReactNode
  className?: string
  client: string
  mode: ThemeMode
}

const getStoredThemeMode = (fallback: ThemeMode): ThemeMode => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY)
    return storedMode === 'light' || storedMode === 'dark' ? storedMode : fallback
  } catch {
    return fallback
  }
}

const BaseThemeProvider = ({ children, className, client, mode }: Props) => {
  const [activeMode, setActiveMode] = useState<ThemeMode>(() => getStoredThemeMode(mode))

  useLayoutEffect(() => {
    const root = document.documentElement

    root.dataset.client = client
    root.classList.toggle('dark', activeMode === 'dark')
    root.style.colorScheme = activeMode

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, activeMode)
    } catch {
      // Ignore storage failures; DOM theme state still updates.
    }
  }, [activeMode, client])

  const setMode = useCallback((nextMode: ThemeMode) => {
    setActiveMode(nextMode)
  }, [])

  const toggleMode = useCallback(() => {
    setActiveMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'))
  }, [])

  const contextValue = useMemo(
    () => ({
      mode: activeMode,
      setMode,
      toggleMode,
    }),
    [activeMode, setMode, toggleMode],
  )

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <div className={cn('min-h-screen bg-background text-foreground', className)}>
        {children}
      </div>
    </ThemeModeContext.Provider>
  )
}

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext)

  if (!context) {
    throw new Error('useThemeMode must be used within BaseThemeProvider')
  }

  return context
}

export default BaseThemeProvider
