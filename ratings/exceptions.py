class RatingsError(Exception):
    """Base exception for ratings module errors."""


class ValidationError(RatingsError):
    """Raised when input data does not satisfy domain constraints."""


class UnknownCompetitorError(RatingsError):
    """Raised when a requested competitor does not exist."""


class SerializationError(RatingsError):
    """Raised when serialized payloads cannot be parsed safely."""


class BatchProcessingError(RatingsError):
    """Raised when batch processing fails for any item."""
