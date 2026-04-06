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
  /** Whether this vegetable is direct-sown (Direktsaat) rather than pre-cultivated in pots */
  directSow: boolean
  note?: string
  /** Last calendar week where sowing is still possible in this window */
  lastPossibleWeek: number
  /** Status: 'done' | 'available' | 'upcoming' */
  status: 'done' | 'available' | 'upcoming'
  /** Actual date sown (from log), if done */
  actualDate?: string
  /** Actual week sown (from log), if done */
  actualWeek?: number
  /** Whether this is a sowing or a plant-out reminder */
  type: 'sowing' | 'plantOut'
  /** Reihenabstand in cm */
  rowSpacingCm?: number
  /** Pflanzabstand in der Reihe in cm */
  plantSpacingCm?: number
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

interface VegetableInput {
  id: string
  data: {
    name: string
    directSow: boolean
    rowSpacingCm?: number
    plantSpacingCm?: number
    weeksToPlantOut?: number
    sowingWindows: SowingWindowInput[]
  }
}

/**
 * Build a calendar week map showing what to sow and plant when.
 *
 * Sowing entries: each window produces at most ONE available/upcoming entry.
 * Done entries always shown at their actual week.
 *
 * Plant-out entries: generated for every logged sowing of a Vorkultur crop.
 * Like sowing entries, they stay visible in the current week until logged as
 * planted (status 'done'). Unplanted entries whose planned week has passed
 * are shown in the current week as 'available'.
 *
 * Vegetables whose every window has passed without a single sowing are
 * returned in missedVegetables.
 */
export function buildTrackedCalendar(
  vegetables: Array<VegetableInput>,
  sowingEntries: SowingLogEntry[],
  plantingEntries: SowingLogEntry[],
  currentWeek: number
): TrackedCalendarResult {
  const calendarWeekMap: CalendarWeekMap = new Map()
  const missedVegetables: MissedVegetable[] = []

  // Group sowing log entries by vegetable, sorted by week
  const sowingByVegetable = new Map<
    string,
    Array<{ date: string; week: number }>
  >()
  for (const entry of sowingEntries) {
    const vegId =
      typeof entry.vegetable === 'object'
        ? (entry.vegetable as { id: string }).id
        : entry.vegetable
    const list = sowingByVegetable.get(vegId) ?? []
    list.push({ date: entry.date, week: getISOWeek(new Date(entry.date)) })
    sowingByVegetable.set(vegId, list)
  }

  // Group planting log entries by vegetable, sorted by week
  const plantingByVegetable = new Map<
    string,
    Array<{ date: string; week: number }>
  >()
  for (const entry of plantingEntries) {
    const vegId =
      typeof entry.vegetable === 'object'
        ? (entry.vegetable as { id: string }).id
        : entry.vegetable
    const list = plantingByVegetable.get(vegId) ?? []
    list.push({ date: entry.date, week: getISOWeek(new Date(entry.date)) })
    plantingByVegetable.set(vegId, list)
  }

  for (const veg of vegetables) {
    const vegSowings = (sowingByVegetable.get(veg.id) ?? []).sort(
      (a, b) => a.week - b.week
    )
    const vegPlantings = (plantingByVegetable.get(veg.id) ?? []).sort(
      (a, b) => a.week - b.week
    )

    const rowSpacingCm = veg.data.rowSpacingCm
    const plantSpacingCm = veg.data.plantSpacingCm
    // For Vorkultur plants without explicit weeksToPlantOut, default to 6 weeks
    const weeksToPlantOut =
      veg.data.weeksToPlantOut ?? (!veg.data.directSow ? 6 : undefined)

    let hasAnyEntry = false

    for (const window of veg.data.sowingWindows) {
      const firstWeek = window.from
      const lastWeek = window.until
      const underCover = window.underCover ?? false
      const overwintering = window.overwintering ?? false

      // Find sowing log entries within this window
      const windowSowings = vegSowings.filter(
        (l) => l.week >= firstWeek && l.week <= lastWeek
      )

      // Add all done sowing entries to the calendar
      for (let i = 0; i < windowSowings.length; i++) {
        hasAnyEntry = true
        addToMap(calendarWeekMap, windowSowings[i].week, {
          name: veg.data.name,
          id: veg.id,
          succession: i + 1,
          underCover,
          overwintering,
          directSow: veg.data.directSow,
          note: window.note,
          lastPossibleWeek: lastWeek,
          status: 'done',
          actualDate: windowSowings[i].date,
          actualWeek: windowSowings[i].week,
          type: 'sowing',
          rowSpacingCm,
          plantSpacingCm,
        })

        // For Vorkultur crops: add plant-out reminder
        if (!veg.data.directSow && weeksToPlantOut) {
          const plannedPlantOutWeek = windowSowings[i].week + weeksToPlantOut
          // Check if this succession has been planted
          const plantingRecord = vegPlantings[i]
          if (plantingRecord) {
            // Already planted — show as done at actual planting week
            addToMap(calendarWeekMap, plantingRecord.week, {
              name: veg.data.name,
              id: veg.id,
              succession: i + 1,
              underCover: false,
              overwintering: false,
              directSow: false,
              lastPossibleWeek: plantingRecord.week,
              status: 'done',
              actualDate: plantingRecord.date,
              actualWeek: plantingRecord.week,
              type: 'plantOut',
              rowSpacingCm,
              plantSpacingCm,
            })
          } else {
            // Not yet planted — show in current week if planned week passed, else future week
            const showInWeek =
              currentWeek >= plannedPlantOutWeek
                ? currentWeek
                : plannedPlantOutWeek
            const plantOutStatus: SowingCalendarEntry['status'] =
              currentWeek >= plannedPlantOutWeek ? 'available' : 'upcoming'
            // lastPossibleWeek = far future so it never disappears until planted
            addToMap(calendarWeekMap, showInWeek, {
              name: veg.data.name,
              id: veg.id,
              succession: i + 1,
              underCover: false,
              overwintering: false,
              directSow: false,
              lastPossibleWeek: 99,
              status: plantOutStatus,
              type: 'plantOut',
              rowSpacingCm,
              plantSpacingCm,
            })
          }
        }
      }

      // If the sowing window has completely passed, no more sowing entries needed
      if (currentWeek > lastWeek) continue

      if (windowSowings.length === 0) {
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
          directSow: veg.data.directSow,
          note: window.note,
          lastPossibleWeek: lastWeek,
          status,
          type: 'sowing',
          rowSpacingCm,
          plantSpacingCm,
        })
      } else if (window.successionIntervalWeeks) {
        // Has been sown, check if next succession is due
        const lastSownWeek = windowSowings[windowSowings.length - 1].week
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
            succession: windowSowings.length + 1,
            underCover,
            overwintering,
            directSow: veg.data.directSow,
            note: window.note,
            lastPossibleWeek: lastWeek,
            status,
            type: 'sowing',
            rowSpacingCm,
            plantSpacingCm,
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
      (e) =>
        e.id === entry.id &&
        e.succession === entry.succession &&
        e.type === entry.type
    )
  ) {
    existing.push(entry)
  }
  map.set(week, existing)
}
