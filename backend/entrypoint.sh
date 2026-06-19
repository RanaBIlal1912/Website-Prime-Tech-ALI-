#!/usr/bin/env bash
set -e

echo "Waiting for database…"
python - <<'PY'
import os, time
import psycopg2
from urllib.parse import urlparse

url = urlparse(os.environ.get("DATABASE_URL", ""))
for attempt in range(30):
    try:
        psycopg2.connect(
            dbname=url.path.lstrip("/"), user=url.username,
            password=url.password, host=url.hostname, port=url.port or 5432,
        ).close()
        print("Database is ready.")
        break
    except Exception as exc:
        print(f"  db not ready ({attempt+1}/30): {exc}")
        time.sleep(2)
else:
    raise SystemExit("Database did not become ready in time.")
PY

echo "Applying migrations…"
python manage.py migrate --noinput

echo "Collecting static files…"
python manage.py collectstatic --noinput

# Seed only when explicitly requested (idempotent).
if [ "${RUN_SEED:-false}" = "true" ]; then
    echo "Seeding initial data…"
    python manage.py seed
fi

echo "Starting: $*"
exec "$@"
