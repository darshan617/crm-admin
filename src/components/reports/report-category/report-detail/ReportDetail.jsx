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
import { useReportQuery } from "@/redux/apis/reportsApi";

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

const BAR_COLOR = "#3a72bf";
const BAR_COLOR_TOP = "#1f4e95";

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
        const key = rowsAreArrays ? index : keys.includes(column) ? column : (keys[index] ?? index);
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
    const width = Math.max(...rows.map((row) => (Array.isArray(row) ? row.length : 0)));
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
  if (resource === "employees") return `/manage/employee/employee-details/${id}`;
  if (resource === "follow-ups" || resource === "follow-up" || resource === "activities") {
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
  const customerColumn = columns.find((column) => /customer/i.test(column.label));
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

const exportCsv = (columns, rows, filename) => {
  const header = columns.map((column) => column.label);
  const lines = rows.map((row) =>
    columns
      .map((column) => {
        const text = plainText(readCell(row, column.key)).replace(/"/g, '""');
        return `"${text}"`;
      })
      .join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
  downloadFile(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename);
};

const createSimplePdf = (lines) => {
  const escape = (value) =>
    String(value)
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  const commands = lines
    .map((line, index) => {
      const y = 540 - index * 16;
      return `BT /F1 11 Tf 36 ${y} Td (${escape(line)}) Tj ET`;
    })
    .join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 1100 595] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
    `4 0 obj << /Length ${commands.length} >>\nstream\n${commands}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ];

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

const downloadPdf = (columns, rows, title, filename) => {
  const lines = [
    title,
    `${rows.length} records`,
    columns.map((column) => column.label).join("  |  "),
    ...rows.map((row) =>
      columns.map((column) => plainText(readCell(row, column.key)) || "—").join("  |  "),
    ),
  ];
  downloadFile(
    new Blob([createSimplePdf(lines)], { type: "application/pdf" }),
    filename,
  );
};

const ReportDetail = () => {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const allowed = Boolean(REPORTS[slug]);
  const { data, isLoading, isError, isFetching } = useReportQuery(slug, {
    skip: !router.isReady || !allowed,
  });

  const report = normalizeReport(data);
  const title = report.title || REPORTS[slug] || "Report";
  const columns = report.columns;
  const rows = report.rows;
  const chart = chartSeries(rows, columns);
  const chartRows = chart.points;
  const maxAmount = Math.max(0, ...chartRows.map((row) => row.amount));
  const showChart = chartRows.length > 0;
  const formatChartValue = chart.money
    ? formatINR
    : (value) => Number(value).toLocaleString("en-IN");
  const formatChartAxis = chart.money
    ? formatAxis
    : (value) => Number(value).toLocaleString("en-IN");
  const waiting = !router.isReady || (allowed && (isLoading || isFetching) && !data);

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
                    <p className={styles.rptSub}>
                      {report.count} records
                    </p>
                  </div>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.exportBtn}
                      onClick={() =>
                        exportCsv(columns, rows, `${slug}-report.csv`)
                      }
                    >
                      <FiDownload size={14} aria-hidden="true" />
                      Export CSV
                    </button>
                    <button
                      type="button"
                      className={styles.pdfBtn}
                      onClick={() =>
                        downloadPdf(columns, rows, title, `${slug}-report.pdf`)
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
                      <Bar dataKey="amount" maxBarSize={28} radius={[6, 6, 0, 0]}>
                        {chartRows.map((row, index) => (
                          <Cell
                            key={`${row.label}-${index}`}
                            fill={
                              row.amount === maxAmount && maxAmount > 0
                                ? BAR_COLOR_TOP
                                : BAR_COLOR
                            }
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
                        exportCsv(columns, rows, `${slug}-report.csv`)
                      }
                    >
                      <FiDownload size={14} aria-hidden="true" />
                      Export CSV
                    </button>
                    <button
                      type="button"
                      className={styles.pdfBtn}
                      onClick={() =>
                        downloadPdf(columns, rows, title, `${slug}-report.pdf`)
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
