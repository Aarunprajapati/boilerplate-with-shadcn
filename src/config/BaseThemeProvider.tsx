// theme/BaseThemeProvider.tsx
import { useLayoutEffect } from 'react'

type ThemeMode = 'light' | 'dark'

type Props = {
  children: React.ReactNode
  client: string
  mode: ThemeMode
}

const BaseThemeProvider = ({ children, client, mode }: Props) => {
  useLayoutEffect(() => {
    const root = document.documentElement

    root.dataset.client = client
    root.classList.toggle('dark', mode === 'dark')
    root.style.colorScheme = mode
  }, [client, mode])

  return children
}

export default BaseThemeProvider