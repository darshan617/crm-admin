import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiArrowLeft, FiDownload, FiFileText } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import styles from "@/components/reports/report-category/report-detail/ReportDetail.module.css";
import { useReportDetailQuery } from "@/redux/apis/reportsApi";

const REPORTS = {
  sales: "Sales Performance",
  pipeline: "Pipeline",
  won: "Won Deals",
  lost: "Lost Deals",
  leads: "Lead Performance",
  sources: "Lead Sources",
  conversion: "Conversion",
  unassigned: "Unassigned Leads",
  deals: "Deals",
  "deals-month": "Deals This Month",
  "deals-quarter": "Deals This Quarter",
  quotations: "Quotations",
  sent: "Sent Quotations",
  discounted: "Discounted Quotations",
  renewals: "Renewals",
  scheduled: "Scheduled Activities",
  overdue: "Overdue Activities",
  activities: "Activities",
};

const HIDDEN_KEYS = new Set([
  "id",
  "_id",
  "uuid",
  "href",
  "url",
  "link",
  "slug",
]);

const AMOUNT_LABEL = /amount|revenue|value|total/i;
const LABEL_COLUMN = /quotation|name|customer|title|source|label/i;

const BAR_COLOR = "#0354ab";

const humanize = (key) =>
  String(key)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const isRecord = (value) =>
  value != null && typeof value === "object" && !Array.isArray(value);

const normalizeReport = (payload) => {
  const data = payload?.data ?? payload ?? {};
  const source = Array.isArray(data) ? { rows: data } : data;
  const rawRows =
    source.rows ?? source.records ?? source.items ?? source.report ?? [];
  const rows = Array.isArray(rawRows) ? rawRows : [];
  const rawColumns = source.columns ?? source.headers ?? source.fields;

  const rowsAreArrays = rows.some(Array.isArray);
  let columns = [];
  if (Array.isArray(rawColumns) && rawColumns.length) {
    const sample = rows.find((row) => isRecord(row));
    const keys = sample ? Object.keys(sample) : [];
    columns = rawColumns.map((column, index) => {
      if (typeof column === "string") {
        const key = rowsAreArrays
          ? index
          : keys.includes(column)
            ? column
            : (keys[index] ?? index);
        return { key, label: column };
      }
      const key =
        column.key ?? column.name ?? column.field ?? column.id ?? index;
      return {
        key,
        label: column.label ?? column.title ?? column.header ?? humanize(key),
      };
    });
  } else if (rowsAreArrays) {
    const width = Math.max(
      ...rows.map((row) => (Array.isArray(row) ? row.length : 0)),
    );
    columns = Array.from({ length: width }, (_, index) => ({
      key: index,
      label: `Column ${index + 1}`,
    }));
  } else {
    const keys = [];
    rows.forEach((row) => {
      if (!isRecord(row)) return;
      Object.keys(row).forEach((key) => {
        if (!HIDDEN_KEYS.has(key) && !keys.includes(key)) keys.push(key);
      });
    });
    columns = keys.map((key) => ({ key, label: humanize(key) }));
  }

  const count = Number(source.count);

  return {
    title: source.title ?? source.name ?? null,
    count: Number.isFinite(count) ? count : rows.length,
    rows,
    columns,
  };
};

const readCell = (row, key) => (Array.isArray(row) ? row[key] : row?.[key]);

const plainText = (value) => {
  if (value == null || value === "") return "";
  if (typeof value === "number") return value.toLocaleString("en-IN");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (isRecord(value)) {
    return String(value.label ?? value.text ?? value.name ?? value.value ?? "");
  }
  return String(value);
};

const AMOUNT_UNITS = {
  k: 1000,
  l: 100000,
  lac: 100000,
  lakh: 100000,
  cr: 10000000,
  crore: 10000000,
};

const parseAmount = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = plainText(value).replace(/[₹,\s]/g, "");
  const match = text.match(/^(-?\d+(?:\.\d+)?)(k|l|lac|lakh|cr|crore)?$/i);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return null;
  return amount * (AMOUNT_UNITS[match[2]?.toLowerCase()] || 1);
};

