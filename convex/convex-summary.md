# WealthWise → Convex Migration

## Goal
Migrate from localStorage to Convex Cloud for cross-device sync.

## Status: All hooks migrated ✓

### Done
- Schema with 7 tables (accounts, categories, paymentMethods, budgets, creditCards, goals, movements)
- 8 convex files: schema + queries/mutations for all entities + exportImport helpers
- All 10 hooks use Convex (`useQuery`/`useMutation`): useAccounts, usePaymentMethods, useCategories, useCreditCards, useGoals, useBudgets, useMovements, useDashboard, useReports, useCalendar
- CommandPalette uses Convex queries
- DataSection (settings) uses Convex queries + mutations
- Movements page import uses `useMutation(api.movements.create)`
- Clerk auth integrated (ClerkProvider + ConvexProviderWithClerk)
- Header shows real Clerk user

### Remaining
- Remove old `src/services/` directory (no longer imported anywhere)
- Remove TanStack Query dependency from package.json if unused
- Clean up localStorage references in codebase
- Run `npx convex deploy` to push to production
