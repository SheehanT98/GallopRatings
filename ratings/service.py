from __future__ import annotations

from collections import defaultdict
from collections.abc import Iterable
from copy import deepcopy

from ratings.engine import EloEngine
from ratings.exceptions import UnknownCompetitorError, ValidationError
from ratings.models import MatchResult, RatingChange, RatingsSnapshot
from ratings.validation import validate_competitor_id, validate_match, validate_numeric


class RatingsService:
    """Stateful service for applying ordered match results to ratings."""

    def __init__(
        self,
        *,
        base_rating: float = 1500.0,
        min_rating: float | None = None,
        max_rating: float | None = None,
        engine: EloEngine | None = None,
    ) -> None:
        validate_numeric(base_rating, "base_rating")
        if min_rating is not None:
            validate_numeric(min_rating, "min_rating")
        if max_rating is not None:
            validate_numeric(max_rating, "max_rating")
        if min_rating is not None and max_rating is not None and min_rating > max_rating:
            raise ValidationError("min_rating must be <= max_rating")
        if min_rating is not None and base_rating < min_rating:
            raise ValidationError("base_rating must be >= min_rating")
        if max_rating is not None and base_rating > max_rating:
            raise ValidationError("base_rating must be <= max_rating")
        self.base_rating = float(base_rating)
        self.min_rating = float(min_rating) if min_rating is not None else None
        self.max_rating = float(max_rating) if max_rating is not None else None
        self.engine = engine or EloEngine()
        self._ratings: dict[str, float] = defaultdict(lambda: self.base_rating)
        self._history: list[RatingChange] = []

    def process_match(self, match: MatchResult) -> RatingChange:
        """Validate and process a single match."""
        validate_match(match)
        current_winner = self._ratings[match.winner_id]
        current_loser = self._ratings[match.loser_id]
        change = self.engine.rate(
            rating_winner=current_winner,
            rating_loser=current_loser,
            match=match,
        )
        bounded_winner = self._bounded(change.new_a)
        bounded_loser = self._bounded(change.new_b)
        self._ratings[match.winner_id] = bounded_winner
        self._ratings[match.loser_id] = bounded_loser
        if bounded_winner != change.new_a or bounded_loser != change.new_b:
            change = RatingChange(
                competitor_a=change.competitor_a,
                competitor_b=change.competitor_b,
                old_a=change.old_a,
                old_b=change.old_b,
                new_a=bounded_winner,
                new_b=bounded_loser,
                expected_a=change.expected_a,
                expected_b=change.expected_b,
                actual_a=change.actual_a,
                actual_b=change.actual_b,
            )
        self._history.append(change)
        return change

    def process_many(
        self,
        matches: Iterable[MatchResult],
        *,
        sort_by_time: bool = False,
    ) -> list[RatingChange]:
        """Process an ordered iterable of matches."""
        if sort_by_time:
            matches = sorted(matches, key=lambda m: (m.occurred_at, m.winner_id, m.loser_id))
        return [self.process_match(match) for match in matches]

    def get_rating(self, competitor_id: str) -> float:
        """Return current rating for a competitor."""
        validate_competitor_id(competitor_id, "competitor_id")
        if competitor_id not in self._ratings:
            raise UnknownCompetitorError(f"Unknown competitor: {competitor_id}")
        return self._ratings[competitor_id]

    def snapshot(self) -> RatingsSnapshot:
        """Get immutable snapshot for downstream consumers."""
        return RatingsSnapshot(
            ratings=deepcopy(dict(self._ratings)),
            processed_matches=len(self._history),
        )

    def history(self) -> tuple[RatingChange, ...]:
        """Return immutable history of processed rating changes."""
        return tuple(self._history)

    def leaderboard(self, *, limit: int | None = None) -> list[tuple[str, float]]:
        """
        Return competitors sorted by rating desc, then id asc.

        Deterministic tie-breaking by competitor_id keeps output stable.
        """
        if limit is not None and limit <= 0:
            raise ValidationError("limit must be positive when provided")
        rows = sorted(self._ratings.items(), key=lambda item: (-item[1], item[0]))
        return rows[:limit] if limit is not None else rows

    def _bounded(self, rating: float) -> float:
        if self.min_rating is not None:
            rating = max(self.min_rating, rating)
        if self.max_rating is not None:
            rating = min(self.max_rating, rating)
        return rating
