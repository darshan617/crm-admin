const PAGE_W = 841.89;
const PAGE_H = 595.28;
const MARGIN = 34;
const ROW_H = 16.55;

const BLUE = "0.01 0.33 0.67";
const TITLE = "0.106 0.141 0.188";
const MUTED = "0.545 0.576 0.631";
const BORDER = "0.93 0.95 0.96";
const ROW = "0.98 0.98 0.99";
const WHITE = "1 1 1";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SUMMARY_ROWS = [
  ["Total Sales", "totalSales"],
  ["Won Deals", "wonDeals"],
  ["Win Rate", "winRate"],
  ["Pipeline Value", "pipelineValue"],
  ["Target Achievement", "targetAchievement"],
];

const BUSINESS_ROWS = [
  ["Total Revenue", "yearRevenue"],
  ["Won Deals", "wonDeals"],
  ["Lost Deals", "lostDeals"],
  ["Pipeline Value", "pipelineValue"],
  ["Expected Revenue", "expectedRevenue"],
  ["Win Rate", "winRate"],
];

const EMPLOYEE_COLUMNS = [
  { label: "Employee", weight: 1.6, value: (row) => row.name },
  { label: "Role", weight: 1.2, value: (row) => row.role },
  { label: "Leads", weight: 0.7, value: (row) => row.leads },
  { label: "Calls", weight: 0.7, value: (row) => row.calls },
  { label: "Follow-ups", weight: 0.9, value: (row) => row.followups },
  { label: "Opportunities", weight: 1.1, value: (row) => row.opps },
  { label: "Won Deals", weight: 0.9, value: (row) => row.won },
  { label: "Revenue", weight: 1, value: (row) => row.revenue },
  { label: "Conv %", weight: 0.7, value: (row) => row.conv },
];

