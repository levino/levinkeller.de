import { MONTHS_EN } from '@levino/shipyard-base'

type Month = (typeof MONTHS_EN)[number]

type Timing =
  | 'early'
  | 'mid'
  | 'late'
  | 'early-mid'
  | 'mid-late'
  | '1st-half'
  | '2nd-half'
  | 'full'

function getISOWeek(date: Date): number {
  const d = new Date(date.getTime())
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  )
}

function getDayRange(
  timing: Timing,
  lastDay: number
): { startDay: number; endDay: number } {
  switch (timing) {
    case 'early':
      return { startDay: 1, endDay: 10 }
    case 'mid':
      return { startDay: 11, endDay: 20 }
    case 'late':
      return { startDay: 21, endDay: lastDay }
    case 'early-mid':
      return { startDay: 1, endDay: 20 }
    case 'mid-late':
      return { startDay: 11, endDay: lastDay }
    case '1st-half':
      return { startDay: 1, endDay: 15 }
    case '2nd-half':
      return { startDay: 16, endDay: lastDay }
    default:
      return { startDay: 1, endDay: lastDay }
  }
}

export function getCalendarWeeks(
  month: Month,
  timing: Timing = 'full',
  year: number = new Date().getFullYear()
): number[] {
  const monthIndex = MONTHS_EN.indexOf(month)
  const lastDay = new Date(year, monthIndex + 1, 0).getDate()
  const { startDay, endDay } = getDayRange(timing, lastDay)

  const startDate = new Date(year, monthIndex, startDay)
  const endDate = new Date(year, monthIndex, endDay)

  const startWeek = getISOWeek(startDate)
  const endWeek = getISOWeek(endDate)

  // Handle year boundary (e.g., late December → KW 1 of next year)
  if (endWeek < startWeek) {
    const weeks: number[] = []
    for (let w = startWeek; w <= 52; w++) weeks.push(w)
    for (let w = 1; w <= endWeek; w++) weeks.push(w)
    return weeks
  }

  const weeks: number[] = []
  for (let w = startWeek; w <= endWeek; w++) {
    weeks.push(w)
  }
  return weeks
}

export interface SowingCalendarEntry {
  name: string
  id: string
  succession: number
  underCover: boolean
  overwintering: boolean
  note?: string
}

export type CalendarWeekMap = Map<number, SowingCalendarEntry[]>
