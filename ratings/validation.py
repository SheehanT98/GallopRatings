from __future__ import annotations

from datetime import datetime
from math import isfinite

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
    if not isfinite(float(match.weight)):
        raise ValidationError("weight must be finite")
    if match.weight <= 0:
        raise ValidationError("weight must be positive")
    if not isinstance(match.is_draw, bool):
        raise ValidationError("is_draw must be a boolean")
    if not isinstance(match.occurred_at, datetime):
        raise ValidationError("occurred_at must be a datetime")
    if match.occurred_at.tzinfo is None or match.occurred_at.utcoffset() is None:
        raise ValidationError("occurred_at must be timezone-aware")


def validate_numeric(value: float, field_name: str) -> None:
    """Validate numeric float-like fields for finite values."""
    if not isinstance(value, (int, float)):
        raise ValidationError(f"{field_name} must be numeric")
    if not isfinite(float(value)):
        raise ValidationError(f"{field_name} must be finite")
