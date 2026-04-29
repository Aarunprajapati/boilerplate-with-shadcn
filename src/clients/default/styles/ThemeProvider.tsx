import BaseThemeProvider from '@/config/BaseThemeProvider'
import './styles.scss'

type ThemeProviderProps = {
  children: React.ReactNode
  className?: string
}

const theme = {
  client: 'default',
  mode: 'dark' as const,
}

const ThemeProvider = ({ children, className }: ThemeProviderProps) => {
  return (
    <BaseThemeProvider className={className} client={theme.client} mode={theme.mode}>
      {children}
    </BaseThemeProvider>
  )
}

export default ThemeProvider
