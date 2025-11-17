import type React from 'react'

interface Props {
  title: string
  description: string
  href: string
  imageUrl: string
  motivation?: string
  alignRight?: boolean
}

export const PortfolioCard: React.FC<Props> = ({
  title,
  href,
  description,
  imageUrl,
  motivation,
  alignRight = false,
}) => {
  return (
    <div
      className={`mb-8 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-center ${
        alignRight ? 'lg:flex-row-reverse lg:pl-12' : 'lg:pr-12'
      }`}
    >
      {/* Image Section */}
      <div className="w-full lg:w-1/2">
        <a href={href} target="_blank" rel="noopener noreferrer">
          <div className="overflow-hidden rounded-lg shadow-xl transition-transform hover:scale-105">
            <img
              src={imageUrl}
              alt={`Screenshot von ${title}`}
              className="h-auto w-full object-cover"
            />
          </div>
        </a>
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-1/2">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">{title}</h2>
            <p className="text-base-content/80">{description}</p>
            {motivation && (
              <div className="mt-2">
                <p className="text-sm italic text-base-content/60">
                  <span className="font-semibold">Warum: </span>
                  {motivation}
                </p>
              </div>
            )}
            <div className="card-actions mt-4 justify-end">
              <a
                className="btn btn-primary"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Projekt besuchen →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
