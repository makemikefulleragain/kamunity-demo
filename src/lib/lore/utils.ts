// Lore Campaign Utilities - AU timezone and CSV helpers
export const AU_TZ = "Australia/Perth";

export const fmtDateTime = (d: Date) => 
  new Intl.DateTimeFormat("en-AU", { 
    dateStyle: "medium", 
    timeStyle: "short", 
    timeZone: AU_TZ 
  }).format(d);

export const fmtDate = (d: Date) => 
  new Intl.DateTimeFormat("en-AU", { 
    dateStyle: "medium", 
    timeZone: AU_TZ 
  }).format(d);

export function classNames(...xs: (string | boolean | undefined)[]): string {
  return xs.filter(Boolean).join(" ");
}

export function download(filename: string, text: string) {
  const el = document.createElement('a');
  el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  el.setAttribute('download', filename);
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}

export function toCSV(rows: Record<string, any>[]): string {
  if (!rows || !rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: any) => '"' + String(v ?? "").replaceAll('"', '""') + '"';
  const lines = [headers.join(',')].concat(
    rows.map(r => headers.map(h => esc(r[h])).join(','))
  );
  return lines.join('\n');
}

export function fromCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines.shift()?.split(',').map(h => h.replace(/^"|"$/g, '')) || [];
  return lines.map(line => {
    const cells: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = !inQ;
        }
      } else if (ch === ',' && !inQ) {
        cells.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    cells.push(cur);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => obj[h] = cells[idx]?.replace(/^"|"$/g, '') ?? '');
    return obj;
  });
}

// Lore text generator
export function loreLine({ winner, loser, location, date, highlight }: {
  winner: string;
  loser: string;
  location: string;
  date: Date;
  highlight: string;
}): string {
  const d = fmtDate(date);
  return `On ${d}, upon the field of ${location}, ${winner} smote ${loser} with resolute steel; thus was ${highlight} writ into the Chronicle.`;
}
