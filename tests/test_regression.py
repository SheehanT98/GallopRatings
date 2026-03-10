from datetime import datetime, timedelta, timezone

import pytest

from ratings import MatchResult, RatingsService


def test_golden_ratings_output_is_stable() -> None:
    base = datetime(2026, 1, 1, tzinfo=timezone.utc)
    matches = [
        MatchResult(winner_id="alpha", loser_id="beta", occurred_at=base + timedelta(minutes=2)),
        MatchResult(
            winner_id="gamma",
            loser_id="alpha",
            occurred_at=base + timedelta(minutes=3),
        ),
        MatchResult(
            winner_id="beta",
            loser_id="gamma",
            is_draw=True,
            occurred_at=base + timedelta(minutes=1),
        ),
        MatchResult(
            winner_id="alpha",
            loser_id="beta",
            occurred_at=base + timedelta(minutes=4),
            weight=1.5,
        ),
    ]

    service = RatingsService()
    service.process_many(matches, sort_by_time=True)
    ratings = service.snapshot().ratings

    assert ratings["alpha"] == pytest.approx(1522.2099924476909, abs=1e-9)
    assert ratings["beta"] == pytest.approx(1461.053700758787, abs=1e-9)
    assert ratings["gamma"] == pytest.approx(1516.736306793522, abs=1e-9)


def test_invariant_total_rating_conserved_without_bounds() -> None:
    competitors = ["a", "b", "c", "d"]
    service = RatingsService(base_rating=1500)

    # Elo updates are zero-sum when no bounds are applied.
    schedule = [
        MatchResult(winner_id="a", loser_id="b"),
        MatchResult(winner_id="c", loser_id="d"),
        MatchResult(winner_id="a", loser_id="c"),
        MatchResult(winner_id="b", loser_id="d"),
        MatchResult(winner_id="d", loser_id="a", is_draw=True),
    ]
    service.process_many(schedule)
    ratings = service.snapshot().ratings
    total = sum(ratings[c] for c in competitors)
    assert total == pytest.approx(1500.0 * len(competitors), abs=1e-9)


def test_invariant_repeated_wins_monotonic_trend() -> None:
    service = RatingsService()
    previous_a = 1500.0
    previous_b = 1500.0
    for _ in range(8):
        service.process_match(MatchResult(winner_id="a", loser_id="b"))
        current_a = service.get_rating("a")
        current_b = service.get_rating("b")
        assert current_a > previous_a
        assert current_b < previous_b
        previous_a = current_a
        previous_b = current_b
