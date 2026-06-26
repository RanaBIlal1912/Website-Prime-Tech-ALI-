"""Helpers for IP extraction and writing audit records."""


def client_ip(request):
    if request is None:
        return None
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def log_action(request, action, target_model="", target_id="", changes=None):
    """Write an AuditLog row. Safe to call from views; never raises."""
    from .models import AuditLog

    try:
        user = getattr(request, "user", None)
        AuditLog.objects.create(
            actor=user if (user and user.is_authenticated) else None,
            actor_email=getattr(user, "email", "") if user and user.is_authenticated else "",
            action=action,
            target_model=target_model,
            target_id=str(target_id),
            changes=changes or {},
            ip_address=client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", "")[:300] if request else "",
        )
    except Exception:  # never let auditing break a request
        pass
