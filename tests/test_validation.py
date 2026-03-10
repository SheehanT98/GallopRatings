from datetime import datetime, timezone

import pytest

from ratings.exceptions import ValidationError
from ratings.models import MatchResult
from ratings.validation import validate_match


def test_validate_match_rejects_same_competitor() -> None:
    match = MatchResult(winner_id="a", loser_id="a")
    with pytest.raises(ValidationError, match="must be different"):
        validate_match(match)


def test_validate_match_rejects_non_positive_weight() -> None:
    match = MatchResult(winner_id="a", loser_id="b", weight=0)
    with pytest.raises(ValidationError, match="positive"):
        validate_match(match)


def test_validate_match_accepts_valid_payload() -> None:
    match = MatchResult(
        winner_id="winner",
        loser_id="loser",
        is_draw=False,
        weight=1.5,
        occurred_at=datetime.now(timezone.utc),
    )
    validate_match(match)
