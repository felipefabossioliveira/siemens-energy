import { memo, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const PALETTE = [
  '#00a0a0', '#00d7a0', '#3385ff', '#a78bfa', '#f59e0b',
  '#ef4444', '#10b981', '#6366f1',
]

const CHART_TOOLTIP = {
  backgroundColor: '#141e30',
  borderColor: '#1e2d47',
  borderWidth: 1,
  titleColor: '#6b7fa3',
  bodyColor: '#e2e8f0',
  padding: 12,
  cornerRadius: 8,
}

interface Item { label: string; value: number }

// ─── Doughnut ─────────────────────────────────────────────────────────────────
export const DoughnutChart = memo(function DoughnutChart({
  items,
  title,
}: {
  items: Item[]
  title: string
}) {
  const data = useMemo(() => ({
    labels: items.map((i) => i.label),
    datasets: [{
      data: items.map((i) => i.value),
      backgroundColor: PALETTE.slice(0, items.length).map((c) => c + 'cc'),
      borderColor: PALETTE.slice(0, items.length),
      borderWidth: 1.5,
      hoverOffset: 6,
    }],
  }), [items])

  const total = items.reduce((s, i) => s + i.value, 0)

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#6b7fa3',
          font: { size: 11 },
          padding: 12,
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: CHART_TOOLTIP,
    },
  }), [])

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-display text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-siemens-muted text-xs mb-4">Total: {total}</p>
      <div className="h-52">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  )
})

// ─── Horizontal Bar ───────────────────────────────────────────────────────────
export const HorizontalBarChart = memo(function HorizontalBarChart({
  items,
  title,
}: {
  items: Item[]
  title: string
}) {
  const total = items.reduce((s, i) => s + i.value, 0)

  const data = useMemo(() => ({
    labels: items.map((i) => i.label),
    datasets: [{
      label: 'Value',
      data: items.map((i) => i.value),
      backgroundColor: PALETTE.slice(0, items.length).map((c) => c + 'cc'),
      borderColor: PALETTE.slice(0, items.length),
      borderWidth: 1.5,
      borderRadius: 4,
    }],
  }), [items])

  const options = useMemo(() => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: CHART_TOOLTIP,
    },
    scales: {
      x: {
        grid: { color: 'rgba(30,45,71,0.5)' },
        ticks: { color: '#6b7fa3', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#6b7fa3', font: { size: 11 } },
        border: { display: false },
      },
    },
  }), [])

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-display text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-siemens-muted text-xs mb-4">Total: {total}</p>
      <div className="h-52">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
})
