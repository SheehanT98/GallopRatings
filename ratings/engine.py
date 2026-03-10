from __future__ import annotations

from functools import lru_cache
from math import exp, log

from ratings.exceptions import ValidationError
from ratings.models import MatchResult, RatingChange
from ratings.validation import validate_numeric

_LN_10 = log(10)


@lru_cache(maxsize=50_000)
def _expected_score_cached(rating_a: float, rating_b: float, scale: float) -> float:
    """Compute expected score with a module-level bounded cache."""
    scaled_diff = ((rating_b - rating_a) / scale) * _LN_10
    if scaled_diff >= 700:
        return 0.0
    if scaled_diff <= -700:
        return 1.0
    return 1.0 / (1.0 + exp(scaled_diff))


class EloEngine:
    """Deterministic Elo-based rating update engine."""

    def __init__(self, *, k_factor: float = 32.0, scale: float = 400.0) -> None:
        validate_numeric(k_factor, "k_factor")
        validate_numeric(scale, "scale")
        if k_factor <= 0:
            raise ValidationError("k_factor must be positive")
        if scale <= 0:
            raise ValidationError("scale must be positive")
        self.k_factor = float(k_factor)
        self.scale = float(scale)

    def expected_score(self, rating_a: float, rating_b: float) -> float:
        """Expected score for competitor A vs B."""
        return _expected_score_cached(rating_a, rating_b, self.scale)

    def rate(
        self,
        *,
        rating_winner: float,
        rating_loser: float,
        match: MatchResult,
    ) -> RatingChange:
        """
        Calculate updated ratings for a single match.

        For draw outcomes, each competitor's actual score is 0.5.
        """
        expected_winner = self.expected_score(rating_winner, rating_loser)
        expected_loser = 1.0 - expected_winner

        actual_winner = 0.5 if match.is_draw else 1.0
        actual_loser = 0.5 if match.is_draw else 0.0

        delta = self.k_factor * float(match.weight)
        new_winner = rating_winner + delta * (actual_winner - expected_winner)
        new_loser = rating_loser + delta * (actual_loser - expected_loser)

        return RatingChange(
            competitor_a=match.winner_id,
            competitor_b=match.loser_id,
            old_a=rating_winner,
            old_b=rating_loser,
            new_a=new_winner,
            new_b=new_loser,
            expected_a=expected_winner,
            expected_b=expected_loser,
            actual_a=actual_winner,
            actual_b=actual_loser,
        )
