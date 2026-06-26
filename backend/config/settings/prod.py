"""Production settings — security hardened."""
from .base import *  # noqa: F401,F403
from .base import env

DEBUG = False

# Must be set explicitly in production.
ALLOWED_HOSTS = env("ALLOWED_HOSTS")

# ---- HTTPS / transport security ----
SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=True)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")  # behind Nginx
SECURE_HSTS_SECONDS = env.int("SECURE_HSTS_SECONDS", default=31536000)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# ---- Cookies ----
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False  # frontend reads token; protected by SameSite + Secure
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"

# ---- Headers ----
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"

# ---- Storage backend selection (Local / S3 / R2 / GCS / Spaces / Azure) ----
# Set MEDIA_STORAGE_BACKEND and the matching credentials in the environment.
MEDIA_STORAGE_BACKEND = env("MEDIA_STORAGE_BACKEND", default="local")

if MEDIA_STORAGE_BACKEND in {"s3", "r2", "spaces"}:
    STORAGES["default"] = {"BACKEND": "storages.backends.s3.S3Storage"}  # noqa: F405
    AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID", default="")
    AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY", default="")
    AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME", default="")
    AWS_S3_ENDPOINT_URL = env("AWS_S3_ENDPOINT_URL", default=None)  # R2/Spaces custom endpoint
    AWS_S3_REGION_NAME = env("AWS_S3_REGION_NAME", default=None)
    AWS_QUERYSTRING_AUTH = False
    AWS_DEFAULT_ACL = None
elif MEDIA_STORAGE_BACKEND == "gcs":
    STORAGES["default"] = {"BACKEND": "storages.backends.gcloud.GoogleCloudStorage"}  # noqa: F405
    GS_BUCKET_NAME = env("GS_BUCKET_NAME", default="")
elif MEDIA_STORAGE_BACKEND == "azure":
    STORAGES["default"] = {"BACKEND": "storages.backends.azure_storage.AzureStorage"}  # noqa: F405
    AZURE_ACCOUNT_NAME = env("AZURE_ACCOUNT_NAME", default="")
    AZURE_ACCOUNT_KEY = env("AZURE_ACCOUNT_KEY", default="")
    AZURE_CONTAINER = env("AZURE_CONTAINER", default="")

# ---- Email (transactional) ----
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST", default="")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="no-reply@primetech.pk")
