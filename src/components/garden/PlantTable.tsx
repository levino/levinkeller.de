import type { CollectionEntry } from 'astro:content'
import {
  CheckIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import type { FC } from 'react'

export const PlantTable: FC<{
  plants: CollectionEntry<'plants'>[]
  caption: string
}> = ({ plants, caption }) => (
  <table className="table">
    <p>{caption}</p>
    <thead>
      <tr>
        <th>Name</th>
        <th>deutscher Name</th>
        <th>vorrätig</th>
      </tr>
    </thead>
    <tbody>
      {plants.map((plant) => (
        <tr key={plant.id}>
          <th>
            <div className="flex items-center gap-2">
              <a href={`/de/garden/plants/${plant.id}`}>
                {plant.data.name.latin}
              </a>
              <a
                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(plant.data.name.latin)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-xs"
                title={`Bilder von ${plant.data.name.latin} auf Google suchen`}
                aria-label={`Bilder von ${plant.data.name.latin} auf Google suchen`}
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </a>
            </div>
          </th>
          <td>{plant.data.name.german}</td>
          <td>{plant.data.inStock ? <CheckIcon /> : <Cross2Icon />}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
