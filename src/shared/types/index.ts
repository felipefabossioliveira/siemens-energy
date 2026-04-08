// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number
  name: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// ─── Dashboard – mirrors data.json / DashboardData from the API ───────────────

export interface EquipmentItem {
  type: string
  count: number
}

export interface ReliefDeviceItem {
  type: string
  count: number
}

export interface SizingCalculationType {
  name: string
  value: number
}

export interface ScenarioItem {
  type: string
  count: number
}

export interface PlantInfo {
  name: string
  author: string
  createdAt: string
  description: string
}

export interface DashboardData {
  plantInfo: PlantInfo
  equipments: EquipmentItem[]
  reliefDevices: ReliefDeviceItem[]
  sizingCalculationTypes: SizingCalculationType[]
  scenarios: ScenarioItem[]
}

// ─── WebSocket message envelope ───────────────────────────────────────────────

export interface WsMessage {
  event: 'initial' | 'update' | 'error'
  data?: DashboardData
  message?: string
  timestamp: string
}

// ─── Redux slice state ────────────────────────────────────────────────────────

export interface DashboardState {
  data: DashboardData | null
  loading: boolean
  error: string | null
  wsStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastUpdated: string | null
}
