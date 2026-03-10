import pytest

from ratings.engine import EloEngine
from ratings.exceptions import ValidationError
from ratings.models import MatchResult


def test_expected_score_is_symmetric() -> None:
    engine = EloEngine()
    a = engine.expected_score(1500, 1600)
    b = engine.expected_score(1600, 1500)
    assert round(a + b, 10) == 1.0


def test_rate_winner_gains_points() -> None:
    engine = EloEngine()
    match = MatchResult(winner_id="a", loser_id="b")
    change = engine.rate(rating_winner=1500, rating_loser=1500, match=match)
    assert change.new_a > change.old_a
    assert change.new_b < change.old_b


def test_draw_results_in_smaller_shift_for_favorite() -> None:
    engine = EloEngine()
    draw = MatchResult(winner_id="favorite", loser_id="underdog", is_draw=True)
    change = engine.rate(rating_winner=1700, rating_loser=1300, match=draw)
    assert change.new_a < change.old_a
    assert change.new_b > change.old_b


def test_expected_score_extreme_gap_is_stable() -> None:
    engine = EloEngine()
    low_vs_high = engine.expected_score(-50000, 50000)
    high_vs_low = engine.expected_score(50000, -50000)
    assert low_vs_high < 1e-200
    assert high_vs_low > 1 - 1e-12


def test_engine_rejects_invalid_k_factor() -> None:
    with pytest.raises(ValidationError, match="positive"):
        EloEngine(k_factor=0)


def test_engine_rejects_non_finite_scale() -> None:
    with pytest.raises(ValidationError, match="finite"):
        EloEngine(scale=float("nan"))
