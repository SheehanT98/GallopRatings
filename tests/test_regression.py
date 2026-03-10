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
