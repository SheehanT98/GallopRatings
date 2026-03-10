from ratings import MatchResult, RatingsService
from ratings.exceptions import UnknownCompetitorError


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
    try:
        service.get_rating("ghost")
        assert False, "expected UnknownCompetitorError"
    except UnknownCompetitorError:
        pass


def test_snapshot_tracks_processed_matches() -> None:
    service = RatingsService()
    service.process_match(MatchResult(winner_id="a", loser_id="b"))
    service.process_match(MatchResult(winner_id="a", loser_id="c"))
    snapshot = service.snapshot()
    assert snapshot.processed_matches == 2
    assert set(snapshot.ratings) == {"a", "b", "c"}
