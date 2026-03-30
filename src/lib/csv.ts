function escapeCsvValue(value: string | number | null | undefined) {
  const normalized = value === null || value === undefined ? "" : String(value);
  const escaped = normalized.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function buildCsv<
  T extends Record<string, string | number | null | undefined>
>(rows: T[], headers: Array<keyof T>) {
  const headerLine = headers.map((header) => escapeCsvValue(String(header))).join(",");
  const bodyLines = rows.map((row) =>
    headers.map((header) => escapeCsvValue(row[header])).join(",")
  );

  return [headerLine, ...bodyLines].join("\n");
}

export function buildDataUrl(csv: string) {
  const bom = "\uFEFF";
  return `data:text/csv;charset=utf-8,${encodeURIComponent(bom + csv)}`;
}