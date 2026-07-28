export interface AuthUser {
  name: string
  email: string
  avatarUrl?: string
  provider: "credentials" | "google"
}
