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
 * Build a calendar week map showing what to sow when.
 *
 * Each succession of each vegetable appears exactly ONCE:
 * - 'done': in the week it was actually sown
 * - 'available': in the current week (window is open, not yet sown)
 * - 'upcoming': in the first week of its window (still in the future)
 *
 * Multiple sowing entries sharing the same succession number are merged
 * into one window (e.g. Artischocke: Feb + Mar + Apr = one window).
 *
 * Vegetables whose entire window has passed without a single sowing
 * are returned in missedVegetables.
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

  // Group log entries by vegetable.
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

    // Group sowing entries by succession number and merge into windows
    const bySuccession = new Map<
      number,
      Array<{
        underCover: boolean
        overwintering: boolean
        note?: string
        weeks: number[]
      }>
    >()
    for (const sowing of veg.data.sowings) {
      const succession = sowing.succession ?? 1
      const timing = sowing.timing ?? 'full'
      const weeks = getCalendarWeeks(sowing.month, timing, year)
      const group = bySuccession.get(succession) ?? []
      group.push({
        underCover: sowing.underCover ?? false,
        overwintering: sowing.overwintering ?? false,
        note: sowing.note,
        weeks,
      })
      bySuccession.set(succession, group)
    }

    // Build one merged window per succession
    const successionWindows = [...bySuccession.entries()]
      .map(([succession, entries]) => {
        const allWeeks = entries.flatMap((e) => e.weeks)
        const first = entries[0]
        return {
          succession,
          firstWeek: Math.min(...allWeeks),
          lastWeek: Math.max(...allWeeks),
          underCover: first.underCover,
          overwintering: first.overwintering,
          note: first.note,
        }
      })
      .sort((a, b) => a.succession - b.succession)

    // Overall last possible week across all successions
    const overallLastPossibleWeek = Math.max(
      ...successionWindows.map((s) => s.lastWeek)
    )

    let hasDone = false
    let hasAvailableOrUpcoming = false
    let accumulatedDelay = 0

    for (const window of successionWindows) {
      const logEntry = vegLog.find((e) => e.succession === window.succession)

      const adjustedFirstWeek = window.firstWeek + accumulatedDelay
      const adjustedLastWeek = window.lastWeek + accumulatedDelay

      if (logEntry) {
        hasDone = true
        accumulatedDelay = logEntry.week - window.firstWeek

        addToMap(calendarWeekMap, logEntry.week, {
          name: veg.data.name,
          id: veg.id,
          succession: window.succession,
          underCover: window.underCover,
          overwintering: window.overwintering,
          note: window.note,
          plannedWeek: window.firstWeek,
          lastPossibleWeek: overallLastPossibleWeek,
          status: 'done',
          actualDate: logEntry.date,
          actualWeek: logEntry.week,
        })
      } else if (currentWeek > adjustedLastWeek) {
        // Window passed — skip silently
      } else if (currentWeek >= adjustedFirstWeek) {
        // Within window — show once in current week
        hasAvailableOrUpcoming = true

        addToMap(calendarWeekMap, currentWeek, {
          name: veg.data.name,
          id: veg.id,
          succession: window.succession,
          underCover: window.underCover,
          overwintering: window.overwintering,
          note: window.note,
          plannedWeek: window.firstWeek,
          lastPossibleWeek: adjustedLastWeek,
          status: 'available',
        })
      } else {
        // Future — show once in first week of window
        hasAvailableOrUpcoming = true

        addToMap(calendarWeekMap, adjustedFirstWeek, {
          name: veg.data.name,
          id: veg.id,
          succession: window.succession,
          underCover: window.underCover,
          overwintering: window.overwintering,
          note: window.note,
          plannedWeek: window.firstWeek,
          lastPossibleWeek: adjustedLastWeek,
          status: 'upcoming',
        })
      }
    }

    // Entire window passed without any sowing → missed
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
