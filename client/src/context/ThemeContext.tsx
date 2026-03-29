import { useEffect, useMemo, useState } from 'react'
import { ThemeContext, type Theme, type ThemeContextValue } from './themeStore'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

function readTheme(): Theme {
  const stored = window.localStorage.getItem('finpath_theme')
  return stored === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readTheme())

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem('finpath_theme', theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme,
      toggleTheme: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
      setTheme: (t) => setThemeState(t),
    }
  }, [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
