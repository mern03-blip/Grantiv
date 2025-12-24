export const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// ✅ Helper to safely get numeric value
const getValidAmount = (...values) => {
  for (const val of values) {
    const num = Number(val);
    if (!isNaN(num) && num > 0) return num;
  }
  return null;
};

// ✅ Function to format single or range amounts
export const formatAmount = (grant) => {
  const {
    minAmountAvailable,
    maxAmountAvailable,
    totalAmountAvailable,
    amount,
  } = grant || {};

  // pick single valid amount from totalAmountAvailable OR amount
  const singleAmount = getValidAmount(amount, totalAmountAvailable);

  // ❌ If nothing exists
  if (!minAmountAvailable && !maxAmountAvailable && !singleAmount) {
    return "Unspecified";
  }

  // ✅ If min & max exist and equal
  if (
    minAmountAvailable &&
    maxAmountAvailable &&
    minAmountAvailable === maxAmountAvailable
  ) {
    return currencyFormatter.format(
      getValidAmount(singleAmount, minAmountAvailable)
    );
  }

  // ✅ If min & max both exist → range
  if (minAmountAvailable && maxAmountAvailable) {
    return `${currencyFormatter.format(
      minAmountAvailable
    )} - ${currencyFormatter.format(maxAmountAvailable)}`;
  }

  // ✅ If only single value exists (amount OR totalAmountAvailable)
  if (singleAmount) {
    return currencyFormatter.format(singleAmount);
  }

  // ✅ If only one bound exists
  if (maxAmountAvailable) return currencyFormatter.format(maxAmountAvailable);

  if (minAmountAvailable) return currencyFormatter.format(minAmountAvailable);

  return "Unspecified";
};