const ascii = (value) =>
  String(value ?? "—")
    .replace(/₹/g, "Rs. ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim() || "—";

const escapePdf = (value) =>
  ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const textWidth = (value, size) => {
  let width = 0;
  for (const char of ascii(value)) {
    if (char === " " || "il.,'".includes(char)) width += 0.28;
    else if ("mwMW@%".includes(char)) width += 0.78;
    else width += 0.52;
  }
  return width * size;
};

const fitText = (value, size, maxWidth) => {
  let text = ascii(value);
  if (textWidth(text, size) <= maxWidth) return text;
  while (text.length > 1 && textWidth(`${text}...`, size) > maxWidth) {
    text = text.slice(0, -1);
  }
  return `${text}...`;
};

const formatDate = (iso) => {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]} ${year}`;
};

const rangeLabel = (from, to) => {
  if (from && to) return `${formatDate(from)} to ${formatDate(to)}`;
  if (from) return `From ${formatDate(from)}`;
  if (to) return `Until ${formatDate(to)}`;
  return "Organization-wide sales and pipeline snapshot";
};

const columnWidths = (columns, total) => {
  const weight = columns.reduce((sum, column) => sum + column.weight, 0);
  return columns.map((column) => (total * column.weight) / weight);
};

class PdfDoc {
  constructor() {
    this.pages = [];
    this.commands = "";
    this.y = 34;
  }

  add(command) {
    this.commands += command;
  }

  breakPage() {
    if (this.commands) this.pages.push(this.commands);
    this.commands = "";
    this.y = 34;
  }

  ensure(height) {
    if (this.y + height > PAGE_H - 28) this.breakPage();
  }

  text(x, baseline, size, font, color, value) {
    this.add(
      `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${(PAGE_H - baseline).toFixed(2)} Tm (${escapePdf(value)}) Tj ET\n`,
    );
  }

  rect(x, top, width, height, fill) {
    const y = PAGE_H - top - height;
    this.add(
      `${fill} rg ${BORDER} RG 0.57 w ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re B\n`,
    );
  }

  heading(title, subtitle) {
    this.text(MARGIN, this.y + 12, 16, "F2", TITLE, title);
    this.y += 28;
    this.text(MARGIN, this.y + 8, 10, "F1", MUTED, subtitle);
    this.y += 22;
  }

  section(title) {
    this.ensure(36 + ROW_H);
    this.y += 10;
    this.text(MARGIN, this.y + 11, 13, "F2", TITLE, title);
    this.y += 20;
  }

  table(columns, rows) {
    const width = PAGE_W - MARGIN * 2;
    const widths = columnWidths(columns, width);
    const drawHeader = () => {
      this.ensure(ROW_H);
      let x = MARGIN;
      columns.forEach((column, index) => {
        this.rect(x, this.y, widths[index], ROW_H, BLUE);
        const label = fitText(column.label, 7, widths[index] - 8);
        const labelX = x + (widths[index] - textWidth(label, 7)) / 2;
        this.text(labelX, this.y + 11, 7, "F2", WHITE, label);
        x += widths[index];
      });
      this.y += ROW_H;
    };

    drawHeader();
    const body = rows.length
      ? rows
      : [columns.map((_, index) => (index === 0 ? "No records" : "—"))];
    body.forEach((row) => {
      if (this.y + ROW_H > PAGE_H - 28) drawHeader();
      let x = MARGIN;
      columns.forEach((column, index) => {
        const raw = Array.isArray(row) ? row[index] : column.value(row);
        this.rect(x, this.y, widths[index], ROW_H, ROW);
        const label = fitText(raw, 7, widths[index] - 8);
        this.text(x + 4, this.y + 11, 7, "F1", TITLE, label);
        x += widths[index];
      });
      this.y += ROW_H;
    });
  }

  bars(months) {
    const chartH = 92;
    const labelH = 14;
    this.ensure(chartH + labelH + 6);
    const width = PAGE_W - MARGIN * 2;
    const gap = 10;
    const count = months.length;
    const barW = Math.min(26, (width - gap * Math.max(0, count - 1)) / count);
    const totalW = count * barW + gap * Math.max(0, count - 1);
    const startX = MARGIN + (width - totalW) / 2;
    const max = Math.max(1, ...months.map((month) => Number(month.h) || 0));
    const base = this.y + chartH;

    months.forEach((month, index) => {
      const value = Number(month.h) || 0;
      const height = Math.max(value > 0 ? 3 : 0, (value / max) * (chartH - 6));
      const x = startX + index * (barW + gap);
      if (height > 0) this.rect(x, base - height, barW, height, BLUE);
      const label = fitText(month.label, 8, barW + gap - 2);
      this.text(
        x + (barW - textWidth(label, 8)) / 2,
        base + 11,
        8,
        "F1",
        MUTED,
        label,
      );
    });

    this.y = base + labelH;
  }

  toBytes() {
    if (this.commands) this.pages.push(this.commands);
    this.commands = "";
    return buildPdf(this.pages);
  }
}

const buildPdf = (pages) => {
  const objects = ["1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj"];
  const pageIds = pages.map((_, index) => 3 + index * 2);
  const fontRegular = 3 + pages.length * 2;
  const fontBold = fontRegular + 1;
  objects.push(
    `2 0 obj << /Type /Pages /Count ${pages.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >> endobj`,
  );

  pages.forEach((content, index) => {
    const pageId = pageIds[index];
    const contentId = pageId + 1;
    objects.push(
      `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> >> endobj`,
    );
    objects.push(
      `${contentId} 0 obj << /Length ${content.length} >>\nstream\n${content}endstream endobj`,
    );
  });

  objects.push(
    `${fontRegular} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj`,
  );
  objects.push(
    `${fontBold} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj`,
  );

  let body = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((object) => {
    offsets.push(body.length);
    body += `${object}\n`;
  });
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  offsets.forEach((offset) => {
    body += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return body;
};

const metricRows = (fields, data) =>
  fields.map(([label, key]) => [label, data?.[key] ?? "—"]);

export const createReportPdf = ({ data = {}, from = "", to = "" }) => {
  const year = (to || from || "").slice(0, 4);
  const doc = new PdfDoc();
  doc.heading(
    year ? `PERFORMANCE REPORT (${year})` : "PERFORMANCE REPORT",
    rangeLabel(from, to),
  );

  doc.section("Summary");
  doc.table(
    [
      { label: "Metric", weight: 2 },
      { label: "Value", weight: 1 },
    ],
    metricRows(SUMMARY_ROWS, data),
  );

  doc.section("Business Performance");
  doc.table(
    [
      { label: "Metric", weight: 2 },
      { label: "Value", weight: 1 },
    ],
    metricRows(BUSINESS_ROWS, data),
  );

  const months = data.months ?? [];
  if (months.length) {
    doc.section("Monthly Activity");
    doc.bars(months);
  }

  doc.section("Employee Performance");
  doc.table(EMPLOYEE_COLUMNS, data.employees ?? []);

  const insights = data.insights ?? [];
  if (insights.length) {
    doc.section("Quick Insights");
    doc.table(
      [
        { label: "Insight", weight: 1.4, value: (row) => row.label },
        { label: "Value", weight: 0.8, value: (row) => row.value },
        { label: "Detail", weight: 1.6, value: (row) => row.meta },
      ],
      insights,
    );
  }

  const forecast = data.forecast ?? [];
  if (forecast.length) {
    doc.section("Sales Forecast");
    doc.table(
      [
        { label: "Stage", weight: 1.4, value: (row) => row.label },
        { label: "Value", weight: 0.8, value: (row) => row.value },
        {
          label: "Share",
          weight: 0.6,
          value: (row) =>
            row.pct == null || row.pct === "" ? "—" : `${row.pct}%`,
        },
      ],
      forecast,
    );
  }

  return doc.toBytes();
};

export const downloadReportPdf = ({ data = {}, from = "", to = "" }) => {
  const body = createReportPdf({ data, from, to });
  const stamp = (to || from).replace(/[^\d-]/g, "");
  const url = URL.createObjectURL(new Blob([body], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = stamp
    ? `performance-report-${stamp}.pdf`
    : "performance-report.pdf";
  link.click();
  URL.revokeObjectURL(url);
};
