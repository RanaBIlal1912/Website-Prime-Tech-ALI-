"""Jazzmin admin-UI theming for the Prime Tech admin panel.

Imported by ``base.py``. Purely presentational — no behavioural change to the
admin; it themes the built-in Django admin with Prime Tech branding and the
brand colour (#00aaff) carried over from the legacy design system.
"""

JAZZMIN_SETTINGS = {
    "site_title": "Prime Tech Admin",
    "site_header": "Prime Tech",
    "site_brand": "Prime Tech",
    "site_logo": None,
    "login_logo": None,
    "welcome_sign": "Prime Tech — Your Security, Our Priority",
    "copyright": "Prime Tech",
    "search_model": ["accounts.User", "crm.Lead", "crm.Customer"],
    "show_sidebar": True,
    "navigation_expanded": True,
    "order_with_respect_to": [
        "accounts", "crm", "quotations", "support",
        "catalog", "portfolio", "blog", "mediahub", "core", "audit",
    ],
    # FontAwesome icons per model.
    "icons": {
        "accounts.User": "fas fa-user",
        "accounts.Role": "fas fa-user-shield",
        "accounts.Permission": "fas fa-key",
        "crm.Lead": "fas fa-bullseye",
        "crm.Customer": "fas fa-user-tie",
        "crm.FollowUp": "fas fa-clock",
        "crm.Activity": "fas fa-stream",
        "quotations.Quotation": "fas fa-file-invoice-dollar",
        "support.Ticket": "fas fa-life-ring",
        "catalog.Service": "fas fa-cogs",
        "catalog.Product": "fas fa-box",
        "catalog.Category": "fas fa-tags",
        "catalog.Testimonial": "fas fa-quote-right",
        "portfolio.Project": "fas fa-briefcase",
        "blog.Post": "fas fa-newspaper",
        "blog.Category": "fas fa-folder",
        "blog.Tag": "fas fa-hashtag",
        "mediahub.MediaFile": "fas fa-photo-video",
        "mediahub.MediaFolder": "fas fa-folder-open",
        "core.SiteSetting": "fas fa-sliders-h",
        "core.SeoSetting": "fas fa-search",
        "core.PageBackground": "fas fa-image",
        "core.HomeSection": "fas fa-th-large",
        "audit.AuditLog": "fas fa-clipboard-list",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    "related_modal_active": True,
    "changeform_format": "horizontal_tabs",
}

JAZZMIN_UI_TWEAKS = {
    "navbar": "navbar-dark",
    "no_navbar_border": True,
    "brand_colour": "navbar-primary",
    "accent": "accent-info",
    "navbar_fixed": True,
    "sidebar": "sidebar-dark-info",
    "sidebar_fixed": True,
    "theme": "darkly",          # dark theme — matches the brand identity
    "button_classes": {
        "primary": "btn-info",
        "success": "btn-success",
    },
}
