import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/layouts/app-layout"
import { RequireAuth } from "@/components/auth/require-auth"
import { LoginPage } from "@/pages/login"
import { DashboardPage } from "@/pages/dashboard"
import { CalendarPage } from "@/pages/calendar"
import { EntriesPage } from "@/pages/entries"
import { EntryNewPage } from "@/pages/entry-new"
import { EntryDetailPage } from "@/pages/entry-detail"
import { AnalyticsPage } from "@/pages/analytics"
import { SettingsPage } from "@/pages/settings"
import { NotFoundPage } from "@/pages/not-found"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="entries" element={<EntriesPage />} />
            <Route path="entries/new" element={<EntryNewPage />} />
            <Route path="entries/:id" element={<EntryDetailPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
