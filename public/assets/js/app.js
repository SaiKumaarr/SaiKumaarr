const fileInput = document.getElementById('resume-files');
const resultsContainer = document.getElementById('results');
const feedback = document.getElementById('upload-feedback');
const downloadSampleButton = document.getElementById('download-sample');
const resultTemplate = document.getElementById('result-template');

const SAMPLE_CONTENT = `Name: Ada Lovelace\nEmail: ada@example.com\nPhone: +44 0000 0000\nSummary:\n- Mathematician and writer with a passion for computation.\nExperience:\n* Analytical Engines Ltd | Consultant | 1843-1845\nEducation:\n* University of London | Mathematics | 1835\nSkills:\n- Analytical Thinking\n- Programming Languages: Sketching Engines\n`;

const SECTION_KEYS = {
  Summary: 'summary',
  Experience: 'experience',
  Education: 'education',
  Skills: 'skills',
  Projects: 'projects',
  Certifications: 'certifications',
};

function escapeLatex(value = '') {
  return value
    .replace(/\\/g, '\\textbackslash ')
    .replace(/([#%&$~_{}^])/g, '\\$1')
    .replace(/\u2013|\u2014/g, '--');
}

function parseResume(text) {
  const resume = {
    name: '',
    email: '',
    phone: '',
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };

  const lines = text.split(/\r?\n/);
  let currentSection = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const keyMatch = line.match(/^(\w[\w\s]+?):\s*(.*)$/);
    if (keyMatch && SECTION_KEYS[keyMatch[1]]) {
      currentSection = SECTION_KEYS[keyMatch[1]];
      if (keyMatch[2]) {
        resume[currentSection].push(keyMatch[2]);
      }
      continue;
    }

    switch (true) {
      case /^Name:\s*/i.test(line):
        resume.name = line.replace(/^Name:\s*/i, '');
        break;
      case /^Email:\s*/i.test(line):
        resume.email = line.replace(/^Email:\s*/i, '');
        break;
      case /^Phone:\s*/i.test(line):
        resume.phone = line.replace(/^Phone:\s*/i, '');
        break;
      case /^[*-]\s+/.test(line):
        if (currentSection) {
          resume[currentSection].push(line.replace(/^[*-]\s+/, ''));
        }
        break;
      default:
        if (currentSection) {
          resume[currentSection].push(line);
        }
    }
  }

  return resume;
}

function buildLatex(resume) {
  const lines = [];
  lines.push('\\documentclass[11pt]{article}');
  lines.push('\\usepackage[margin=1in]{geometry}');
  lines.push('\\usepackage{enumitem}');
  lines.push('\\usepackage{hyperref}');
  lines.push('\\begin{document}');
  lines.push(`\\begin{center}`);
  lines.push(`  {\\LARGE ${escapeLatex(resume.name)} \\}`);
  lines.push(`  \\vspace{0.25cm}`);
  const contactParts = [resume.email && `\\href{mailto:${resume.email}}{${escapeLatex(resume.email)}}`, resume.phone && escapeLatex(resume.phone)]
    .filter(Boolean)
    .join(' $\mid$ ');
  if (contactParts) {
    lines.push(`  ${contactParts}`);
  }
  lines.push('\\end{center}');
  lines.push('\\vspace{0.5cm}');

  function renderBulletSection(title, items) {
    if (!items.length) return;
    lines.push(`\\section*{${title}}`);
    lines.push('\\begin{itemize}[leftmargin=*]');
    items.forEach((item) => lines.push(`  \\item ${escapeLatex(item)}`));
    lines.push('\\end{itemize}');
  }

  function renderExperienceSection(items) {
    if (!items.length) return;
    lines.push('\\section*{Experience}');
    items.forEach((item) => {
      const parts = item.split('|').map((part) => escapeLatex(part.trim()));
      const [company = '', role = '', dates = ''] = parts;
      lines.push('\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}');
      lines.push(`  \\textbf{${company}} & ${dates} \\`);
      if (role) {
        lines.push(`  ${role} \\`);
      }
      lines.push('\\end{tabular*}');
      lines.push('\\vspace{0.2cm}');
    });
  }

  function renderEducationSection(items) {
    if (!items.length) return;
    lines.push('\\section*{Education}');
    items.forEach((item) => {
      const parts = item.split('|').map((part) => escapeLatex(part.trim()));
      const [institution = '', degree = '', year = ''] = parts;
      lines.push('\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}');
      lines.push(`  \\textbf{${institution}} & ${year} \\`);
      if (degree) {
        lines.push(`  ${degree} \\`);
      }
      lines.push('\\end{tabular*}');
      lines.push('\\vspace{0.2cm}');
    });
  }

  renderBulletSection('Summary', resume.summary);
  renderExperienceSection(resume.experience);
  renderEducationSection(resume.education);
  renderBulletSection('Skills', resume.skills);
  renderBulletSection('Projects', resume.projects);
  renderBulletSection('Certifications', resume.certifications);

  lines.push('\\end{document}');
  return lines.join('\n');
}

function createPdf(resume) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 54;
  const lineHeight = 16;
  let cursorY = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(resume.name || 'Unnamed Candidate', margin, cursorY);
  cursorY += lineHeight;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const contact = [resume.email, resume.phone].filter(Boolean).join(' | ');
  if (contact) {
    doc.text(contact, margin, cursorY);
    cursorY += lineHeight;
  }

  const sections = [
    ['Summary', resume.summary],
    ['Experience', resume.experience],
    ['Education', resume.education],
    ['Skills', resume.skills],
    ['Projects', resume.projects],
    ['Certifications', resume.certifications],
  ];

  sections.forEach(([title, items]) => {
    if (!items.length) return;
    cursorY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(title, margin, cursorY);
    cursorY += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    items.forEach((item) => {
      const text = item.replace(/\s+/g, ' ');
      const lines = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - margin * 2);
      lines.forEach((line) => {
        if (cursorY + lineHeight > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });
    });
  });

  const pdfName = `${sanitizeFileName(resume.name || 'resume')}.pdf`;
  doc.save(pdfName);
}

function sanitizeFileName(name) {
  return name.replace(/[^a-z0-9\-]+/gi, '_').toLowerCase();
}

function downloadLatex(name, latexSource) {
  const blob = new Blob([latexSource], { type: 'application/x-tex' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFileName(name || 'resume')}.tex`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function handleFiles(files) {
  if (!files.length) {
    feedback.textContent = 'No files selected.';
    return;
  }

  if (files.length > 5) {
    feedback.textContent = 'Please upload no more than five resumes at a time.';
    return;
  }

  resultsContainer.innerHTML = '';
  feedback.textContent = 'Processing resumes…';

  const readPromises = Array.from(files).map((file) =>
    file.text().then((content) => ({ file, content })).catch((error) => ({ file, error }))
  );

  const parsed = await Promise.all(readPromises);
  let successCount = 0;

  parsed.forEach(({ file, content, error }) => {
    const card = resultTemplate.content.firstElementChild.cloneNode(true);
    const title = card.querySelector('h3');
    const status = card.querySelector('.result-card__status');
    const latexOutput = card.querySelector('.latex-output');
    const texButton = card.querySelector('.download-tex');
    const pdfButton = card.querySelector('.download-pdf');

    title.textContent = file.name;

    if (error) {
      status.textContent = 'Failed to read file';
      latexOutput.value = error.message;
      texButton.disabled = true;
      pdfButton.disabled = true;
      resultsContainer.appendChild(card);
      return;
    }

    const resume = parseResume(content);
    const latex = buildLatex(resume);
    latexOutput.value = latex;
    status.textContent = 'Ready to download';

    texButton.addEventListener('click', () => downloadLatex(resume.name || file.name, latex));
    pdfButton.addEventListener('click', () => createPdf(resume));

    resultsContainer.appendChild(card);
    successCount += 1;
  });

  feedback.textContent = `Converted ${successCount} of ${parsed.length} resume(s).`;
}

fileInput.addEventListener('change', (event) => {
  handleFiles(event.target.files);
});

downloadSampleButton.addEventListener('click', () => {
  const blob = new Blob([SAMPLE_CONTENT], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resume-sample.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// Allow dropping files on the label area for convenience.
const fileDrop = document.querySelector('.file-drop');

fileDrop.addEventListener('dragover', (event) => {
  event.preventDefault();
  fileDrop.classList.add('file-drop--dragging');
});

fileDrop.addEventListener('dragleave', () => {
  fileDrop.classList.remove('file-drop--dragging');
});

fileDrop.addEventListener('drop', (event) => {
  event.preventDefault();
  fileDrop.classList.remove('file-drop--dragging');
  if (event.dataTransfer?.files) {
    const incomingFiles = Array.from(event.dataTransfer.files).slice(0, 5);
    const transfer = new DataTransfer();
    incomingFiles.forEach((file) => transfer.items.add(file));
    fileInput.files = transfer.files;
    handleFiles(transfer.files);
  }
});
