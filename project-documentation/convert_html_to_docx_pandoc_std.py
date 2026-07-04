from bs4 import BeautifulSoup
import pypandoc

input_html = "project-documentation/Chapter-4-STD.html"
temp_html = "project-documentation/Chapter-4-STD-diagrams-removed.html"
output_docx = "project-documentation/Chapter-4-STD.docx"

# Read and parse HTML
with open(input_html, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

# Remove diagrams and insert placeholder for empty space
for diagram in soup.find_all(class_=["diagram-box", "diagram-image-container", "mermaid"]):
    placeholder = soup.new_tag("div")
    placeholder.string = "[Diagram Placeholder: Insert diagram here]"
    placeholder['style'] = "height: 120px; border: 1px dashed #888; margin: 20px 0; text-align: center; line-height: 120px; font-style: italic; color: #888;"
    diagram.replace_with(placeholder)

with open(temp_html, "w", encoding="utf-8") as f:
    f.write(str(soup))

# Convert cleaned HTML to DOCX
pypandoc.convert_file(temp_html, 'docx', outputfile=output_docx)
print(f"Converted {input_html} to {output_docx} with diagram placeholders.")
