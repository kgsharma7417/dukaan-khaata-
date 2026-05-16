export const STORAGE_KEY = "girvi_customers_data";

export function rupees(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function calcByaaj(raqam, byaajDar, tarikh) {
  const r = Math.round(parseFloat(raqam) || 0);
  const bd = parseFloat(byaajDar) || 0;
  if (!r || !bd || !tarikh) return null;

  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(tarikh)) / 86400000),
  );
  const chargedDays = Math.max(days, 30);
  const byaaj = Math.round((r * bd * (chargedDays / 30)) / 100);
  return { days, chargedDays, raqam: r, byaaj, total: r + byaaj };
}

export function initials(name) {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
