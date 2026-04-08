import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer, { setData, setError, setWsStatus, reset } from '../dashboardSlice'
import type { DashboardData } from '@/shared/types'

const makeStore = () =>
  configureStore({ reducer: { dashboard: dashboardReducer } })

const mockData: DashboardData = {
  plantInfo: { name: 'Test Plant', author: 'Tester', createdAt: '2025-01-01T00:00:00Z', description: 'Test' },
  equipments: [{ type: 'Vessel Vertical', count: 6 }],
  reliefDevices: [{ type: 'Conventional', count: 12 }],
  sizingCalculationTypes: [{ name: 'Vapor', value: 78 }],
  scenarios: [{ type: 'Non-rate dependent', count: 142 }],
}

describe('dashboardSlice', () => {
  it('should start in loading state', () => {
    const store = makeStore()
    expect(store.getState().dashboard.loading).toBe(true)
    expect(store.getState().dashboard.data).toBeNull()
  })

  it('setData should update data and clear loading/error', () => {
    const store = makeStore()
    store.dispatch(setData({ data: mockData, timestamp: new Date().toISOString() }))
    const { dashboard } = store.getState()
    expect(dashboard.data).toEqual(mockData)
    expect(dashboard.loading).toBe(false)
    expect(dashboard.error).toBeNull()
  })

  it('setError should set error message and clear loading', () => {
    const store = makeStore()
    store.dispatch(setError('Connection failed'))
    const { dashboard } = store.getState()
    expect(dashboard.error).toBe('Connection failed')
    expect(dashboard.loading).toBe(false)
  })

  it('setWsStatus should update ws connection status', () => {
    const store = makeStore()
    store.dispatch(setWsStatus('connected'))
    expect(store.getState().dashboard.wsStatus).toBe('connected')
  })

  it('reset should restore initial state', () => {
    const store = makeStore()
    store.dispatch(setData({ data: mockData, timestamp: new Date().toISOString() }))
    store.dispatch(reset())
    const { dashboard } = store.getState()
    expect(dashboard.data).toBeNull()
    expect(dashboard.loading).toBe(true)
    expect(dashboard.wsStatus).toBe('connecting')
  })
})
