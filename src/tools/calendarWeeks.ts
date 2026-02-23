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
  /** Actual date sown (from log), if done */
  actualDate?: string
  /** Actual week sown (from log), if done */
  actualWeek?: number
}

/** Raw log entry: vegetable ID + date string */
export interface SowingLogEntry {
  vegetable: string
  date: string
}

export type CalendarWeekMap = Map<number, SowingCalendarEntry[]>

/**
 * Given vegetables and a sowing log, build a calendar week map that reflects:
 * - Which sowings are done (logged)
 * - Which are overdue (planned week passed, not yet done, still possible)
 * - Which are upcoming (planned week hasn't arrived yet)
 * - Adjusted follow-up sowings based on actual sowing dates
 *
 * Succession is derived from the order of log entries per vegetable:
 * the first logged sowing for a vegetable is succession 1, the second is 2, etc.
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

  // Group log entries by vegetable, sorted by date.
  // The nth entry for a vegetable = succession n.
  const logByVegetable = new Map<
    string,
    Array<{ date: string; week: number; succession: number }>
  >()
  for (const entry of logEntries) {
    const vegId =
      typeof entry.vegetable === 'object'
        ? (entry.vegetable as { id: string }).id
        : entry.vegetable
    const list = logByVegetable.get(vegId) ?? []
    const d = new Date(entry.date)
    list.push({
      date: entry.date,
      week: getISOWeek(d),
      succession: list.length + 1,
    })
    logByVegetable.set(vegId, list)
  }

  for (const veg of vegetables) {
    const vegLog = logByVegetable.get(veg.id) ?? []

    // Build ordered list of planned sowings (sorted by succession number)
    const plannedSowings = veg.data.sowings
      .map((sowing) => {
        const succession = sowing.succession ?? 1
        const timing = sowing.timing ?? 'full'
        const weeks = getCalendarWeeks(sowing.month, timing, year)
        return {
          succession,
          timing,
          underCover: sowing.underCover ?? false,
          overwintering: sowing.overwintering ?? false,
          note: sowing.note,
          weeks,
          plannedFirstWeek: Math.min(...weeks),
          plannedLastWeek: Math.max(...weeks),
        }
      })
      .sort((a, b) => a.succession - b.succession)

    // Track delay from previous sowings
    let accumulatedDelay = 0

    for (const sowing of plannedSowings) {
      // Find matching log entry by succession number
      const logEntry = vegLog.find((e) => e.succession === sowing.succession)

      // Adjust based on accumulated delay from previous successions
      const adjustedFirstWeek = sowing.plannedFirstWeek + accumulatedDelay
      const adjustedLastWeek = sowing.plannedLastWeek + accumulatedDelay

      let status: SowingCalendarEntry['status']
      let actualDate: string | undefined
      let actualWeek: number | undefined

      if (logEntry) {
        status = 'done'
        actualDate = logEntry.date
        actualWeek = logEntry.week

        // Calculate delay for subsequent successions
        accumulatedDelay = logEntry.week - sowing.plannedFirstWeek
      } else if (currentWeek > adjustedLastWeek) {
        // Window has completely passed - too late
        status = 'pending'
      } else if (currentWeek >= adjustedFirstWeek) {
        // Past the first planned week but still in the window
        status = 'overdue'
      } else {
        // Future sowing
        status = 'upcoming'
      }

      const entry: SowingCalendarEntry = {
        name: veg.data.name,
        id: veg.id,
        succession: sowing.succession,
        underCover: sowing.underCover,
        overwintering: sowing.overwintering,
        note: sowing.note,
        plannedWeek: sowing.plannedFirstWeek,
        lastPossibleWeek: adjustedLastWeek,
        status,
        actualDate,
        actualWeek,
      }

      if (status === 'done') {
        addToMap(calendarWeekMap, actualWeek!, entry)
      } else if (status === 'overdue') {
        addToMap(calendarWeekMap, currentWeek, entry)
      } else if (status === 'upcoming') {
        for (const w of sowing.weeks) {
          const adjustedW = w + accumulatedDelay
          addToMap(calendarWeekMap, adjustedW, entry)
        }
      }
      // 'pending' (too late) entries are not shown
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
