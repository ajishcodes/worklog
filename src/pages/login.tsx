import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocation, useNavigate } from "react-router-dom"
import { NotebookPen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { useAuth } from "@/hooks/use-auth"
import { loginFormSchema, type LoginFormValues } from "@/lib/auth-schema"

export function LoginPage() {
  const { loginWithCredentials, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: { pathname: string } } }
  const redirectTo = location.state?.from?.pathname ?? "/"
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { identifier: "", password: "" },
  })

  async function onSubmit(values: LoginFormValues) {
    setError(null)
    const ok = await loginWithCredentials(values.identifier, values.password)
    if (!ok) {
      setError("Incorrect username/email or password.")
      return
    }
    navigate(redirectTo, { replace: true })
  }

  async function handleGoogleCredential(idToken: string) {
    setError(null)
    const ok = await loginWithGoogle(idToken)
    if (!ok) {
      setError("Could not sign in with Google. Please try again.")
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <NotebookPen className="size-6 text-foreground" strokeWidth={1.75} />
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Sign in to Worklog
          </h1>
          <p className="text-sm text-muted-foreground">
            Your personal work journal.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="username"
                      placeholder="admin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <GoogleSignInButton onCredential={handleGoogleCredential} />
      </div>
    </div>
  )
}
