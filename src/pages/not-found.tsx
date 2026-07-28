import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="text-sm text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Button asChild size="sm" variant="outline">
        <Link to="/">Back to dashboard</Link>
      </Button>
    </div>
  )
}
