import { memo } from 'react'
import { cn } from '@/shared/lib/utils'

interface DataTableProps<T extends Record<string, unknown>> {
  rows: T[]
  columns: { key: keyof T; label: string }[]
  title?: string
  subtitle?: string
}

export const DataTable = memo(function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  title = 'Data Table',
  subtitle,
}: DataTableProps<T>) {
  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return '—'
    if (typeof val === 'number') return val.toLocaleString()
    return String(val)
  }

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-display text-sm font-semibold text-white mb-1">{title}</h3>
      {subtitle && <p className="text-siemens-muted text-xs mb-4">{subtitle}</p>}

      {rows.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-siemens-muted text-sm">
          No data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="text-left text-xs uppercase tracking-widest text-siemens-muted font-medium pb-3 pr-6 whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-siemens-border/50">
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={cn('transition-colors duration-150 hover:bg-siemens-border/20')}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="py-3 pr-6 text-slate-300 whitespace-nowrap">
                      {formatValue(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}) as <T extends Record<string, unknown>>(props: DataTableProps<T>) => JSX.Element