const toLocalHref = (href) => {
  if (!href) return null;
  let path = href;
  try {
    path = href.startsWith("http") ? new URL(href).pathname : href;
  } catch {
    return null;
  }

  const parts = path.split("/").filter(Boolean);
  const start = parts[0] === "crm" ? 1 : 0;
  const resource = parts[start];
  const id = parts[start + 1];
  if (!resource || !id) return null;

  if (resource === "quotations") return `/quotations/quotation-detail/${id}`;
  if (resource === "leads") return `/leads/leads-details/${id}`;
  if (resource === "deals") return `/crm-deals/${id}`;
  if (resource === "reports") return `/reports/${id}`;
  if (resource === "employees")
    return `/manage/employee/employee-details/${id}`;
  if (
    resource === "follow-ups" ||
    resource === "follow-up" ||
    resource === "activities"
  ) {
    return `/follow-up/follow-up-details?id=${encodeURIComponent(id)}`;
  }
  return null;
};

const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const formatAxis = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `₹${Math.round(value / 1000)}k`;
  return `₹${value}`;
};

const chartSeries = (rows, columns) => {
  const valueColumn =
    columns.find((column) => AMOUNT_LABEL.test(column.label)) ??
    columns.find((column) =>
      rows.some((row) => parseAmount(readCell(row, column.key)) != null),
    );
  if (!valueColumn) return { points: [], money: false };

  const labelColumn =
    columns.find(
      (column) =>
        column.key !== valueColumn.key && LABEL_COLUMN.test(column.label),
    ) ?? columns.find((column) => column.key !== valueColumn.key);
  const customerColumn = columns.find((column) =>
    /customer/i.test(column.label),
  );
  const money =
    AMOUNT_LABEL.test(valueColumn.label) ||
    rows.some((row) => /₹/.test(plainText(readCell(row, valueColumn.key))));

  const points = rows
    .map((row, index) => {
      const cell = readCell(row, valueColumn.key);
      const amount = parseAmount(cell);
      if (amount == null) return null;
      return {
        label: plainText(readCell(row, labelColumn?.key)) || `Row ${index + 1}`,
        amount,
        display: plainText(cell),
        customer: plainText(readCell(row, customerColumn?.key)),
      };
    })
    .filter(Boolean);

  return { points, money };
};

const cellHref = (value) => {
  if (!isRecord(value)) return null;
  return toLocalHref(value.href || value.url);
};

const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const CRC_TABLE = new Uint32Array(256);
for (let index = 0; index < 256; index += 1) {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  CRC_TABLE[index] = value >>> 0;
}

const crc32 = (bytes) => {
  let value = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    value = CRC_TABLE[(value ^ bytes[index]) & 0xff] ^ (value >>> 8);
  }
  return (value ^ 0xffffffff) >>> 0;
};

const concatBytes = (parts) => {
  const size = parts.reduce((total, part) => total + part.length, 0);
  const bytes = new Uint8Array(size);
  let offset = 0;
  parts.forEach((part) => {
    bytes.set(part, offset);
    offset += part.length;
  });
  return bytes;
};

const u16 = (value) => {
  const bytes = new Uint8Array(2);
  new DataView(bytes.buffer).setUint16(0, value, true);
  return bytes;
};

const u32 = (value) => {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value, true);
  return bytes;
};

const zipStore = (files) => {
  const encoder = new TextEncoder();
  const locals = [];
  const centrals = [];
  let offset = 0;

  files.forEach((file) => {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.text);
    const crc = crc32(data);
    const local = concatBytes([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      name,
      data,
    ]);
    centrals.push(
      concatBytes([
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(name.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        name,
      ]),
    );
    locals.push(local);
    offset += local.length;
  });

  const directory = concatBytes(centrals);
  return concatBytes([
    ...locals,
    directory,
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(directory.length),
    u32(offset),
    u16(0),
  ]);
};

