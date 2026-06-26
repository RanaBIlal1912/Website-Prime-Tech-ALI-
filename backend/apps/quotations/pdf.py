"""Render a Quotation to a PDF using ReportLab (no external services)."""
import io

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from apps.core.models import SiteSetting

BRAND = colors.HexColor("#00aaff")
DARK = colors.HexColor("#12121a")
MUTED = colors.HexColor("#6b6b7b")


def render_quotation_pdf(quotation):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=18 * mm, bottomMargin=18 * mm,
        title=f"Quotation {quotation.number}",
    )
    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("h1", parent=styles["Heading1"], textColor=DARK, fontSize=20)
    small = ParagraphStyle("small", parent=styles["Normal"], textColor=MUTED, fontSize=9)
    right = ParagraphStyle("right", parent=styles["Normal"], alignment=2)

    site = SiteSetting.load()
    cur = quotation.currency
    story = []

    # Header: company + quote meta
    header = Table(
        [[
            Paragraph(f"<b>{site.site_title}</b><br/>{site.tagline}<br/>"
                      f"{site.address or 'Bahawalpur, Pakistan'}<br/>"
                      f"{site.phone}  ·  {site.email}", small),
            Paragraph(f"<b>QUOTATION</b><br/>#{quotation.number}<br/>"
                      f"Date: {quotation.issue_date}<br/>"
                      f"Valid until: {quotation.valid_until or '-'}", right),
        ]],
        colWidths=[100 * mm, 70 * mm],
    )
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story += [header, Spacer(1, 8 * mm)]

    # Bill-to
    story += [
        Paragraph("<b>Bill To</b>", styles["Normal"]),
        Paragraph(
            f"{quotation.customer_name}<br/>{quotation.customer_address}<br/>"
            f"{quotation.customer_phone}  {quotation.customer_email}", small,
        ),
        Spacer(1, 6 * mm),
    ]

    # Items table
    data = [["#", "Description", "Qty", f"Unit ({cur})", f"Total ({cur})"]]
    for idx, item in enumerate(quotation.items.all(), start=1):
        data.append([
            str(idx), item.description, f"{item.quantity:g}",
            f"{item.unit_price:,.2f}", f"{item.line_total:,.2f}",
        ])

    table = Table(data, colWidths=[10 * mm, 90 * mm, 18 * mm, 26 * mm, 26 * mm], repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#dddddd")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f4f8fb")]),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story += [table, Spacer(1, 5 * mm)]

    # Totals
    totals = Table(
        [
            ["Subtotal", f"{quotation.subtotal:,.2f} {cur}"],
            [f"Discount ({quotation.discount_percent:g}%)", f"-{quotation.discount_amount:,.2f} {cur}"],
            [f"Tax ({quotation.tax_percent:g}%)", f"{quotation.tax_amount:,.2f} {cur}"],
            ["TOTAL", f"{quotation.total:,.2f} {cur}"],
        ],
        colWidths=[40 * mm, 40 * mm], hAlign="RIGHT",
    )
    totals.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("LINEABOVE", (0, -1), (-1, -1), 1, DARK),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("TEXTCOLOR", (0, -1), (-1, -1), BRAND),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
    ]))
    story += [totals, Spacer(1, 8 * mm)]

    if quotation.notes:
        story += [Paragraph(f"<b>Notes:</b> {quotation.notes}", small), Spacer(1, 3 * mm)]
    story += [Paragraph(
        quotation.terms or "This quotation is valid for the period stated above. "
        "Prices are subject to change thereafter.", small)]

    doc.build(story)
    buffer.seek(0)
    return buffer
