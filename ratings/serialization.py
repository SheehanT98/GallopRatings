from __future__ import annotations

from dataclasses import asdict

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