const columnLetter = (index) => {
  let number = index + 1;
  let letter = "";
  while (number > 0) {
    const remainder = (number - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    number = Math.floor((number - 1) / 26);
  }
  return letter;
};

const xmlText = (value) =>
  String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildXlsx = (columns, rows) => {
  const sheetColumns = columns.length ? columns : [{ key: 0, label: "Record" }];
  const header = sheetColumns
    .map((column, index) => {
      const ref = `${columnLetter(index)}1`;
      return `<c r="${ref}" s="1" t="inlineStr"><is><t>${xmlText(column.label)}</t></is></c>`;
    })
    .join("");
  const body = rows
    .map((row, rowIndex) => {
      const cells = sheetColumns
        .map((column, index) => {
          const ref = `${columnLetter(index)}${rowIndex + 2}`;
          const text = xmlText(plainText(readCell(row, column.key)));
          return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${text}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowIndex + 2}">${cells}</row>`;
    })
    .join("");
  const widths = sheetColumns
    .map((column, index) => {
      const width = Math.min(42, Math.max(14, column.label.length + 6));
      return `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`;
    })
    .join("");

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<cols>${widths}</cols>
<sheetData><row r="1">${header}</row>${body}</sheetData>
</worksheet>`;

  return zipStore([
    {
      name: "[Content_Types].xml",
      text: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
    },
    {
      name: "_rels/.rels",
      text: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      text: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Report" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      text: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    },
    {
      name: "xl/styles.xml",
      text: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF0354AB"/></patternFill></fill>
</fills>
<borders count="1"><border><left/><right/><top/><bottom/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
</cellXfs>
</styleSheet>`,
    },
    { name: "xl/worksheets/sheet1.xml", text: sheet },
  ]);
};

