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
  /** Last calendar week where this vegetable can still be sown (overall) */
  lastPossibleWeek: number
  /** Status: 'done' | 'available' | 'upcoming' */
  status: 'done' | 'available' | 'upcoming'
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

/** A vegetable whose entire sowing window has passed without any sowing */
export interface MissedVegetable {
  name: string
  id: string
  lastPossibleWeek: number
}

export type CalendarWeekMap = Map<number, SowingCalendarEntry[]>

export interface TrackedCalendarResult {
  weekMap: CalendarWeekMap
  missedVegetables: MissedVegetable[]
}

/**
 * Given vegetables and a sowing log, build a calendar week map that reflects:
 * - Which sowings are done (logged)
 * - Which are available now (within the sowing window, can be sown)
 * - Which are upcoming (planned for the future)
 *
 * Also returns a list of vegetables whose entire sowing window has passed
 * without ever being sown.
 *
 * The lastPossibleWeek always refers to the overall last possible sowing date
 * for the vegetable (across all successions), not individual succession windows.
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
): TrackedCalendarResult {
  const calendarWeekMap: CalendarWeekMap = new Map()
  const missedVegetables: MissedVegetable[] = []

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

    // Calculate overall sowing window for this vegetable
    const overallLastPossibleWeek = Math.max(
      ...plannedSowings.map((s) => s.plannedLastWeek)
    )

    // Track delay from previous sowings
    let accumulatedDelay = 0

    // Track whether any entry is done or still possible
    let hasDone = false
    let hasAvailableOrUpcoming = false

    for (const sowing of plannedSowings) {
      // Find matching log entry by succession number
      const logEntry = vegLog.find((e) => e.succession === sowing.succession)

      // Adjust based on accumulated delay from previous successions
      const adjustedFirstWeek = sowing.plannedFirstWeek + accumulatedDelay
      const adjustedLastWeek = sowing.plannedLastWeek + accumulatedDelay

      let status: SowingCalendarEntry['status'] | 'skipped'
      let actualDate: string | undefined
      let actualWeek: number | undefined

      if (logEntry) {
        status = 'done'
        hasDone = true
        actualDate = logEntry.date
        actualWeek = logEntry.week

        // Calculate delay for subsequent successions
        accumulatedDelay = logEntry.week - sowing.plannedFirstWeek
      } else if (currentWeek > adjustedLastWeek) {
        // Individual succession window passed — skip silently
        status = 'skipped'
      } else if (currentWeek >= adjustedFirstWeek) {
        // Within the sowing window — available to sow now
        status = 'available'
        hasAvailableOrUpcoming = true
      } else {
        // Future sowing
        status = 'upcoming'
        hasAvailableOrUpcoming = true
      }

      if (status === 'skipped') continue

      const entry: SowingCalendarEntry = {
        name: veg.data.name,
        id: veg.id,
        succession: sowing.succession,
        underCover: sowing.underCover,
        overwintering: sowing.overwintering,
        note: sowing.note,
        plannedWeek: sowing.plannedFirstWeek,
        lastPossibleWeek: overallLastPossibleWeek,
        status: status as SowingCalendarEntry['status'],
        actualDate,
        actualWeek,
      }

      if (status === 'done' && actualWeek !== undefined) {
        addToMap(calendarWeekMap, actualWeek, entry)
      } else if (status === 'available') {
        addToMap(calendarWeekMap, currentWeek, entry)
      } else if (status === 'upcoming') {
        for (const w of sowing.weeks) {
          const adjustedW = w + accumulatedDelay
          addToMap(calendarWeekMap, adjustedW, entry)
        }
      }
    }

    // If no succession was done and none are available/upcoming,
    // the entire window has passed — add to missed list
    if (!hasDone && !hasAvailableOrUpcoming) {
      missedVegetables.push({
        name: veg.data.name,
        id: veg.id,
        lastPossibleWeek: overallLastPossibleWeek,
      })
    }
  }

  return { weekMap: calendarWeekMap, missedVegetables }
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
