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

export interface SowingCalendarEntry {
  name: string
  id: string
  /** Which sowing within the window (1 = first, 2 = second succession, etc.) */
  succession: number
  underCover: boolean
  overwintering: boolean
  note?: string
  /** Last calendar week where sowing is still possible in this window */
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

interface SowingWindowInput {
  from: number
  until: number
  successionIntervalWeeks?: number
  underCover?: boolean
  overwintering?: boolean
  note?: string
}

/**
 * Build a calendar week map showing what to sow when.
 *
 * Each sowing window of each vegetable produces at most ONE
 * available/upcoming entry at a time. Done entries are always shown.
 *
 * For windows with successionIntervalWeeks, after a sowing is logged
 * the next entry appears `interval` weeks later — but only if still
 * within the window. Only the next upcoming sowing is shown, never
 * multiple future ones.
 *
 * Vegetables whose every window has passed without a single sowing
 * are returned in missedVegetables.
 */
export function buildTrackedCalendar(
  vegetables: Array<{
    id: string
    data: {
      name: string
      sowingWindows: SowingWindowInput[]
    }
  }>,
  logEntries: SowingLogEntry[],
  currentWeek: number
): TrackedCalendarResult {
  const calendarWeekMap: CalendarWeekMap = new Map()
  const missedVegetables: MissedVegetable[] = []

  // Group log entries by vegetable, sorted by date
  const logByVegetable = new Map<
    string,
    Array<{ date: string; week: number }>
  >()
  for (const entry of logEntries) {
    const vegId =
      typeof entry.vegetable === 'object'
        ? (entry.vegetable as { id: string }).id
        : entry.vegetable
    const list = logByVegetable.get(vegId) ?? []
    list.push({
      date: entry.date,
      week: getISOWeek(new Date(entry.date)),
    })
    logByVegetable.set(vegId, list)
  }

  for (const veg of vegetables) {
    const vegLogs = (logByVegetable.get(veg.id) ?? []).sort(
      (a, b) => a.week - b.week
    )

    let hasAnyEntry = false

    for (const window of veg.data.sowingWindows) {
      const firstWeek = window.from
      const lastWeek = window.until
      const underCover = window.underCover ?? false
      const overwintering = window.overwintering ?? false

      // Find log entries within this window's week range
      const windowLogs = vegLogs.filter(
        (l) => l.week >= firstWeek && l.week <= lastWeek
      )

      // Add all done entries to the calendar
      for (let i = 0; i < windowLogs.length; i++) {
        hasAnyEntry = true
        addToMap(calendarWeekMap, windowLogs[i].week, {
          name: veg.data.name,
          id: veg.id,
          succession: i + 1,
          underCover,
          overwintering,
          note: window.note,
          lastPossibleWeek: lastWeek,
          status: 'done',
          actualDate: windowLogs[i].date,
          actualWeek: windowLogs[i].week,
        })
      }

      // If the window has completely passed, no more entries needed
      if (currentWeek > lastWeek) continue

      if (windowLogs.length === 0) {
        // Never sown in this window — show first sowing
        hasAnyEntry = true
        const showInWeek = currentWeek >= firstWeek ? currentWeek : firstWeek
        const status: SowingCalendarEntry['status'] =
          currentWeek >= firstWeek ? 'available' : 'upcoming'

        addToMap(calendarWeekMap, showInWeek, {
          name: veg.data.name,
          id: veg.id,
          succession: 1,
          underCover,
          overwintering,
          note: window.note,
          lastPossibleWeek: lastWeek,
          status,
        })
      } else if (window.successionIntervalWeeks) {
        // Has been sown, check if next succession is due
        const lastSownWeek = windowLogs[windowLogs.length - 1].week
        const nextSowingWeek = lastSownWeek + window.successionIntervalWeeks

        if (nextSowingWeek <= lastWeek) {
          hasAnyEntry = true
          const showInWeek =
            currentWeek >= nextSowingWeek ? currentWeek : nextSowingWeek
          const status: SowingCalendarEntry['status'] =
            currentWeek >= nextSowingWeek ? 'available' : 'upcoming'

          addToMap(calendarWeekMap, showInWeek, {
            name: veg.data.name,
            id: veg.id,
            succession: windowLogs.length + 1,
            underCover,
            overwintering,
            note: window.note,
            lastPossibleWeek: lastWeek,
            status,
          })
        }
      }
    }

    // If no entries at all across all windows → missed
    if (!hasAnyEntry) {
      const overallLastWeek = Math.max(
        ...veg.data.sowingWindows.map((w) => w.until)
      )
      missedVegetables.push({
        name: veg.data.name,
        id: veg.id,
        lastPossibleWeek: overallLastWeek,
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
