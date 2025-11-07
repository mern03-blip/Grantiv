// ✅ Common currency formatter for AUD
export const currencyFormatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

// ✅ Function to format single or range amounts
export const formatAmount = (grant) => {
    const { minAmountAvailable, maxAmountAvailable, totalAmountAvailable } = grant || {};

    // If no data, return fallback
    if (!minAmountAvailable && !maxAmountAvailable && !totalAmountAvailable) {
        return 'Unspecified';
    }

    // ✅ If min and max are equal → show totalAmountAvailable (or that same value)
    if (minAmountAvailable && maxAmountAvailable && minAmountAvailable === maxAmountAvailable) {
        const value = totalAmountAvailable || minAmountAvailable;
        return currencyFormatter.format(value);
    }

    // ✅ If min and max both exist but not equal → show range
    if (minAmountAvailable && maxAmountAvailable) {
        return `${currencyFormatter.format(minAmountAvailable)} - ${currencyFormatter.format(maxAmountAvailable)}`;
    }

    // ✅ If only one value exists → show that
    if (maxAmountAvailable) return currencyFormatter.format(maxAmountAvailable);
    if (minAmountAvailable) return currencyFormatter.format(minAmountAvailable);

    // ✅ Fallback → show total amount if nothing else
    return currencyFormatter.format(totalAmountAvailable);
};
