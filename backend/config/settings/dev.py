"""Development settings."""
from .base import *  # noqa: F401,F403
from .base import env

DEBUG = True
ALLOWED_HOSTS = ["*"]

# Relax HTTPS-only cookies for local http.
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Allow the local Next.js dev server.
CORS_ALLOW_ALL_ORIGINS = env.bool("CORS_ALLOW_ALL_ORIGINS", default=True)

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
