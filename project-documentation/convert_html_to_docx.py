from html2docx import html2docx
from bs4 import BeautifulSoup
import sys
import os

# Input and output paths
input_html = "project-documentation/Chapter-1-SPMP.html"
output_docx = "project-documentation/Chapter-1-SPMP.docx"

# Read HTML content
with open(input_html, "r", encoding="utf-8") as f:
    html_content = f.read()

# Optional: Clean up HTML if needed
soup = BeautifulSoup(html_content, "html.parser")
clean_html = str(soup)

# Convert HTML to DOCX
with open(output_docx, "wb") as docx_file:
    html2docx(clean_html, docx_file)

print(f"Converted {input_html} to {output_docx}")
