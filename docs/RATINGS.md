# Ratings Module: Design, Formula, and Migration Notes

## Core formula

The engine uses Elo expected score:

`E(A) = 1 / (1 + 10 ^ ((R_B - R_A) / scale))`

and update:

`R'_A = R_A + (k_factor * weight) * (S_A - E(A))`

where:

- `S_A = 1.0` when A wins
- `S_A = 0.5` for draws
- `S_A = 0.0` for losses

Implementation details:

- Uses a numerically stable logistic form with `exp`.
- Clamps extreme exponent ranges to avoid overflow.
- Caches expected-score evaluations in a bounded module-level LRU cache.

## Determinism guarantees

- `process_many(..., sort_by_time=True)` provides deterministic chronological processing.
- `leaderboard()` is deterministic with tie-breaker `(rating desc, competitor_id asc)`.

## Validation behavior

Validated fields include:

- Competitor IDs: non-empty strings
- Match weight: numeric, finite, positive
- `is_draw`: boolean
- `occurred_at`: timezone-aware datetime
- Service bounds: `min_rating <= max_rating` and `base_rating` within bounds

## Migration notes

If integrating from older ad-hoc rating logic:

1. Replace direct dict math with `RatingsService.process_match` / `process_many`.
2. Ensure timestamps are timezone-aware.
3. If old system had implicit rating floor/ceiling, configure `min_rating`/`max_rating`.
4. For serialization, use:
   - `match_to_dict` / `match_from_dict`
   - `snapshot_to_dict` / `snapshot_from_dict`

## Follow-up opportunities

1. Add pluggable Glicko/TrueSkill engines behind the same service interface.
2. Add SQL/JSON persistence adapters for snapshots and history streams.
3. Add property-based tests for invariants under random match schedules.
