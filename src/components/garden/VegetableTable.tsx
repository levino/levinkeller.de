import type { CollectionEntry } from 'astro:content'
import type { FC } from 'react'

export const VegetableTable: FC<{
  vegetables: CollectionEntry<'vegetables'>[]
  caption: string
}> = ({ vegetables, caption }) => (
  <table className="table">
    <caption className="mb-2 text-lg font-semibold">{caption}</caption>
    <thead>
      <tr>
        <th>Name</th>
        <th>Aussaaten</th>
      </tr>
    </thead>
    <tbody>
      {vegetables.map((vegetable) => (
        <tr key={vegetable.id}>
          <th>
            <a href={`/de/garden/vegetables/${vegetable.id}`}>
              {vegetable.data.name}
            </a>
          </th>
          <td>{vegetable.data.sowings.length} Termine</td>
        </tr>
      ))}
    </tbody>
  </table>
)
