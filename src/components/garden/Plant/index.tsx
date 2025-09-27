import type { CollectionEntry } from 'astro:content'
import { MONTHS_DE, MONTHS_EN } from '@levino/shipyard-base'
import {
  IconCactus,
  IconDroplet,
  IconDropletFilled,
  IconDropletHalf2Filled,
  IconFlower,
  IconMoon,
  IconSeeding,
  IconSun,
  IconSunMoon,
  IconPalette,
} from '@tabler/icons-react'
import type { FC, PropsWithChildren } from 'react'

type Props = { plant: CollectionEntry<'plants'> }

const flowerColorMap: Record<string, string> = {
  'wine-red': '#722F37',
  red: '#DC143C',
  blue: '#4169E1',
  yellow: '#FFD700',
  white: '#FFFFFF',
  pink: '#FFC0CB',
  green: '#228B22',
  brown: '#8B4513',
  orange: '#FF8C00',
  violet: '#8B7AB8',
  rose: '#FF007F',
  black: '#1C1C1C',
  purple: '#800080',
}

const flowerColorNames: Record<string, string> = {
  'wine-red': 'Weinrot',
  red: 'Rot',
  blue: 'Blau',
  yellow: 'Gelb',
  white: 'Weiß',
  pink: 'Rosa',
  green: 'Grün',
  brown: 'Braun',
  orange: 'Orange',
  violet: 'Violett',
  rose: 'Rose',
  black: 'Schwarz',
  purple: 'Lila',
}

export const Plant: FC<PropsWithChildren<Props>> = ({ plant, children }) => (
  <div className="py-4">
    <h1 className="text-3xl font-bold">{plant.data.name.latin}</h1>
    <h2 className="text-xl">{plant.data.name.german}</h2>
    <div className="stats stats-vertical sm:stats-horizontal shadow w-full">
      <Dimensions plant={plant} />
      <Soil plant={plant} />
      <Sun plant={plant} />
    </div>
    {plant.data.flowerColor && plant.data.flowerColor.length > 0 && (
      <FlowerColors plant={plant} />
    )}
    {plant.data.images && (
      <div className="carousel aspect-[4/3] rounded-box">
        {plant.data.images.map((image, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Did not find a better key here
          <div className="carousel-item aspect-[4/3]" key={index}>
            <img
              className="w-full object-cover"
              src={image.src.src}
              alt={image.alt}
            />
          </div>
        ))}
      </div>
    )}
    <PlantTable plant={plant} />
    <div className="py-4">{children}</div>
  </div>
)

const FlowerColors: FC<Props> = ({ plant }) => (
  <div className="stats shadow w-full mt-4">
    <div className="stat">
      <div className="stat-figure text-primary">
        <IconPalette className="w-8 h-8" />
      </div>
      <div className="stat-title">Blütenfarbe</div>
      <div className="stat-value">
        <div className="flex flex-wrap gap-2">
          {plant.data.flowerColor.map((color) => (
            <div
              key={color}
              className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1"
            >
              <div
                className="h-4 w-4 rounded-full border border-gray-400"
                style={{ backgroundColor: flowerColorMap[color] }}
              />
              <span className="text-sm">{flowerColorNames[color]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const Sun: FC<Props> = ({ plant }) => (
  <div className="stat">
    <div className="stat-title">Sonne</div>
    <div className="stat-value">
      {plant.data.sunExposure.map((sunExposure, key) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Did not find a better key here
        <ExposureBadge key={key} sunExposure={sunExposure} />
      ))}
    </div>
  </div>
)

const ExposureBadge: FC<{
  sunExposure: 'full' | 'semi-shade' | 'shade' | 'light-shade'
}> = ({ sunExposure }) => {
  switch (sunExposure) {
    case 'full':
      return (
        <div className="tooltip" data-tip="sonnig">
          <IconSun />
        </div>
      )
    case 'semi-shade':
      return (
        <div className="tooltip" data-tip="halbschattig">
          <IconSunMoon />
        </div>
      )
    case 'shade':
      return (
        <div className="tooltip" data-tip="schattig">
          <IconMoon />
        </div>
      )
    case 'light-shade':
      return (
        <div className="tooltip" data-tip="Lichter Schatten">
          <IconMoon />
        </div>
      )
  }
}

const Soil: FC<Props> = ({ plant }) => (
  <div className="stat">
    <div className="stat-title">Boden</div>
    <div className="stat-value">
      {plant.data.soil.includes('moist') && (
        <div className="tooltip" data-tip="feucht">
          <IconDropletHalf2Filled />
        </div>
      )}
      {plant.data.soil.includes('dry') && (
        <div className="tooltip" data-tip="trocken">
          <IconCactus />
        </div>
      )}
      {plant.data.soil.includes('normal') && (
        <div className="tooltip" data-tip="normal">
          <IconDroplet />
        </div>
      )}
      {plant.data.soil.includes('wet') && (
        <div className="tooltip" data-tip="nass">
          <IconDropletFilled />
        </div>
      )}
    </div>
  </div>
)

const Dimensions: FC<Props> = ({ plant }) => [
  <div key="height" className="stat">
    <div className="stat-title">Höhe</div>
    <div className="stat-value">{plant.data.height} cm</div>
  </div>,
  <div key="spread" className="stat">
    <div className="stat-title">Breite</div>
    <div className="stat-value">{plant.data.spread} cm</div>
  </div>,
]

const PlantTable: FC<Props> = ({ plant }) => (
  <div className="overflow-x-auto mt-4">
    <table className="w-full table-fixed border-collapse rounded border border-slate-400">
      <thead>
        <tr>
          {MONTHS_DE.map((month, key) => (
            <th
              // biome-ignore lint/suspicious/noArrayIndexKey: Did not find a better key here
              key={key}
              className="border border-slate-400 py-1 sm:py-2 text-center font-normal text-xs sm:text-sm"
            >
              <span className="hidden sm:block">{month.slice(0, 3)}</span>
              <span className="sm:hidden">{month.slice(0, 1)}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {MONTHS_EN.map((month, key) => {
            if (plant.data.floweringSeason.includes(month)) {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: Did not find a better key here
                <td key={key} className="border border-slate-400 py-1 sm:py-2">
                  <IconFlower className="mx-auto h-4 w-4 sm:h-6 sm:w-6" />
                </td>
              )
            }
            // biome-ignore lint/suspicious/noArrayIndexKey: Did not find a better key here
            return <td key={key} className="border border-slate-400 py-1 sm:py-2" />
          })}
        </tr>
        <tr>
          {MONTHS_EN.map((month, key) => {
            if (plant.data.sowingTime?.includes(month)) {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: Did not find a better key here
                <td key={key} className="border border-slate-400 py-1 sm:py-2">
                  <IconSeeding className="mx-auto h-4 w-4 sm:h-6 sm:w-6" />
                </td>
              )
            }
            // biome-ignore lint/suspicious/noArrayIndexKey: Did not find a better key here
            return <td key={key} className="border border-slate-400 py-1 sm:py-2" />
          })}
        </tr>
      </tbody>
    </table>
  </div>
)