const exportXlsx = (columns, rows, filename) => {
  downloadFile(
    new Blob([buildXlsx(columns, rows)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename,
  );
};

const PDF_W = 841.89;
const PDF_H = 595.28;
const PDF_MARGIN = 34;
const PDF_ROW_H = 16.55;
const PDF_BLUE = "0.01 0.33 0.67";
const PDF_TITLE = "0.106 0.141 0.188";
const PDF_MUTED = "0.545 0.576 0.631";
const PDF_BORDER = "0.93 0.95 0.96";
const PDF_ROW = "0.98 0.98 0.99";

const pdfAscii = (value) =>
  String(value ?? "—")
    .replace(/₹/g, "Rs. ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim() || "—";

const pdfEscape = (value) =>
  pdfAscii(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const pdfTextWidth = (value, size) => {
  let width = 0;
  for (const char of pdfAscii(value)) {
    if (char === " " || "il.,'".includes(char)) width += 0.28;
    else if ("mwMW@%".includes(char)) width += 0.78;
    else width += 0.52;
  }
  return width * size;
};

const pdfFit = (value, size, maxWidth) => {
  let text = pdfAscii(value);
  if (pdfTextWidth(text, size) <= maxWidth) return text;
  while (text.length > 1 && pdfTextWidth(`${text}...`, size) > maxWidth) {
    text = text.slice(0, -1);
  }
  return `${text}...`;
};

class ReportPdf {
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
    if (this.y + height > PDF_H - 28) this.breakPage();
  }

  text(x, baseline, size, font, color, value) {
    this.add(
      `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${(PDF_H - baseline).toFixed(2)} Tm (${pdfEscape(value)}) Tj ET\n`,
    );
  }

  rect(x, top, width, height, fill) {
    const y = PDF_H - top - height;
    this.add(
      `${fill} rg ${PDF_BORDER} RG 0.57 w ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re B\n`,
    );
  }

  heading(title, subtitle) {
    this.text(PDF_MARGIN, this.y + 12, 16, "F2", PDF_TITLE, title);
    this.y += 28;
    this.text(PDF_MARGIN, this.y + 8, 10, "F1", PDF_MUTED, subtitle);
    this.y += 22;
  }

  section(title) {
    this.ensure(36 + PDF_ROW_H);
    this.y += 10;
    this.text(PDF_MARGIN, this.y + 11, 13, "F2", PDF_TITLE, title);
    this.y += 20;
  }

  bars(points) {
    const chartH = 150;
    const labelH = 16;
    this.ensure(chartH + labelH + 8);
    const width = PDF_W - PDF_MARGIN * 2;
    const count = points.length;
    const gap = count > 18 ? 3 : 8;
    const barW = Math.min(26, (width - gap * Math.max(0, count - 1)) / count);
    const totalW = count * barW + gap * Math.max(0, count - 1);
    const startX = PDF_MARGIN + (width - totalW) / 2;
    const max = Math.max(
      1,
      ...points.map((point) => Number(point.amount) || 0),
    );
    const base = this.y + chartH;
    const labelStep = Math.ceil(count / 16);
    const slot = width / count;

    points.forEach((point, index) => {
      const value = Number(point.amount) || 0;
      const height = Math.max(value > 0 ? 3 : 0, (value / max) * (chartH - 8));
      const x = startX + index * (barW + gap);
      if (height > 0) this.rect(x, base - height, barW, height, PDF_BLUE);
      if (index % labelStep !== 0) return;
      const label = pdfFit(point.label, 7, Math.max(slot - 6, barW));
      const labelW = pdfTextWidth(label, 7);
      const labelX = Math.min(
        Math.max(PDF_MARGIN, x + (barW - labelW) / 2),
        PDF_W - PDF_MARGIN - labelW,
      );
      this.text(labelX, base + 11, 7, "F1", PDF_MUTED, label);
    });

    this.y = base + labelH;
  }

  table(columns, records) {
    const width = PDF_W - PDF_MARGIN * 2;
    const weight = columns.reduce((sum, column) => sum + column.weight, 0);
    const widths = columns.map((column) => (width * column.weight) / weight);
    const drawHeader = () => {
      this.ensure(PDF_ROW_H);
      let x = PDF_MARGIN;
      columns.forEach((column, index) => {
        this.rect(x, this.y, widths[index], PDF_ROW_H, PDF_BLUE);
        const label = pdfFit(column.label, 7, widths[index] - 8);
        this.text(
          x + (widths[index] - pdfTextWidth(label, 7)) / 2,
          this.y + 11,
          7,
          "F2",
          "1 1 1",
          label,
        );
        x += widths[index];
      });
      this.y += PDF_ROW_H;
    };

    drawHeader();
    const body = records.length
      ? records
      : [columns.map((_, index) => (index === 0 ? "No records" : "—"))];

    body.forEach((record) => {
      if (this.y + PDF_ROW_H > PDF_H - 28) drawHeader();
      let x = PDF_MARGIN;
      columns.forEach((column, index) => {
        const raw = Array.isArray(record)
          ? record[index]
          : column.value(record);
        this.rect(x, this.y, widths[index], PDF_ROW_H, PDF_ROW);
        this.text(
          x + 4,
          this.y + 11,
          7,
          "F1",
          PDF_TITLE,
          pdfFit(raw, 7, widths[index] - 8),
        );
        x += widths[index];
      });
      this.y += PDF_ROW_H;
    });
  }

  toBytes() {
    if (this.commands) this.pages.push(this.commands);
    this.commands = "";
    const objects = ["1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj"];
    const pageIds = this.pages.map((_, index) => 3 + index * 2);
    const fontRegular = 3 + this.pages.length * 2;
    const fontBold = fontRegular + 1;
    objects.push(
      `2 0 obj << /Type /Pages /Count ${this.pages.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >> endobj`,
    );
    this.pages.forEach((content, index) => {
      const pageId = pageIds[index];
      objects.push(
        `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_W} ${PDF_H}] /Contents ${pageId + 1} 0 R /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> >> endobj`,
      );
      objects.push(
        `${pageId + 1} 0 obj << /Length ${content.length} >>\nstream\n${content}endstream endobj`,
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
  }
}

const downloadPdf = (columns, rows, title, filename, chartRows = []) => {
  const pdfColumns = (
    columns.length ? columns : [{ key: 0, label: "Record" }]
  ).map((column) => ({
    label: column.label,
    weight: LABEL_COLUMN.test(column.label) ? 1.6 : 1,
    value: (row) => plainText(readCell(row, column.key)) || "—",
  }));
  const doc = new ReportPdf();
  doc.heading(title, `${rows.length} records`);
  if (chartRows.length) {
    doc.section("Overview");
    doc.bars(chartRows);
  }
  doc.section("Records");
  doc.table(pdfColumns, rows);
  downloadFile(
    new Blob([doc.toBytes()], { type: "application/pdf" }),
    filename,
  );
};

const ReportDetail = () => {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const allowed = Boolean(REPORTS[slug]);
  const { data, isLoading, isError, isFetching } = useReportDetailQuery(slug, {
    skip: !router.isReady || !allowed,
  });

  const report = normalizeReport(data);
  const title = report.title || REPORTS[slug] || "Report";
  const columns = report.columns;
  const rows = report.rows;
  const chart = chartSeries(rows, columns);
  const chartRows = chart.points;
  const showChart = chartRows.length > 0;
  const formatChartValue = chart.money
    ? formatINR
    : (value) => Number(value).toLocaleString("en-IN");
  const formatChartAxis = chart.money
    ? formatAxis
    : (value) => Number(value).toLocaleString("en-IN");
  const waiting =
    !router.isReady || (allowed && (isLoading || isFetching) && !data);

  return (
    <div className={`${styles.crmReportsPage} content`}>
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/dashboard">Dashboard</Link> <span>/</span>{" "}
              <Link href="/reports">Reports</Link> <span>/</span>
            </p>
          </div>
          <h2>{allowed ? title : "Report"}</h2>
        </div>

        <div className="back">
          <button onClick={() => router.back()} className="back-btn">
            <FiArrowLeft size={22} strokeWidth={2.5} aria-hidden="true" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {!allowed && router.isReady && (
        <section className="common-table-section">
          <div className={`common-table-card ${styles.rptCard}`}>
            <div className="common-table-header">
              <p className={styles.rptSub}>This report is not available.</p>
            </div>
          </div>
        </section>
      )}

      {allowed && waiting && (
        <section className="common-table-section">
          <div className={`common-table-card ${styles.rptCard}`}>
            <div className="common-table-header">
              <p className={styles.rptSub}>Loading report…</p>
            </div>
          </div>
        </section>
      )}

      {allowed && isError && (
        <section className="common-table-section">
          <div className={`common-table-card ${styles.rptCard}`}>
            <div className="common-table-header">
              <p className={styles.rptSub}>This report could not be loaded.</p>
            </div>
          </div>
        </section>
      )}

      {allowed && data && !isError && (
        <>
          {showChart && (
            <section className="common-table-section">
              <div className={`common-table-card ${styles.rptCard}`}>
                <div className={`common-table-header ${styles.chartHeader}`}>
                  <div>
                    <h3>{title}</h3>
                    <p className={styles.rptSub}>{report.count} records</p>
                  </div>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.exportBtn}
                      onClick={() =>
                        exportXlsx(columns, rows, `${slug}-report.xlsx`)
                      }
                    >
                      <FiDownload size={14} aria-hidden="true" />
                      Export XLSX
                    </button>
                    <button
                      type="button"
                      className={styles.pdfBtn}
                      onClick={() =>
                        downloadPdf(
                          columns,
                          rows,
                          title,
                          `${slug}-report.pdf`,
                          chartRows,
                        )
                      }
                    >
                      <FiFileText size={14} aria-hidden="true" />
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className={styles.chart}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartRows}
                      margin={{ top: 8, right: 8, left: 8, bottom: 24 }}
                      barCategoryGap="30%"
                    >
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={64}
                        tick={{ fill: "#9aa5bd", fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={52}
                        tickFormatter={formatChartAxis}
                        tick={{ fill: "#9aa5bd", fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(58, 114, 191, 0.06)" }}
                        formatter={(value, _name, item) => [
                          item?.payload?.display || formatChartValue(value),
                          item?.payload?.customer || "Value",
                        ]}
                      />
                      <Bar
                        dataKey="amount"
                        maxBarSize={28}
                        radius={[6, 6, 0, 0]}
                      >
                        {chartRows.map((row, index) => (
                          <Cell
                            key={`${row.label}-${index}`}
                            fill={BAR_COLOR}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          )}

          <section className="common-table-section">
            <div className={`common-table-card ${styles.rptCard}`}>
              <div className={`common-table-header ${styles.chartHeader}`}>
                <div>
                  <h3>{title}</h3>
                  <p className={styles.rptSub}>{report.count} records</p>
                </div>
                {!showChart && (
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.exportBtn}
                      onClick={() =>
                        exportXlsx(columns, rows, `${slug}-report.xlsx`)
                      }
                    >
                      <FiDownload size={14} aria-hidden="true" />
                      Export XLSX
                    </button>
                    <button
                      type="button"
                      className={styles.pdfBtn}
                      onClick={() =>
                        downloadPdf(
                          columns,
                          rows,
                          title,
                          `${slug}-report.pdf`,
                          chartRows,
                        )
                      }
                    >
                      <FiFileText size={14} aria-hidden="true" />
                      Download PDF
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.crmLeadTableWrap}>
                <table className={styles.rptEmpTable}>
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column.key}>{column.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={row?.id ?? index}>
                        {columns.map((column) => {
                          const value = readCell(row, column.key);
                          const text = plainText(value) || "—";
                          const href = cellHref(value);
                          return (
                            <td key={column.key}>
                              {href ? <Link href={href}>{text}</Link> : text}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={Math.max(columns.length, 1)}>
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ReportDetail;
