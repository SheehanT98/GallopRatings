from datetime import datetime, timedelta, timezone

import pytest

from ratings import MatchResult, RatingsService
from ratings.exceptions import UnknownCompetitorError, ValidationError


def test_process_many_is_deterministic() -> None:
    matches = [
        MatchResult(winner_id="a", loser_id="b"),
        MatchResult(winner_id="a", loser_id="c"),
        MatchResult(winner_id="b", loser_id="c"),
    ]

    service_1 = RatingsService()
    service_2 = RatingsService()

    service_1.process_many(matches)
    service_2.process_many(matches)

    assert service_1.snapshot().ratings == service_2.snapshot().ratings


def test_unknown_competitor_raises() -> None:
    service = RatingsService()
    with pytest.raises(UnknownCompetitorError):
        service.get_rating("ghost")


def test_snapshot_tracks_processed_matches() -> None:
    service = RatingsService()
    service.process_match(MatchResult(winner_id="a", loser_id="b"))
    service.process_match(MatchResult(winner_id="a", loser_id="c"))
    snapshot = service.snapshot()
    assert snapshot.processed_matches == 2
    assert set(snapshot.ratings) == {"a", "b", "c"}


def test_leaderboard_sorted_with_tie_breaker() -> None:
    service = RatingsService()
    service.process_match(MatchResult(winner_id="b", loser_id="x"))
    service.process_match(MatchResult(winner_id="a", loser_id="y"))
    board = service.leaderboard()
    assert board[0][0] == "a"
    assert board[1][0] == "b"


def test_leaderboard_limit_validation() -> None:
    service = RatingsService()
    with pytest.raises(ValidationError, match="positive"):
        service.leaderboard(limit=0)


def test_process_many_can_sort_by_time() -> None:
    now = datetime.now(timezone.utc)
    late = MatchResult(winner_id="a", loser_id="b", occurred_at=now + timedelta(days=1))
    early = MatchResult(winner_id="b", loser_id="a", occurred_at=now)

    unsorted_service = RatingsService()
    unsorted_service.process_many([late, early], sort_by_time=False)

    sorted_service = RatingsService()
    sorted_service.process_many([late, early], sort_by_time=True)

    assert unsorted_service.snapshot().ratings != sorted_service.snapshot().ratings


def test_rating_bounds_are_enforced() -> None:
    service = RatingsService(base_rating=1500, min_rating=1490, max_rating=1510)
    for _ in range(50):
        service.process_match(MatchResult(winner_id="a", loser_id="b"))
    snapshot = service.snapshot()
    assert snapshot.ratings["a"] <= 1510
    assert snapshot.ratings["b"] >= 1490


def test_constructor_rejects_base_rating_outside_bounds() -> None:
    with pytest.raises(ValidationError, match=">= min_rating"):
        RatingsService(base_rating=1400, min_rating=1450)


def test_constructor_rejects_non_finite_bounds() -> None:
    with pytest.raises(ValidationError, match="finite"):
        RatingsService(base_rating=1500, max_rating=float("inf"))
