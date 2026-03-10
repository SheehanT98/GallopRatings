# Gallop Ratings

Improved ratings module with:

- Deterministic Elo engine
- Input validation with typed domain errors
- Stateful service layer for batch updates
- Snapshot and serialization helpers
- Focused unit tests for correctness and edge cases

## Quick usage

```python
from ratings import MatchResult, RatingsService

service = RatingsService()
service.process_match(MatchResult(winner_id="horse_a", loser_id="horse_b"))
print(service.snapshot().ratings)
```
