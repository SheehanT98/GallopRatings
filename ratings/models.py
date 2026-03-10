from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Mapping


@dataclass(frozen=True, slots=True)
class MatchResult:
    """A single head-to-head result with normalized outcome values."""

    winner_id: str
    loser_id: str
    is_draw: bool = False
    weight: float = 1.0
    occurred_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass(frozen=True, slots=True)
class RatingChange:
    """Resulting rating values after processing one match."""

    competitor_a: str
    competitor_b: str
    old_a: float
    old_b: float
    new_a: float
    new_b: float
    expected_a: float
    expected_b: float
    actual_a: float
    actual_b: float


@dataclass(frozen=True, slots=True)
class RatingsSnapshot:
    """Immutable point-in-time view of all ratings."""

    ratings: Mapping[str, float]
    processed_matches: int
