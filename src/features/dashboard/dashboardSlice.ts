import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { DashboardState, DashboardData } from '@/shared/types'

const initialState: DashboardState = {
  data: null,
  loading: true,
  error: null,
  wsStatus: 'connecting',
  lastUpdated: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<{ data: DashboardData; timestamp: string }>) {
      state.data = action.payload.data
      state.lastUpdated = action.payload.timestamp
      state.loading = false
      state.error = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    setWsStatus(state, action: PayloadAction<DashboardState['wsStatus']>) {
      state.wsStatus = action.payload
    },
    reset(state) {
      state.data = null
      state.loading = true
      state.error = null
      state.wsStatus = 'connecting'
      state.lastUpdated = null
    },
  },
})

export const { setData, setLoading, setError, setWsStatus, reset } = dashboardSlice.actions
export default dashboardSlice.reducer
