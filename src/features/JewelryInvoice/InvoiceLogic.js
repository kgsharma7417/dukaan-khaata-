export function clampToNonNegative(n) {
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, num);
}

export function computeInvoiceTotals({
  weightInGrams,
  todayGoldRate,
  makingChargesFlat,
  discountAmount,
  paidAmount,
}) {
  // 1) Inputs (clamped)
  const totalWeight = clampToNonNegative(weightInGrams);
  const goldRate = clampToNonNegative(todayGoldRate);
  const makingCharges = clampToNonNegative(makingChargesFlat);
  const discount = clampToNonNegative(discountAmount);
  const paymentPaid = clampToNonNegative(paidAmount);

  // 2) Math flow (clearly named + commented)
  // netGoldValue = weightInGrams × todayGoldRate
  const netGoldValue = totalWeight * goldRate;

  // subTotal = netGoldValue + makingCharges
  const subTotal = netGoldValue + makingCharges;

  // finalTotal = subTotal - discount
  const finalTotalRaw = subTotal - discount;
  const finalTotal = clampToNonNegative(finalTotalRaw);

  // balanceAmount = finalTotal - paidAmount
  const balanceAmountRaw = finalTotal - paymentPaid;
  const balanceAmount = clampToNonNegative(balanceAmountRaw);

  // 3) Status label
  const isFullyPaid = balanceAmount === 0;

  return {
    totalWeight,
    goldRate,
    makingCharges,
    discount,
    paymentPaid,

    netGoldValue,
    subTotal,
    finalTotal,
    balanceAmount,
    isFullyPaid,
  };
}
