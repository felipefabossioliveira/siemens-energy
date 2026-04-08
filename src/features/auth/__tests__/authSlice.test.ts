import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { logout, clearError } from '../authSlice'
import type { AuthState } from '@/shared/types'

const makeStore = (preloaded?: Partial<AuthState>) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: preloaded ? { auth: preloaded as AuthState } : undefined,
  })

describe('authSlice', () => {
  beforeEach(() => { localStorage.clear() })

  it('should have correct initial state when nothing persisted', () => {
    const store = makeStore()
    const { auth } = store.getState()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(auth.token).toBeNull()
  })

  it('logout should clear user and token', () => {
    const store = makeStore({
      user: { id: 1, name: 'Admin User', role: 'administrator' },
      token: 'some-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    })
    store.dispatch(logout())
    const { auth } = store.getState()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('clearError should reset error field', () => {
    const store = makeStore({
      user: null, token: null, isAuthenticated: false, loading: false,
      error: 'Invalid credentials',
    })
    store.dispatch(clearError())
    expect(store.getState().auth.error).toBeNull()
  })
})
