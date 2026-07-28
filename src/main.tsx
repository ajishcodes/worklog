import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { EntriesProvider } from "@/components/entries-provider"
import { AppRouter } from "@/app-router"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <EntriesProvider>
          <AppRouter />
        </EntriesProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
