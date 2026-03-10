# Gallop Ratings

Improved ratings module with:

- Deterministic Elo engine
- Numerically stable expected-score calculations for extreme rating gaps
- Input validation with typed domain errors
- Stateful service layer for batch updates
- Atomic batch processing with rollback safety (default)
- Optional rating floor/ceiling bounds
- Deterministic leaderboard output (rating desc, id asc)
- Snapshot and serialization helpers
- Focused unit tests for correctness and edge cases

## Quick usage

```python
from ratings import MatchResult, RatingsService

service = RatingsService()
service.process_match(MatchResult(winner_id="horse_a", loser_id="horse_b"))
print(service.snapshot().ratings)
```

## Documentation

- Detailed formula, validation, and migration notes: `docs/RATINGS.md`
