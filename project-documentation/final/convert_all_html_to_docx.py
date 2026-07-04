
from html2docx import html2docx
from bs4 import BeautifulSoup
import os

# Directory containing HTML files
html_dir = os.path.join("project-documentation", "final")

# List of HTML files to convert
html_files = [
    "Chapter-1-SPMP.html",
    "Chapter-2-SRS.html",
    "Chapter-3-SDD.html",
    "Chapter-4-STD.html",
]

def extract_main_content(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    # Try to extract the main container if present
    main = soup.find("div", class_="container")
    if main:
        return str(main)
    # Fallback: return body or whole HTML
    body = soup.find("body")
    if body:
        return str(body)
    return html_content

for html_file in html_files:
    input_html = os.path.join(html_dir, html_file)
    output_docx = os.path.splitext(input_html)[0] + ".docx"
    with open(input_html, "r", encoding="utf-8") as f:
        html_content = f.read()
    main_html = extract_main_content(html_content)
    with open(output_docx, "wb") as docx_file:
        html2docx(main_html, docx_file)
    print(f"Converted {input_html} to {output_docx}")
