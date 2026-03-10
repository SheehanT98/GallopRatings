from __future__ import annotations

from collections import defaultdict
from collections.abc import Iterable
from copy import deepcopy

from ratings.engine import EloEngine
from ratings.exceptions import UnknownCompetitorError
from ratings.models import MatchResult, RatingChange, RatingsSnapshot
from ratings.validation import validate_match


class RatingsService:
    """Stateful service for applying ordered match results to ratings."""

    def __init__(self, *, base_rating: float = 1500.0, engine: EloEngine | None = None) -> None:
        self.base_rating = float(base_rating)
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
        self._ratings[match.winner_id] = change.new_a
        self._ratings[match.loser_id] = change.new_b
        self._history.append(change)
        return change

    def process_many(self, matches: Iterable[MatchResult]) -> list[RatingChange]:
        """Process an ordered iterable of matches."""
        return [self.process_match(match) for match in matches]

    def get_rating(self, competitor_id: str) -> float:
        """Return current rating for a competitor."""
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
