/** 4 → "£4", 14.5 → "£14.50" */
export function formatPrice(value: number): string {
  return Number.isInteger(value) ? `£${value}` : `£${value.toFixed(2)}`
}

/** Minutes after midnight → "6pm", "11:30am", "12pm" */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  const suffix = hours >= 12 ? 'pm' : 'am'
  const h12 = hours % 12 || 12
  return mins ? `${h12}:${String(mins).padStart(2, '0')}${suffix}` : `${h12}${suffix}`
}

export function mapsDirections(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
