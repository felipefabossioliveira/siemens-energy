import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { reset } from '@/features/dashboard/dashboardSlice'
import { useWebSocket } from '@/shared/hooks/useWebSocket'
import { MetricCard } from './MetricCard'
import { DoughnutChart, HorizontalBarChart } from './DashboardChart'
import { DataTable } from './DataTable'
import { cn } from '@/shared/lib/utils'

// ─── WS status badge ──────────────────────────────────────────────────────────
function WsStatusBadge({ status }: { status: string }) {
  return (
    <div className={cn(
      'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium',
      status === 'connected'    && 'bg-emerald-500/10 text-emerald-400',
      status === 'connecting'   && 'bg-yellow-500/10 text-yellow-400',
      status === 'disconnected' && 'bg-siemens-border text-siemens-muted',
      status === 'error'        && 'bg-red-500/10 text-red-400',
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'connected'    && 'bg-emerald-400 animate-pulse',
        status === 'connecting'   && 'bg-yellow-400 animate-pulse',
        status === 'disconnected' && 'bg-siemens-muted',
        status === 'error'        && 'bg-red-400',
      )} />
      {status === 'connected'    && 'Live'}
      {status === 'connecting'   && 'Connecting…'}
      {status === 'disconnected' && 'Disconnected'}
      {status === 'error'        && 'Error'}
    </div>
  )
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-5 animate-pulse">
      <div className="h-3 w-24 bg-siemens-border rounded mb-4" />
      <div className="h-8 w-20 bg-siemens-border rounded" />
    </div>
  )
}

function SkeletonBlock() {
  return (
    <div className="glass rounded-xl p-6 animate-pulse h-72">
      <div className="h-3 w-32 bg-siemens-border rounded mb-3" />
      <div className="h-2 w-20 bg-siemens-border rounded mb-6" />
      <div className="h-44 bg-siemens-border/50 rounded-lg" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const dispatch   = useAppDispatch()
  const navigate   = useNavigate()
  const { user }   = useAppSelector((s) => s.auth)
  const { data, loading, error, wsStatus, lastUpdated } = useAppSelector((s) => s.dashboard)

  useWebSocket()

  const handleLogout = () => {
    dispatch(reset())
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  const updatedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString()
    : null

  // Derived totals for metric cards
  const totalEquipment  = data?.equipments.reduce((s, i) => s + i.count, 0) ?? 0
  const totalRelief     = data?.reliefDevices.reduce((s, i) => s + i.count, 0) ?? 0
  const totalSizing     = data?.sizingCalculationTypes.reduce((s, i) => s + i.value, 0) ?? 0
  const totalScenarios  = data?.scenarios.reduce((s, i) => s + i.count, 0) ?? 0

  return (
    <div className="min-h-screen bg-siemens-dark">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,160,160,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,160,160,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 glass border-b border-siemens-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-siemens-teal to-siemens-green flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">SE</span>
            </div>
            <span className="font-display text-sm font-semibold text-white hidden sm:block">
              Siemens Energy
            </span>
            <span className="text-siemens-border hidden sm:block">|</span>
            <span className="text-siemens-muted text-sm hidden sm:block">
              {data?.plantInfo.name ?? 'Operations Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <WsStatusBadge status={wsStatus} />

            {updatedTime && (
              <span className="text-siemens-muted text-xs hidden md:block font-mono">
                Updated {updatedTime}
              </span>
            )}

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-medium leading-tight">{user?.name}</p>
                <p className="text-siemens-muted text-xs capitalize">{user?.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siemens-teal to-siemens-green flex items-center justify-center text-siemens-dark font-bold text-sm">
                {(user?.name ?? 'U')[0].toUpperCase()}
              </div>
            </div>

            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="flex items-center gap-1.5 text-siemens-muted hover:text-white text-sm transition-colors border border-siemens-border hover:border-siemens-muted rounded-lg px-3 py-1.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 relative z-10">

        {/* Page title */}
        <div className="animate-fade-in">
          <h2 className="font-display text-2xl font-bold text-white">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'},{' '}
            <span className="gradient-text">{user?.name}</span>
          </h2>
          {data?.plantInfo && (
            <p className="text-siemens-muted text-sm mt-1">
              {data.plantInfo.description} · Author: {data.plantInfo.author}
            </p>
          )}
        </div>

        {/* Error */}
        {error && !loading && (
          <div role="alert" className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 animate-fade-in">
            <svg className="w-5 h-5 text-red-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-400 font-medium text-sm">Connection issue</p>
              <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading && !data ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <MetricCard label="Total Equipment"    value={totalEquipment}  index={0} />
              <MetricCard label="Relief Devices"     value={totalRelief}     index={1} />
              <MetricCard label="Sizing Calcs"       value={totalSizing}     index={2} />
              <MetricCard label="Scenarios"          value={totalScenarios}  index={3} />
            </>
          )}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {loading && !data ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} />)
          ) : (
            <>
              <DoughnutChart
                title="Equipment by Type"
                items={(data?.equipments ?? []).map((e) => ({ label: e.type, value: e.count }))}
              />
              <DoughnutChart
                title="Relief Devices by Type"
                items={(data?.reliefDevices ?? []).map((e) => ({ label: e.type, value: e.count }))}
              />
              <HorizontalBarChart
                title="Sizing Calculation Types"
                items={(data?.sizingCalculationTypes ?? []).map((e) => ({ label: e.name, value: e.value }))}
              />
            </>
          )}
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading && !data ? (
            Array.from({ length: 2 }).map((_, i) => <SkeletonBlock key={i} />)
          ) : (
            <>
              <DataTable
                title="Equipment"
                subtitle={`${totalEquipment} total items · updates every 5s`}
                rows={data?.equipments ?? []}
                columns={[
                  { key: 'type',  label: 'Type'  },
                  { key: 'count', label: 'Count' },
                ]}
              />
              <DataTable
                title="Scenarios"
                subtitle={`${totalScenarios} total scenarios · updates every 5s`}
                rows={data?.scenarios ?? []}
                columns={[
                  { key: 'type',  label: 'Scenario Type' },
                  { key: 'count', label: 'Count'         },
                ]}
              />
            </>
          )}
        </div>

        {/* Relief Devices full table */}
        {!loading && data && (
          <DataTable
            title="Relief Devices"
            subtitle={`${totalRelief} total devices · updates every 5s`}
            rows={data.reliefDevices}
            columns={[
              { key: 'type',  label: 'Device Type' },
              { key: 'count', label: 'Count'        },
            ]}
          />
        )}
      </main>
    </div>
  )
}
