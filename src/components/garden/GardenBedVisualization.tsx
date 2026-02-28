import { type FC, useCallback, useRef, useState } from 'react'

interface PlantGroup {
  key: string
  id: number
  name: string
  color: string
  textColor: string
  plants: string[]
  cx: number
  cy: number
  rx: number
  ry: number
  rotation: number
}

const groups: PlantGroup[] = [
  {
    key: 'sommerwiese-1',
    id: 1,
    name: 'Sommerwiese',
    color: '#e8d44d',
    textColor: '#5a4e00',
    plants: ['Stipa tenuissima', 'Agastache foeniculum', 'Knautia macedonica'],
    cx: 120,
    cy: 110,
    rx: 95,
    ry: 70,
    rotation: -15,
  },
  {
    key: 'herbstfeuer-1',
    id: 2,
    name: 'Herbstfeuer',
    color: '#e07840',
    textColor: '#fff',
    plants: [
      'Pennisetum alopecuroides',
      'Helenium autumnale',
      'Aster novae-angliae',
    ],
    cx: 300,
    cy: 90,
    rx: 100,
    ry: 65,
    rotation: 10,
  },
  {
    key: 'mondschein-1',
    id: 3,
    name: 'Mondschein',
    color: '#c8d8e8',
    textColor: '#2a3a4a',
    plants: [
      'Calamagrostis brachytricha',
      'Gaura lindheimeri',
      "Agastache rugosa 'Alba'",
    ],
    cx: 490,
    cy: 115,
    rx: 90,
    ry: 75,
    rotation: -8,
  },
  {
    key: 'blaue-stunde-1',
    id: 4,
    name: 'Blaue Stunde',
    color: '#6b8db5',
    textColor: '#fff',
    plants: ['Stipa tenuissima', 'Veronica longifolia', 'Hyssopus officinalis'],
    cx: 670,
    cy: 100,
    rx: 85,
    ry: 70,
    rotation: 12,
  },
  {
    key: 'herbstzauber-1',
    id: 5,
    name: 'Herbstzauber',
    color: '#b07db8',
    textColor: '#fff',
    plants: [
      'Calamagrostis brachytricha',
      'Anemone japonica',
      'Aster novi-belgii',
    ],
    cx: 840,
    cy: 110,
    rx: 95,
    ry: 68,
    rotation: -5,
  },
  {
    key: 'sternenreigen-1',
    id: 6,
    name: 'Sternenreigen',
    color: '#a8c8a0',
    textColor: '#2a4a28',
    plants: ['Pennisetum alopecuroides', 'Aster ericoides', 'Astrantia major'],
    cx: 140,
    cy: 270,
    rx: 100,
    ry: 72,
    rotation: 8,
  },
  {
    key: 'praerietraum-1',
    id: 7,
    name: 'Prärietraum',
    color: '#c4a882',
    textColor: '#3a2a10',
    plants: [
      'Miscanthus oligostachyus',
      "Penstemon digitalis 'Husker Red'",
      'Veronica longifolia',
    ],
    cx: 330,
    cy: 280,
    rx: 88,
    ry: 75,
    rotation: -12,
  },
  {
    key: 'sonnentanz-1',
    id: 8,
    name: 'Sonnentanz',
    color: '#e8a848',
    textColor: '#4a3200',
    plants: [
      'Miscanthus oligostachyus',
      'Verbena bonariensis',
      'Echinacea Paradiso',
    ],
    cx: 520,
    cy: 265,
    rx: 95,
    ry: 68,
    rotation: 5,
  },
  {
    key: 'sommerwiese-2',
    id: 1,
    name: 'Sommerwiese',
    color: '#e8d44d',
    textColor: '#5a4e00',
    plants: ['Stipa tenuissima', 'Agastache foeniculum', 'Knautia macedonica'],
    cx: 700,
    cy: 275,
    rx: 85,
    ry: 72,
    rotation: -10,
  },
  {
    key: 'mondschein-2',
    id: 3,
    name: 'Mondschein',
    color: '#c8d8e8',
    textColor: '#2a3a4a',
    plants: [
      'Calamagrostis brachytricha',
      'Gaura lindheimeri',
      "Agastache rugosa 'Alba'",
    ],
    cx: 870,
    cy: 268,
    rx: 80,
    ry: 65,
    rotation: 15,
  },
]

function blobPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rotation: number
): string {
  const points = 8
  const angleStep = (Math.PI * 2) / points
  const wobble = [0.92, 1.08, 0.95, 1.05, 0.9, 1.1, 0.93, 1.07]

  const coords: [number, number][] = []
  const rad = (rotation * Math.PI) / 180

  for (let i = 0; i < points; i++) {
    const angle = angleStep * i
    const w = wobble[i]
    const x =
      cx +
      rx * w * Math.cos(angle) * Math.cos(rad) -
      ry * w * Math.sin(angle) * Math.sin(rad)
    const y =
      cy +
      rx * w * Math.cos(angle) * Math.sin(rad) +
      ry * w * Math.sin(angle) * Math.cos(rad)
    coords.push([x, y])
  }

  let d = `M ${coords[0][0]},${coords[0][1]}`
  for (let i = 0; i < coords.length; i++) {
    const curr = coords[i]
    const next = coords[(i + 1) % coords.length]
    const cpx1 =
      curr[0] +
      (next[0] - coords[(i - 1 + coords.length) % coords.length][0]) * 0.25
    const cpy1 =
      curr[1] +
      (next[1] - coords[(i - 1 + coords.length) % coords.length][1]) * 0.25
    const cpx2 = next[0] - (coords[(i + 2) % coords.length][0] - curr[0]) * 0.25
    const cpy2 = next[1] - (coords[(i + 2) % coords.length][1] - curr[1]) * 0.25
    d += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${next[0]},${next[1]}`
  }
  d += ' Z'
  return d
}

function isInsideEllipse(
  px: number,
  py: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number
): boolean {
  const dx = px - cx
  const dy = py - cy
  return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1
}

export const GardenBedVisualization: FC = () => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const width = 960
  const height = 380

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * width
    const svgY = ((e.clientY - rect.top) / rect.height) * height

    for (const g of groups) {
      if (isInsideEllipse(svgX, svgY, g.cx, g.cy, g.rx, g.ry)) {
        setHoveredKey(g.key)
        return
      }
    }
    setHoveredKey(null)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredKey(null)
  }, [])

  return (
    <div className="my-6">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full rounded-xl border border-base-300 bg-gradient-to-b from-green-50 to-emerald-50"
        style={{ maxHeight: '500px' }}
        role="img"
        aria-label="Beetplanung: Pflanzgruppen als organische Wolken zwischen Haus und Zaun"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <title>Beetplanung mit Pflanzgruppen</title>
        <defs>
          {groups.map((g) => (
            <filter key={g.key} id={`shadow-${g.key}`}>
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodOpacity="0.15"
              />
            </filter>
          ))}
        </defs>

        <text x="20" y="24" fontSize="13" fill="#666" fontFamily="sans-serif">
          HAUS
        </text>
        <line
          x1="0"
          y1="34"
          x2={width}
          y2="34"
          stroke="#aaa"
          strokeDasharray="6 3"
        />

        <text
          x="20"
          y={height - 8}
          fontSize="13"
          fill="#666"
          fontFamily="sans-serif"
        >
          ZAUN
        </text>
        <line
          x1="0"
          y1={height - 24}
          x2={width}
          y2={height - 24}
          stroke="#aaa"
          strokeDasharray="6 3"
        />

        {groups.map((g) => {
          const isHovered = hoveredKey === g.key
          const scale = isHovered ? 1.06 : 1
          return (
            <g
              key={g.key}
              style={{
                cursor: 'pointer',
                transform: `scale(${scale})`,
                transformOrigin: `${g.cx}px ${g.cy}px`,
                transition: 'transform 0.3s ease',
              }}
            >
              <path
                d={blobPath(g.cx, g.cy, g.rx, g.ry, g.rotation)}
                fill={g.color}
                opacity={isHovered ? 0.95 : 0.7}
                filter={`url(#shadow-${g.key})`}
                style={{ transition: 'opacity 0.3s ease' }}
              />
              <text
                x={g.cx}
                y={g.cy - 6}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill={g.textColor}
                fontFamily="sans-serif"
              >
                {g.name}
              </text>
              <text
                x={g.cx}
                y={g.cy + 10}
                textAnchor="middle"
                fontSize="10"
                fill={g.textColor}
                fontFamily="sans-serif"
                opacity="0.75"
              >
                Gruppe {g.id}
              </text>

              {isHovered && (
                <foreignObject
                  x={g.cx - 85}
                  y={g.cy + 20}
                  width="170"
                  height="80"
                >
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      lineHeight: '1.4',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      color: '#333',
                    }}
                  >
                    {g.plants.map((p) => (
                      <div key={p}>
                        <em>{p}</em>
                      </div>
                    ))}
                  </div>
                </foreignObject>
              )}
            </g>
          )
        })}
      </svg>
      <p className="mt-2 text-center text-sm text-base-content/60">
        Hover/Tap auf eine Wolke, um die Pflanzen zu sehen. Einige Gruppen
        werden wiederholt, um Rhythmus zu erzeugen.
      </p>
    </div>
  )
}
