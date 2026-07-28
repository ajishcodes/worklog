import { createContext, useEffect, useMemo, useState } from "react"
import type { Theme } from "@/types"

const STORAGE_KEY = "worklog-theme"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(theme: Theme) {
  const root = window.document.documentElement
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  root.classList.toggle("dark", resolved === "dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system"
  })

  useEffect(() => {
    applyTheme(theme)

    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = () => applyTheme("system")
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [theme])

  const setTheme = (next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }

  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
