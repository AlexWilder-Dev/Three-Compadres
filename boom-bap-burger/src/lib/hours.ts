import { brand, type Location, type OpeningHours } from '../data/venue'
import { formatTime } from './format'

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
/** Display order for hours tables, Monday first. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

const CLOSING_SOON_MINUTES = 30

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: brand.timeZone,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** Day of week (0 = Sunday) and minutes after midnight, in London time. */
export function londonNow(date = new Date()): { day: number; minutes: number } {
  const parts = formatter.formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const day = DAY_SHORT.indexOf(get('weekday'))
  const minutes = (Number(get('hour')) % 24) * 60 + Number(get('minute'))
  return { day: day === -1 ? date.getDay() : day, minutes }
}

export const closeText = (hours: OpeningHours) => hours.closeLabel ?? formatTime(hours.close)

export function formatRange(hours: OpeningHours | null): string {
  return hours ? `${formatTime(hours.open)} – ${closeText(hours)}` : 'Closed'
}

export type OpenState = 'open' | 'closing' | 'closed'

export interface OpenStatus {
  state: OpenState
  label: string
  today: OpeningHours | null
  day: number
}

export function getOpenStatus(location: Location, date = new Date()): OpenStatus {
  const { day, minutes } = londonNow(date)
  const today = location.hours[day]

  if (today && minutes >= today.open && minutes < today.close) {
    const closing = !today.closeLabel && today.close - minutes <= CLOSING_SOON_MINUTES
    const until = today.closeLabel ? `till ${today.closeLabel}` : `until ${formatTime(today.close)}`
    return {
      state: closing ? 'closing' : 'open',
      label: closing ? `Closing soon · ${until}` : `${location.openWord} · ${until}`,
      today,
      day,
    }
  }

  if (today && minutes < today.open) {
    return { state: 'closed', label: `${location.closedWord} · opens ${formatTime(today.open)}`, today, day }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7
    const hours = location.hours[next]
    if (hours) {
      const when = offset === 1 ? 'tomorrow' : DAY_SHORT[next]
      return {
        state: 'closed',
        label: `${location.closedWord} · opens ${when} ${formatTime(hours.open)}`,
        today,
        day,
      }
    }
  }

  return { state: 'closed', label: location.closedWord, today, day }
}

export interface HoursGroup {
  days: string
  range: string
}

/** Collapses the week into runs of matching hours, e.g. "Mon–Fri 11:30am – late". Sunday joins Monday's run when they match. */
export function groupHours(location: Location): HoursGroup[] {
  const runs: { days: number[]; range: string }[] = []
  for (const day of WEEK_ORDER) {
    const range = formatRange(location.hours[day])
    const last = runs[runs.length - 1]
    if (last && last.range === range) last.days.push(day)
    else runs.push({ days: [day], range })
  }
  if (runs.length > 1 && runs[0].range === runs[runs.length - 1].range) {
    const tail = runs.pop()!
    runs[0].days.unshift(...tail.days)
  }
  return runs.map(({ days, range }) => ({
    days: days.length === 1 ? DAY_SHORT[days[0]] : `${DAY_SHORT[days[0]]}–${DAY_SHORT[days[days.length - 1]]}`,
    range,
  }))
}

/** Days until the next given weekday in London (0 if it's today). */
export function daysUntil(weekday: number, date = new Date()): number {
  const { day } = londonNow(date)
  return (weekday - day + 7) % 7
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: brand.timeZone,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

/** "Tonight", "Tomorrow" or "Fri 16 Oct" for the next given weekday. */
export function nextWeekdayLabel(weekday: number, date = new Date()): string {
  const days = daysUntil(weekday, date)
  if (days === 0) return 'Tonight'
  if (days === 1) return 'Tomorrow'
  const parts = dateFormatter.formatToParts(new Date(date.getTime() + days * 86_400_000))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('weekday')} ${get('day')} ${get('month')}`
}
