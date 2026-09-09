/**
 * Shared date, time, and currency formatting helpers.
 */

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  } catch {
    return dateString
  }
}

export function formatTimestampISO(date: Date = new Date()): string {
  return date.toISOString()
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
