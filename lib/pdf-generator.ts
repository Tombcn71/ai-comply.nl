import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DossierData } from '@/app/actions/dossier';

const BRAND_COLOR = '#1a3a52'; // Donkerblauw
const BRAND_LIGHT = '#2d5a7b'; // Lichter blauw
const ACCENT_COLOR = '#0ea5e9'; // Accent
const TEXT_COLOR = '#1f2937'; // Donkergrijs
const BORDER_COLOR = '#e5e7eb'; // Lichtgrijs

/**
 * Generate a PDF dossier from collected data
 */
export function generateDossierPDF(data: DossierData): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Helper function to add footer with page number and hash
  const addFooter = (pageNumber: number, totalPages: number) => {
    const footerY = pageHeight - 10;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${pageNumber}/${totalPages} | Hash: ${generateHash(data.timestamp)}`,
      margin,
      footerY
    );
  };

  // PAGE 1: COVER PAGE
  doc.setFillColor(26, 58, 82); // Brand color
  doc.rect(0, 0, pageWidth, 80, 'F');

  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('AI-Verordening', margin, 30);
  doc.text('Compliance Dossier', margin, 45);

  doc.setFontSize(11);
  doc.setTextColor(200, 200, 200);
  doc.text('Officieel Nalevingsdocument', margin, 62);

  // Company info and date
  doc.setFontSize(11);
  doc.setTextColor(TEXT_COLOR);
  yPosition = 100;
  doc.text('Gegenereerd op:', margin, yPosition);
  doc.setFont(undefined, 'bold');
  doc.text(data.timestamp, margin + 40, yPosition);

  yPosition += 15;
  doc.setFont(undefined, 'normal');
  doc.text('Bedrijf:', margin, yPosition);
  doc.setFont(undefined, 'bold');
  doc.text('AI Comply', margin + 40, yPosition);

  yPosition += 15;
  doc.setFont(undefined, 'normal');
  doc.text('Rapportage Type:', margin, yPosition);
  doc.setFont(undefined, 'bold');
  doc.text('Volledige Compliance Audit', margin + 40, yPosition);

  yPosition += 25;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  const sampleText =
    'Dit dossier bevat een volledige inventarisatie van geregistreerde AI-systemen, ' +
    'bewijs van medewerkers-training en audit trails conform de Europese AI Act.';
  doc.setFont(undefined, 'normal');
  doc.text(sampleText, margin, yPosition, { maxWidth: pageWidth - 2 * margin });

  doc.addPage();
  yPosition = margin;

  // PAGE 2: SUMMARY & AI-REGISTER
  doc.setFontSize(16);
  doc.setTextColor(26, 58, 82);
  doc.setFont(undefined, 'bold');
  doc.text('Samenvatting', margin, yPosition);

  yPosition += 12;
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  doc.setFont(undefined, 'normal');

  const summaryBoxY = yPosition;
  doc.setDrawColor(BORDER_COLOR);
  doc.setLineWidth(0.5);
  doc.rect(margin, summaryBoxY, pageWidth - 2 * margin, 35);

  doc.text(`Totaal AI-systemen geregistreerd: ${data.totals.totalTools}`, margin + 5, summaryBoxY + 8);
  doc.text(
    `Systemen in naleving: ${data.totals.compliantTools}/${data.totals.totalTools}`,
    margin + 5,
    summaryBoxY + 16
  );
  doc.text(
    `Medewerkers getraind: ${data.totals.certifiedEmployees}/${data.totals.totalEmployees}`,
    margin + 5,
    summaryBoxY + 24
  );
  doc.text(
    `Compliance percentage: ${Math.round((data.totals.compliantTools / data.totals.totalTools) * 100)}%`,
    margin + 5,
    summaryBoxY + 32
  );

  yPosition = summaryBoxY + 45;

  // AI-TOOLS TABLE
  doc.setFontSize(14);
  doc.setTextColor(26, 58, 82);
  doc.setFont(undefined, 'bold');
  doc.text('Sectie 1: AI-Systeem Register', margin, yPosition);

  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [['Systeem Naam', 'Afdeling', 'Risico', 'Status']],
    body: data.tools.map((tool) => [
      tool.name,
      tool.department,
      tool.risk,
      tool.is_compliant ? '✓ Conform' : '✗ Niet conform',
    ]),
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: BRAND_COLOR,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      textColor: TEXT_COLOR,
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: '#f9fafb',
    },
    borderColor: BORDER_COLOR,
    lineWidth: 0.3,
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  // AI-GELETTERDHEID SECTION
  doc.setFontSize(14);
  doc.setTextColor(26, 58, 82);
  doc.setFont(undefined, 'bold');
  doc.text('Sectie 2: AI-Geletterdheid Training', margin, yPosition);

  yPosition += 10;

  // Training summary
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  doc.setFont(undefined, 'normal');
  doc.text(
    `Totaal medewerkers: ${data.totals.totalEmployees} | Getraind: ${data.totals.certifiedEmployees}`,
    margin,
    yPosition
  );

  yPosition += 8;

  // Certified employees table
  const certifiedEmployees = data.employees.filter((e) => e.status === 'certified');
  if (certifiedEmployees.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [['Naam', 'Afdeling', 'Certificering Datum']],
      body: certifiedEmployees.map((emp) => [
        emp.name,
        emp.department,
        emp.certified_date
          ? new Date(emp.certified_date).toLocaleDateString('nl-NL')
          : '—',
      ]),
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: BRAND_COLOR,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        textColor: TEXT_COLOR,
        fontSize: 9,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: '#f9fafb',
      },
      borderColor: BORDER_COLOR,
      lineWidth: 0.3,
    });
  }

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page for audit trail
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // AUDIT TRAIL SECTION
  doc.setFontSize(14);
  doc.setTextColor(26, 58, 82);
  doc.setFont(undefined, 'bold');
  doc.text('Sectie 3: Audit Trail', margin, yPosition);

  yPosition += 10;

  doc.setFontSize(9);
  doc.setTextColor(TEXT_COLOR);
  doc.setFont(undefined, 'normal');

  const auditBoxY = yPosition;
  doc.setDrawColor(ACCENT_COLOR);
  doc.setLineWidth(0.5);
  doc.rect(margin, auditBoxY, pageWidth - 2 * margin, 20);

  doc.text(`Gegenereerd: ${data.timestamp}`, margin + 5, auditBoxY + 7);
  doc.text(`Dossier ID: ${generateHash(data.timestamp)}`, margin + 5, auditBoxY + 14);

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  return doc.output('blob');
}

/**
 * Generate a simple hash for audit trails
 */
function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 12).toUpperCase();
}

/**
 * Trigger PDF download
 */
export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
