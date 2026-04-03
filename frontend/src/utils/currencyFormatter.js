export const formatCurrency = (amountInLKR) => {
    if (amountInLKR === undefined || amountInLKR === null) return 'LKR 0.00 ($0.00)';
    const amount = Number(amountInLKR);
    if (isNaN(amount)) return 'LKR 0.00 ($0.00)';
    
    // Static estimated conversion: 1 USD = 300 LKR
    const usdEquivalent = (amount / 300).toFixed(2);
    
    return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ($${usdEquivalent})`;
};
