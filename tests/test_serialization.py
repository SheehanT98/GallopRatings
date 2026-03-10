from datetime import datetime, timezone

import pytest

from ratings import MatchResult, RatingsSnapshot
from ratings.exceptions import SerializationError
from ratings.serialization import (
    match_from_dict,
    match_to_dict,
    snapshot_from_dict,
    snapshot_to_dict,
)


def test_match_round_trip_serialization() -> None:
    match = MatchResult(
        winner_id="a",
        loser_id="b",
        is_draw=False,
        weight=2.0,
        occurred_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
    )
    payload = match_to_dict(match)
    rebuilt = match_from_dict(payload)
    assert rebuilt == match


def test_match_from_dict_rejects_non_boolean_draw_flag() -> None:
    payload = {
        "winner_id": "a",
        "loser_id": "b",
        "is_draw": "false",
        "weight": 1.0,
        "occurred_at": datetime.now(timezone.utc).isoformat(),
    }
    with pytest.raises(SerializationError, match="boolean"):
        match_from_dict(payload)


def test_snapshot_round_trip_serialization() -> None:
    snapshot = RatingsSnapshot(ratings={"a": 1500.0, "b": 1488.5}, processed_matches=8)
    payload = snapshot_to_dict(snapshot)
    rebuilt = snapshot_from_dict(payload)
    assert rebuilt == snapshot
