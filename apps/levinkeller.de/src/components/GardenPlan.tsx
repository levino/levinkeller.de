import styles from './GardenPlan.module.css'

const HOUSE_DIMENSIONS = {
  width: 1650,
  height: 1000,
}

export const GardenPlan = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="-3000 -1400, 6000 9000"
  >
    <g transform="translate(-3000,-1400)">
      <rect width="100%" height="100%" fill="white" />
      <Grid />
    </g>
    <g transform="translate(-2654,-500) rotate(-9)">
      <line
        id="borderNorth"
        x1="1254"
        y1="0"
        x2="4354"
        y2="0"
        stroke="black"
        stroke-width="10"
      />
      <line
        id="borderWest"
        x1="1254"
        y1="0"
        x2="0000"
        y2="7942"
        stroke="black"
        stroke-width="10"
      />
      <line
        id="borderEast"
        x1="4354"
        y1="0"
        x2="2945"
        y2="8626"
        stroke="black"
        stroke-width="10"
      />
      <line
        id="borderSouth"
        x1="0"
        y1="7942"
        x2="2945"
        y2="8626"
        stroke="black"
        stroke-width="10"
      />
    </g>
    <House />
    <g transform="translate(1000,0)">
      <circle
        id="tillaCordataWest"
        r="400"
        fill="green"
        stroke="black"
        stroke-width="10"
        cx="400"
      />
      <g>
        <circle
          id="tillaCordataEast"
          r="400"
          fill="green"
          stroke="black"
          stroke-width="10"
        />
        <text className={styles.text} text-anchor="middle" stroke="#51c5cf">
          Winterlinde
        </text>
      </g>
    </g>

    <g transform="translate(800,1000)">
      <circle
        id="parrotiaPersica"
        r="350"
        fill="green"
        stroke="black"
        stroke-width="10"
      />
      <text className={styles.text} text-anchor="middle" stroke="#51c5cf">
        Eisenholzbaum
      </text>
    </g>
    <g transform="translate(0,1300)">
      <circle
        id="populusTremula"
        r="500"
        fill="green"
        stroke="black"
        stroke-width="10"
      />
      <text className={styles.text} text-anchor="middle" stroke="#51c5cf">
        Zitterpappel
      </text>
    </g>
    <g transform="translate(-800,1000)">
      <circle
        id="betulaNigra"
        r="350"
        fill="green"
        stroke="black"
        stroke-width="10"
      />
      <text className={styles.text} text-anchor="middle" stroke="#51c5cf">
        Schwarzbirke
      </text>
    </g>
    <g transform="translate(600,4000)">
      <LargePond />
    </g>
    <g transform="translate(-300,2000)">
      <VegGarden />
    </g>
    <g transform="translate(-1400,-700)">
      <Hedge />
    </g>
  </svg>
)

const House = () => (
  <rect
    id="house"
    width={HOUSE_DIMENSIONS.width}
    height={HOUSE_DIMENSIONS.height}
    transform={`translate(-${HOUSE_DIMENSIONS.width / 2}, -${
      HOUSE_DIMENSIONS.height / 2
    })`}
    fill="white"
    stroke="black"
    stroke-width="10"
  />
)

const LargePond = () => (
  <ellipse
    cx="0"
    cy="0"
    rx="800"
    ry="500"
    fill="blue"
    stroke="black"
    strokeWidth="10"
  />
)

const VegGarden = () => <rect width="1500" height="1200" fill="saddlebrown" />

const Hedge = () => <rect width="400" height="3000" fill="green" />

const Grid = () => (
  <>
    <defs>
      <pattern
        id="smallGrid"
        width="100"
        height="100"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 100 0 L 0 0 0 100"
          fill="none"
          stroke="gray"
          stroke-width="5"
        />
      </pattern>
      <pattern
        id="grid"
        width="1000"
        height="1000"
        patternUnits="userSpaceOnUse"
      >
        <rect width="1000" height="1000" fill="url(#smallGrid)" />
        <path
          d="M 1000 0 L 0 0 0 1000"
          fill="none"
          stroke="gray"
          stroke-width="10"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </>
)
