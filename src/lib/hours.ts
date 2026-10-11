import { venue, type OpeningHours } from '../data/venue'
import { formatTime } from './format'

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
/** Display order for the hours table, Monday first. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

const CLOSING_SOON_MINUTES = 30

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: venue.timeZone,
  weekday: 'short',
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

export type OpenState = 'open' | 'closing' | 'closed'

export interface OpenStatus {
  state: OpenState
  label: string
  today: OpeningHours | null
  day: number
}

export function formatRange(hours: OpeningHours | null): string {
  return hours ? `${formatTime(hours.open)} – ${formatTime(hours.close)}` : 'Closed'
}

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = londonNow(date)
  const today = venue.hours[day]

  if (today && minutes >= today.open && minutes < today.close) {
    const closing = today.close - minutes <= CLOSING_SOON_MINUTES
    return {
      state: closing ? 'closing' : 'open',
      label: closing
        ? `Closing soon · until ${formatTime(today.close)}`
        : `Open now · until ${formatTime(today.close)}`,
      today,
      day,
    }
  }

  if (today && minutes < today.open) {
    return { state: 'closed', label: `Opens today at ${formatTime(today.open)}`, today, day }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7
    const hours = venue.hours[next]
    if (hours) {
      const when = offset === 1 ? 'tomorrow' : DAY_SHORT[next]
      return { state: 'closed', label: `Opens ${when} at ${formatTime(hours.open)}`, today, day }
    }
  }

  return { state: 'closed', label: 'Closed', today, day }
}
