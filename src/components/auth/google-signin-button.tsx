import { useEffect, useRef } from "react"
import { useTheme } from "@/hooks/use-theme"

const GIS_SRC = "https://accounts.google.com/gsi/client"

function loadGisScript(): Promise<void> {
  if (window.google?.accounts.id) return Promise.resolve()

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`)
  if (existing) {
    return new Promise((resolve) => existing.addEventListener("load", () => resolve()))
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = GIS_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google Sign-In"))
    document.head.appendChild(script)
  })
}

export function GoogleSignInButton({
  onCredential,
}: {
  onCredential: (idToken: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    let cancelled = false

    loadGisScript()
      .then(() => {
        const google = window.google
        if (cancelled || !containerRef.current || !google) return

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
        if (!clientId) {
          console.error("VITE_GOOGLE_CLIENT_ID is not set; Google Sign-In is disabled.")
          return
        }

        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredential(response.credential),
        })

        const isDark =
          theme === "dark" ||
          (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

        containerRef.current.innerHTML = ""
        google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: isDark ? "filled_black" : "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: containerRef.current.offsetWidth || 336,
        })
      })
      .catch((err: unknown) => console.error(err))

    return () => {
      cancelled = true
    }
  }, [onCredential, theme])

  return <div ref={containerRef} className="flex w-full justify-center" />
}
