from deeptutor.learning.prompts import get_learning_prompts
from deeptutor.services.config.loader import parse_language
from deeptutor.services.prompt.language import language_directive
from deeptutor.services.prompt.manager import PromptManager
from deeptutor.services.settings.interface_settings import _normalize_language


def test_normalize_language_accepts_european_portuguese_aliases() -> None:
    assert _normalize_language("pt-PT") == "pt-PT"
    assert _normalize_language("pt_PT") == "pt-PT"
    assert _normalize_language("pt") == "pt-PT"
    assert _normalize_language("portuguese") == "pt-PT"


def test_normalize_language_keeps_existing_languages_and_fallback() -> None:
    assert _normalize_language("en") == "en"
    assert _normalize_language("zh") == "zh"
    assert _normalize_language("unsupported", default="pt-PT") == "pt-PT"


def test_prompt_services_support_european_portuguese_with_english_fallback() -> None:
    assert parse_language("pt_PT") == "pt-PT"
    assert PromptManager.LANGUAGE_FALLBACKS["pt-PT"] == ["pt-PT", "pt", "en"]
    directive = language_directive("pt_PT")
    assert "Português (Portugal)" in directive
    assert "strictly" in directive
    assert get_learning_prompts("pt_PT") == get_learning_prompts("en")