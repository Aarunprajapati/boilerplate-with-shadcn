import BaseThemeProvider from '@/config/BaseThemeProvider'
import './styles.scss'

const theme = {
  client: 'default',
  mode: 'light' as const,
}

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BaseThemeProvider client={theme.client} mode={theme.mode}>
      {children}
    </BaseThemeProvider>
  )
}

export default ThemeProvider