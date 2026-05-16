export const STORAGE_KEY = "girvi_customers_data";

export function rupees(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function calcByaaj(raqam, byaajDar, tarikh) {
  const round2 = (v) => Math.round(parseFloat(v ?? 0) * 100) / 100;

  // raqam ko rupees me integer rakhta hai, but-byaj calculation me 2-decimal rounding apply
  const r = Math.round(round2(raqam) || 0);
  const bd = round2(byaajDar) || 0;
  if (!r || !bd || !tarikh) return null;

  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(tarikh)) / 86400000),
  );
  const chargedDays = Math.max(days, 30);

  // floating point precision fix (exact requirement uses round(parseFloat()*100)/100)
  const factor = round2(chargedDays / 30);
  const byaajRaw = round2(r * bd * factor);
  const byaaj = Math.round(byaajRaw / 100);

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
