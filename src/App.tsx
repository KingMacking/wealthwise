import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/clerk-react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/features/theme'
import { AppShell } from '@/layouts'
import { AuthGuard } from '@/components/auth-guard'
import { convex } from '@/lib/convex'
import { Loader2 } from 'lucide-react'

const DashboardPage = lazy(() => import('@/pages/dashboard'))
const MovementsPage = lazy(() => import('@/pages/movements'))
const CategoriesPage = lazy(() => import('@/pages/categories'))
const BudgetsPage = lazy(() => import('@/pages/budgets'))
const AccountsPage = lazy(() => import('@/pages/accounts'))
const CreditCardsPage = lazy(() => import('@/pages/credit-cards'))
const GoalsPage = lazy(() => import('@/pages/goals'))
const ReportsPage = lazy(() => import('@/pages/reports'))
const CalendarPage = lazy(() => import('@/pages/calendar'))
const PaymentMethodsPage = lazy(() => import('@/pages/payment-methods'))
const SettingsPage = lazy(() => import('@/pages/settings'))
const AuthPage = lazy(() => import('@/pages/auth'))

const CLERK_PK = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={
        <Suspense fallback={<PageLoader />}><AuthPage /></Suspense>
      } />
      <Route element={<AppShell />}>
        <Route path="/" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><DashboardPage /></AuthGuard></Suspense>
        } />
        <Route path="/movements" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><MovementsPage /></AuthGuard></Suspense>
        } />
        <Route path="/categories" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><CategoriesPage /></AuthGuard></Suspense>
        } />
        <Route path="/budgets" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><BudgetsPage /></AuthGuard></Suspense>
        } />
        <Route path="/accounts" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><AccountsPage /></AuthGuard></Suspense>
        } />
        <Route path="/payment-methods" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><PaymentMethodsPage /></AuthGuard></Suspense>
        } />
        <Route path="/credit-cards" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><CreditCardsPage /></AuthGuard></Suspense>
        } />
        <Route path="/goals" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><GoalsPage /></AuthGuard></Suspense>
        } />
        <Route path="/reports" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><ReportsPage /></AuthGuard></Suspense>
        } />
        <Route path="/calendar" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><CalendarPage /></AuthGuard></Suspense>
        } />
        <Route path="/settings" element={
          <Suspense fallback={<PageLoader />}><AuthGuard><SettingsPage /></AuthGuard></Suspense>
        } />
      </Route>
    </Routes>
  )
}

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
    >
      Saltar al contenido principal
    </a>
  )
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PK}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <ThemeProvider>
            <BrowserRouter>
              <SkipLink />
              <AppRoutes />
            </BrowserRouter>
            <Toaster
              richColors
              closeButton
              position="bottom-right"
              toastOptions={{
                duration: 4000,
              }}
            />
          </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
