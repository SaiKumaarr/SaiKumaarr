# Resume Format Converter

This repository contains a lightweight web application that converts resumes
written in a custom plain-text structure into a LaTeX document and a ready to
download PDF. Up to five resumes can be processed in a single batch.

## Features

- Upload between one and five files at a time
- Parse the custom resume layout into structured data
- Generate LaTeX source code from the parsed resume
- Produce a PDF summary using [jsPDF](https://github.com/parallax/jsPDF)
- Offer download buttons for both the `.tex` and `.pdf` files
- Provide a sample resume template for quick getting started

## Getting started

1. Open `public/index.html` in your browser. No build step is necessary.
2. Click **Download sample format** to grab the example `.txt` file and update it
   with your information, or write your own file following the same structure.
3. Use the upload area to select up to five resume files. Each file is processed
   instantly in your browser.
4. For every resume a LaTeX preview is displayed. Use the buttons to download the
   `.tex` source or the generated PDF snapshot.

## Custom resume format

The converter expects resumes to follow a straightforward plain-text structure:

```
Name: Ada Lovelace
Email: ada@example.com
Phone: +44 0000 0000
Summary:
- Mathematician and writer with a passion for computation.
Experience:
* Analytical Engines Ltd | Consultant | 1843-1845
Education:
* University of London | Mathematics | 1835
Skills:
- Analytical Thinking
- Programming Languages: Sketching Engines
```

Headings end with a colon, and list items begin with `-` or `*`. The Experience
and Education sections accept pipe-separated details in the order
`Organisation | Role | Duration`.

## Notes

- All processing happens client-side. The resumes you upload never leave your
  browser.
- The generated LaTeX document uses a compact article layout for easy editing in
  any TeX editor.
- The PDF snapshot is produced by jsPDF and aims to offer a quick visual export.
  If you need a fully typeset LaTeX PDF you can compile the downloaded `.tex`
  file using your preferred LaTeX toolchain.
