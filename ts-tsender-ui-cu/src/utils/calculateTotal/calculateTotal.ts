/**
 * Calculates the total sum from a string of numbers that can be delimited by
 * either commas or newlines or a combination of both.
 * 
 * @param amounts - A string containing numbers separated by commas and/or newlines
 * @returns The sum of all numbers in the string
 */
export function calculateTotal(amounts: string): number {
    // Handle empty string case
    if (!amounts || amounts.trim() === '') {
        return 0;
    }

    // Split the string by both commas and newlines
    const amountArray = amounts
        .split(/[,\n]+/)
        .map(amt => amt.trim())
        .filter(amt => amt !== '')
        .map(amt => parseFloat(amt));

    // Convert strings to numbers and sum them
    const total = amountArray.reduce((sum, amt) => {
        // Skip non-numeric values
        if (isNaN(amt)) {
            return sum;
        }

        return sum + amt;
    }, 0);

    return total;
};