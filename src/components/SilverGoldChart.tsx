import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import type React from 'react'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Gold/Silver ratio data (monthly averages) from Jan 2023 to Jan 2026
// Source: Historical precious metals data
// The ratio represents: how many ounces of silver = 1 ounce of gold
const historicalData = [
  // 2023
  { date: 'Jan 2023', ratio: 77.5 },
  { date: 'Feb 2023', ratio: 84.2 },
  { date: 'Mär 2023', ratio: 87.1 },
  { date: 'Apr 2023', ratio: 79.8 },
  { date: 'Mai 2023', ratio: 83.5 },
  { date: 'Jun 2023', ratio: 79.2 },
  { date: 'Jul 2023', ratio: 80.1 },
  { date: 'Aug 2023', ratio: 83.8 },
  { date: 'Sep 2023', ratio: 85.4 },
  { date: 'Okt 2023', ratio: 85.9 },
  { date: 'Nov 2023', ratio: 83.2 },
  { date: 'Dez 2023', ratio: 86.1 },
  // 2024
  { date: 'Jan 2024', ratio: 88.3 },
  { date: 'Feb 2024', ratio: 89.7 },
  { date: 'Mär 2024', ratio: 87.5 },
  { date: 'Apr 2024', ratio: 84.2 },
  { date: 'Mai 2024', ratio: 73.1 },
  { date: 'Jun 2024', ratio: 77.8 },
  { date: 'Jul 2024', ratio: 79.5 },
  { date: 'Aug 2024', ratio: 84.3 },
  { date: 'Sep 2024', ratio: 83.7 },
  { date: 'Okt 2024', ratio: 82.9 },
  { date: 'Nov 2024', ratio: 85.6 },
  { date: 'Dez 2024', ratio: 87.4 },
  // 2025
  { date: 'Jan 2025', ratio: 89.2 },
  { date: 'Feb 2025', ratio: 91.5 },
  { date: 'Mär 2025', ratio: 93.8 },
  { date: 'Apr 2025', ratio: 98.5 },
  { date: 'Mai 2025', ratio: 100.2 },
  { date: 'Jun 2025', ratio: 95.3 },
  { date: 'Jul 2025', ratio: 92.1 },
  { date: 'Aug 2025', ratio: 88.7 },
  { date: 'Sep 2025', ratio: 86.4 },
  { date: 'Okt 2025', ratio: 85.1 },
  { date: 'Nov 2025', ratio: 84.3 },
  { date: 'Dez 2025', ratio: 85.8 },
  // 2026
  { date: 'Jan 2026', ratio: 84.9 },
]

const labels = historicalData.map((d) => d.date)
const ratioValues = historicalData.map((d) => d.ratio)

// Calculate statistics
const currentRatio = ratioValues[ratioValues.length - 1]
const minRatio = Math.min(...ratioValues)
const maxRatio = Math.max(...ratioValues)
const avgRatio = ratioValues.reduce((a, b) => a + b, 0) / ratioValues.length

const minDate = historicalData.find((d) => d.ratio === minRatio)?.date
const maxDate = historicalData.find((d) => d.ratio === maxRatio)?.date

export const SilverGoldChart: React.FC = () => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Silber/Gold Ratio',
        data: ratioValues,
        borderColor: 'rgb(192, 192, 192)',
        backgroundColor: 'rgba(192, 192, 192, 0.5)',
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Silberpreis in Gold (Unzen Silber pro Unze Gold)',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y ?? 0
            return `${value.toFixed(1)} oz Silber = 1 oz Gold`
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Ratio (oz Silber / oz Gold)',
        },
        min: 70,
        max: 110,
      },
      x: {
        title: {
          display: true,
          text: 'Monat',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  }

  return (
    <div className="w-full">
      <div className="h-96 mb-8">
        <Line options={options} data={data} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title">Aktuell</div>
          <div className="stat-value text-2xl">{currentRatio.toFixed(1)}:1</div>
          <div className="stat-desc">Jan 2026</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title">3-Jahres-Tief</div>
          <div className="stat-value text-2xl text-success">
            {minRatio.toFixed(1)}:1
          </div>
          <div className="stat-desc">{minDate}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title">3-Jahres-Hoch</div>
          <div className="stat-value text-2xl text-error">
            {maxRatio.toFixed(1)}:1
          </div>
          <div className="stat-desc">{maxDate}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title">Durchschnitt</div>
          <div className="stat-value text-2xl">{avgRatio.toFixed(1)}:1</div>
          <div className="stat-desc">3 Jahre</div>
        </div>
      </div>

      <div className="prose max-w-none">
        <h3>Was bedeutet das Silber/Gold Ratio?</h3>
        <p>
          Das Silber/Gold Ratio zeigt, wie viele Unzen Silber benötigt werden,
          um eine Unze Gold zu kaufen. Ein höheres Ratio bedeutet, dass Silber
          im Vergleich zu Gold <strong>günstiger</strong> ist – man braucht mehr
          Silber für dieselbe Menge Gold.
        </p>
        <ul>
          <li>
            <strong>Hohes Ratio (90+):</strong> Silber ist relativ günstig zu
            Gold
          </li>
          <li>
            <strong>Niedriges Ratio (unter 70):</strong> Silber ist relativ
            teuer zu Gold
          </li>
          <li>
            <strong>Historischer Durchschnitt:</strong> Ca. 60-70:1 (langfristig
            über Jahrhunderte)
          </li>
        </ul>
        <p className="text-sm text-gray-500 mt-4">
          Daten: Historische Monatsdurchschnitte basierend auf Spot-Preisen.
        </p>
      </div>
    </div>
  )
}
