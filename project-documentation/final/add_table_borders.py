from bs4 import BeautifulSoup
import os

html_dir = os.path.join("project-documentation", "final")
html_files = [
    "Chapter-1-SPMP.html",
    "Chapter-2-SRS.html",
    "Chapter-3-SDD.html",
    "Chapter-4-STD.html",
]

for html_file in html_files:
    input_html = os.path.join(html_dir, html_file)
    with open(input_html, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
    for table in soup.find_all("table"):
        style = table.get("style", "")
        if "border" not in style:
            style += ";border:1px solid #000;border-collapse:collapse;"
        table["style"] = style
        for th in table.find_all("th"):
            th_style = th.get("style", "")
            if "border" not in th_style:
                th_style += ";border:1px solid #000;"
            th["style"] = th_style
        for td in table.find_all("td"):
            td_style = td.get("style", "")
            if "border" not in td_style:
                td_style += ";border:1px solid #000;"
            td["style"] = td_style
    with open(input_html, "w", encoding="utf-8") as f:
        f.write(str(soup))
print("Added borders to all tables in HTML files.")
