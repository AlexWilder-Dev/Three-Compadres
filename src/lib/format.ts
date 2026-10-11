/** £7 → "£7", £7.5 → "£7.50" */
export function formatPrice(value: number): string {
  return Number.isInteger(value) ? `£${value}` : `£${value.toFixed(2)}`
}

/** Minutes after midnight → "6pm", "5:30pm", "12pm" */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  const suffix = hours >= 12 ? 'pm' : 'am'
  const h12 = hours % 12 || 12
  return mins ? `${h12}:${String(mins).padStart(2, '0')}${suffix}` : `${h12}${suffix}`
}
