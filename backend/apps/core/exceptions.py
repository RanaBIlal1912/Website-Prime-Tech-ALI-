"""Consistent JSON error envelope across the API."""
from rest_framework.views import exception_handler as drf_exception_handler


def exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is not None:
        detail = response.data
        response.data = {
            "success": False,
            "status_code": response.status_code,
            "errors": detail,
        }
    return response
