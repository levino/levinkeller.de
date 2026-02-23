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

export function getISOWeek(date: Date): number {
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
  /** First planned calendar week for this sowing */
  plannedWeek: number
  /** Last calendar week where this sowing is still possible */
  lastPossibleWeek: number
  /** Status: 'done' | 'overdue' | 'upcoming' | 'pending' */
  status: 'done' | 'overdue' | 'upcoming' | 'pending'
  /** Actual week sown (from log), if any */
  actualWeek?: number
}

export interface SowingLogEntry {
  vegetable: string
  succession: number
  week: number
}

export type CalendarWeekMap = Map<number, SowingCalendarEntry[]>

/**
 * Given vegetables and a sowing log, build a calendar week map that reflects:
 * - Which sowings are done (logged)
 * - Which are overdue (planned week passed, not yet done, still possible)
 * - Which are upcoming (planned week hasn't arrived yet)
 * - Adjusted follow-up sowings based on actual sowing dates
 */
export function buildTrackedCalendar(
  vegetables: Array<{
    id: string
    data: {
      name: string
      sowings: Array<{
        month: Month
        timing?: Timing
        succession?: number
        underCover?: boolean
        overwintering?: boolean
        note?: string
      }>
    }
  }>,
  logEntries: SowingLogEntry[],
  currentWeek: number,
  year: number = new Date().getFullYear()
): CalendarWeekMap {
  const calendarWeekMap: CalendarWeekMap = new Map()

  for (const veg of vegetables) {
    // Group sowings by succession to calculate delays
    const sowingsBySuccession = new Map<
      number,
      {
        month: Month
        timing: Timing
        succession: number
        underCover: boolean
        overwintering: boolean
        note?: string
        weeks: number[]
      }
    >()

    for (const sowing of veg.data.sowings) {
      const succession = sowing.succession ?? 1
      const timing = sowing.timing ?? 'full'
      const weeks = getCalendarWeeks(sowing.month, timing, year)
      sowingsBySuccession.set(succession, {
        month: sowing.month,
        timing,
        succession,
        underCover: sowing.underCover ?? false,
        overwintering: sowing.overwintering ?? false,
        note: sowing.note,
        weeks,
      })
    }

    // Sort successions
    const sortedSuccessions = [...sowingsBySuccession.keys()].sort(
      (a, b) => a - b
    )

    // Track delay from previous sowings
    let accumulatedDelay = 0

    for (const succNum of sortedSuccessions) {
      const sowing = sowingsBySuccession.get(succNum)
      if (!sowing) continue
      const plannedFirstWeek = Math.min(...sowing.weeks)
      const plannedLastWeek = Math.max(...sowing.weeks)

      // Check if this succession was already sown
      const logEntry = logEntries.find(
        (e) => e.vegetable === veg.id && e.succession === succNum
      )

      // Adjust based on accumulated delay from previous successions
      const adjustedFirstWeek = plannedFirstWeek + accumulatedDelay
      const adjustedLastWeek = plannedLastWeek + accumulatedDelay

      let status: SowingCalendarEntry['status']
      let displayWeek: number
      let actualWeek: number | undefined

      if (logEntry) {
        // This sowing was done
        status = 'done'
        actualWeek = logEntry.week
        displayWeek = logEntry.week

        // Calculate delay for subsequent successions
        const delay = logEntry.week - plannedFirstWeek
        accumulatedDelay = delay
      } else if (currentWeek > adjustedLastWeek) {
        // Window has completely passed - too late
        status = 'pending' // won't show, it's past
        displayWeek = adjustedFirstWeek
      } else if (currentWeek >= adjustedFirstWeek) {
        // We're in the window or past the first planned week but still possible
        status = 'overdue'
        displayWeek = currentWeek
        // Also show in the original planned week
      } else {
        // Future sowing
        status = 'upcoming'
        displayWeek = adjustedFirstWeek
      }

      const entry: SowingCalendarEntry = {
        name: veg.data.name,
        id: veg.id,
        succession: succNum,
        underCover: sowing.underCover,
        overwintering: sowing.overwintering,
        note: sowing.note,
        plannedWeek: plannedFirstWeek,
        lastPossibleWeek: adjustedLastWeek,
        status,
        actualWeek,
      }

      if (status === 'done') {
        // Show in the week it was actually done
        addToMap(calendarWeekMap, displayWeek, entry)
      } else if (status === 'overdue') {
        // Show in current week (so user sees it now)
        addToMap(calendarWeekMap, currentWeek, entry)
      } else if (status === 'upcoming') {
        // Show in all adjusted planned weeks
        for (const w of sowing.weeks) {
          const adjustedW = w + accumulatedDelay
          addToMap(calendarWeekMap, adjustedW, entry)
        }
      }
    }
  }

  return calendarWeekMap
}

function addToMap(
  map: CalendarWeekMap,
  week: number,
  entry: SowingCalendarEntry
): void {
  const existing = map.get(week) ?? []
  if (
    !existing.some(
      (e) => e.id === entry.id && e.succession === entry.succession
    )
  ) {
    existing.push(entry)
  }
  map.set(week, existing)
}
