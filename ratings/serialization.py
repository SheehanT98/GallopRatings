from __future__ import annotations

from dataclasses import asdict
from datetime import datetime

from ratings.exceptions import SerializationError
from ratings.models import MatchResult, RatingChange, RatingsSnapshot


def match_to_dict(match: MatchResult) -> dict[str, object]:
    payload = asdict(match)
    payload["occurred_at"] = match.occurred_at.isoformat()
    return payload


def change_to_dict(change: RatingChange) -> dict[str, object]:
    return asdict(change)


def snapshot_to_dict(snapshot: RatingsSnapshot) -> dict[str, object]:
    return {
        "ratings": dict(snapshot.ratings),
        "processed_matches": snapshot.processed_matches,
    }


def match_from_dict(payload: dict[str, object]) -> MatchResult:
    """Rehydrate a match payload from plain dictionary form."""
    try:
        winner_id = str(payload["winner_id"])
        loser_id = str(payload["loser_id"])
        occurred_raw = payload["occurred_at"]
    except (KeyError, TypeError) as exc:
        raise SerializationError("Invalid match payload") from exc

    raw_weight = payload.get("weight", 1.0)
    if not isinstance(raw_weight, (int, float)):
        raise SerializationError("match.weight must be numeric")
    weight = float(raw_weight)

    raw_is_draw = payload.get("is_draw", False)
    if not isinstance(raw_is_draw, bool):
        raise SerializationError("match.is_draw must be a boolean")
    is_draw = raw_is_draw

    if not isinstance(occurred_raw, str):
        raise SerializationError("match.occurred_at must be an ISO datetime string")

    try:
        occurred_at = datetime.fromisoformat(occurred_raw)
    except ValueError as exc:
        raise SerializationError("match.occurred_at must be parseable ISO datetime") from exc

    return MatchResult(
        winner_id=winner_id,
        loser_id=loser_id,
        is_draw=is_draw,
        weight=weight,
        occurred_at=occurred_at,
    )


def snapshot_from_dict(payload: dict[str, object]) -> RatingsSnapshot:
    """Rehydrate a ratings snapshot from plain dictionary form."""
    try:
        raw_ratings = payload["ratings"]
        raw_processed_matches = payload["processed_matches"]
    except (KeyError, TypeError) as exc:
        raise SerializationError("Invalid snapshot payload") from exc

    if not isinstance(raw_ratings, dict):
        raise SerializationError("snapshot.ratings must be a dictionary")
    if not isinstance(raw_processed_matches, int):
        raise SerializationError("snapshot.processed_matches must be an integer")
    processed_matches = raw_processed_matches

    try:
        ratings = {str(competitor_id): float(value) for competitor_id, value in raw_ratings.items()}
    except (TypeError, ValueError) as exc:
        raise SerializationError("snapshot.ratings values must be numeric") from exc
    return RatingsSnapshot(ratings=ratings, processed_matches=processed_matches)
