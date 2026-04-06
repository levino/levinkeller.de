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
  succession: number
  underCover: boolean
  overwintering: boolean
  directSow: boolean
  note?: string
  lastPossibleWeek: number
  status: 'done' | 'available' | 'upcoming'
  actualDate?: string
  actualWeek?: number
  type: 'sowing' | 'plantOut'
  rowSpacingCm?: number
  plantSpacingCm?: number
}

export interface SowingLogEntry {
  /** Collection entry ID, format: YYYY-MM-DD-{vegetable-id} */
  id: string
  vegetable: string
  date: string
}

export interface PlantingLogEntry {
  id: string
  vegetable: string
  date: string
  /** ID of the sowing log entry these plants came from (Vorkultur) */
  sowingId?: string
}

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
 * Matched to plantings via sowingId reference. Unplanted entries whose
 * planned week has passed stay in the current week until logged as planted.
 *
 * Vegetables whose every window has passed without a single sowing are
 * returned in missedVegetables.
 */
export function buildTrackedCalendar(
  vegetables: Array<VegetableInput>,
  sowingEntries: SowingLogEntry[],
  plantingEntries: PlantingLogEntry[],
  currentWeek: number
): TrackedCalendarResult {
  const calendarWeekMap: CalendarWeekMap = new Map()
  const missedVegetables: MissedVegetable[] = []

  // Index sowing log by vegetable ID, sorted by date
  const sowingsByVegetable = new Map<string, SowingLogEntry[]>()
  for (const entry of sowingEntries) {
    const list = sowingsByVegetable.get(entry.vegetable) ?? []
    list.push(entry)
    sowingsByVegetable.set(entry.vegetable, list)
  }
  for (const list of sowingsByVegetable.values()) {
    list.sort((a, b) => a.date.localeCompare(b.date))
  }

  // Index plantings by sowingId for fast lookup
  const plantingBySowingId = new Map<string, PlantingLogEntry>()
  for (const entry of plantingEntries) {
    if (entry.sowingId) {
      plantingBySowingId.set(entry.sowingId, entry)
    }
  }

  for (const veg of vegetables) {
    const vegSowings = sowingsByVegetable.get(veg.id) ?? []
    const rowSpacingCm = veg.data.rowSpacingCm
    const plantSpacingCm = veg.data.plantSpacingCm
    const weeksToPlantOut =
      veg.data.weeksToPlantOut ?? (!veg.data.directSow ? 6 : undefined)

    let hasAnyEntry = false

    for (const window of veg.data.sowingWindows) {
      const firstWeek = window.from
      const lastWeek = window.until
      const underCover = window.underCover ?? false
      const overwintering = window.overwintering ?? false

      const windowSowings = vegSowings.filter((s) => {
        const w = getISOWeek(new Date(s.date))
        return w >= firstWeek && w <= lastWeek
      })

      for (let i = 0; i < windowSowings.length; i++) {
        const sowing = windowSowings[i]
        const sowingWeek = getISOWeek(new Date(sowing.date))
        hasAnyEntry = true

        addToMap(calendarWeekMap, sowingWeek, {
          name: veg.data.name,
          id: veg.id,
          succession: i + 1,
          underCover,
          overwintering,
          directSow: veg.data.directSow,
          note: window.note,
          lastPossibleWeek: lastWeek,
          status: 'done',
          actualDate: sowing.date,
          actualWeek: sowingWeek,
          type: 'sowing',
          rowSpacingCm,
          plantSpacingCm,
        })

        if (!veg.data.directSow && weeksToPlantOut) {
          const plannedPlantOutWeek = sowingWeek + weeksToPlantOut
          const planting = plantingBySowingId.get(sowing.id)

          if (planting) {
            const plantingWeek = getISOWeek(new Date(planting.date))
            addToMap(calendarWeekMap, plantingWeek, {
              name: veg.data.name,
              id: veg.id,
              succession: i + 1,
              underCover: false,
              overwintering: false,
              directSow: false,
              lastPossibleWeek: plantingWeek,
              status: 'done',
              actualDate: planting.date,
              actualWeek: plantingWeek,
              type: 'plantOut',
              rowSpacingCm,
              plantSpacingCm,
            })
          } else {
            const showInWeek =
              currentWeek >= plannedPlantOutWeek
                ? currentWeek
                : plannedPlantOutWeek
            const status: SowingCalendarEntry['status'] =
              currentWeek >= plannedPlantOutWeek ? 'available' : 'upcoming'
            addToMap(calendarWeekMap, showInWeek, {
              name: veg.data.name,
              id: veg.id,
              succession: i + 1,
              underCover: false,
              overwintering: false,
              directSow: false,
              lastPossibleWeek: 99,
              status,
              type: 'plantOut',
              rowSpacingCm,
              plantSpacingCm,
            })
          }
        }
      }

      if (currentWeek > lastWeek) continue

      if (windowSowings.length === 0) {
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
        const lastSownWeek = getISOWeek(
          new Date(windowSowings[windowSowings.length - 1].date)
        )
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
