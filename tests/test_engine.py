from ratings.engine import EloEngine
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
