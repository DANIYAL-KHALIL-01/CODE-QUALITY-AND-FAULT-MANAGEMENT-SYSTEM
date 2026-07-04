import pypandoc

input_html = "project-documentation/Chapter-1-SPMP.html"
output_docx = "project-documentation/Chapter-1-SPMP.docx"

output = pypandoc.convert_file(input_html, 'docx', outputfile=output_docx)
print(f"Converted {input_html} to {output_docx} using Pandoc.")
