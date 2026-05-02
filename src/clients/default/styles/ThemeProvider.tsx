import BaseThemeProvider from '@/config/BaseThemeProvider'
import './styles.scss'

type ThemeProviderProps = {
  children: React.ReactNode
  className?: string
}

const theme = {
  mode: 'light' as const,
}

const ThemeProvider = ({ children, className }: ThemeProviderProps) => {
  return (
    <BaseThemeProvider className={className} mode={theme.mode}>
      {children}
    </BaseThemeProvider>
  )
}

export default ThemeProvider
