# React Native App Architecture

## Structure

```
src/
  app/
    navigation/
    providers/
  components/ui/
  features/ratings/
    components/
    constants/
    data/
    hooks/
    screens/
    types/
    utils/
  lib/supabase/
```

## Design principles

1. **Feature-first boundaries**  
   Ratings logic and UI live together under `features/ratings`.

2. **Typed repository abstraction**  
   `RatingsRepository` interface separates screen code from storage implementation.
   - `SupabaseRatingsRepository` for backend mode.
   - `InMemoryRatingsRepository` fallback for local/dev mode.

3. **Query/mutation orchestration through hooks**  
   Screen components use React Query hooks from `useRatingsQueries.ts`, not direct data source calls.

4. **Reusable UI primitives**  
   Shared elements like cards/buttons/chips/fields reduce style and behavior duplication.

5. **Performance-minded defaults**  
   - Memoized filter object creation
   - React Query stale-time usage
   - Memoized list item components for high-churn lists
   - FlatList-based rendering for history/staged/result lists

6. **Responsive-first layout**  
   - Centralized breakpoint logic via `useResponsiveLayout`
   - Centered constrained content widths for web/desktop
   - Desktop two-column layouts for major screens while preserving mobile-first flow

## Migrated flows

- Ratings Home
- Ratings Input (create + history)
- Ratings Edit
- Barn List
- Ratings Reports (filter + staging)
- Reporting Page
