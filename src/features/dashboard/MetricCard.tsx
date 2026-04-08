import { memo } from 'react'

interface MetricCardProps {
  label: string
  value: number | string
  icon?: React.ReactNode
  index?: number
}

export const MetricCard = memo(function MetricCard({ label, value, icon, index = 0 }: MetricCardProps) {
  return (
    <div
      className="glass rounded-xl p-5 card-hover animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-siemens-muted text-xs uppercase tracking-widest font-medium">
          {label}
        </p>
        {icon && <span className="text-siemens-teal">{icon}</span>}
      </div>
      <span className="font-display text-3xl font-bold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  )
})
