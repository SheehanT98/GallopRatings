from __future__ import annotations

from datetime import datetime

from ratings.exceptions import ValidationError
from ratings.models import MatchResult


def validate_competitor_id(competitor_id: str, field_name: str) -> None:
    """Ensure competitor IDs are valid non-empty stable keys."""
    if not isinstance(competitor_id, str):
        raise ValidationError(f"{field_name} must be a string")
    if not competitor_id.strip():
        raise ValidationError(f"{field_name} must not be empty")


def validate_match(match: MatchResult) -> None:
    """Validate a match record prior to rating calculation."""
    validate_competitor_id(match.winner_id, "winner_id")
    validate_competitor_id(match.loser_id, "loser_id")
    if match.winner_id == match.loser_id:
        raise ValidationError("winner_id and loser_id must be different")
    if not isinstance(match.weight, (int, float)):
        raise ValidationError("weight must be numeric")
    if match.weight <= 0:
        raise ValidationError("weight must be positive")
    if not isinstance(match.occurred_at, datetime):
        raise ValidationError("occurred_at must be a datetime")
