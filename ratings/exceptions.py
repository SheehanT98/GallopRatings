class RatingsError(Exception):
    """Base exception for ratings module errors."""


class ValidationError(RatingsError):
    """Raised when input data does not satisfy domain constraints."""


class UnknownCompetitorError(RatingsError):
    """Raised when a requested competitor does not exist."""
