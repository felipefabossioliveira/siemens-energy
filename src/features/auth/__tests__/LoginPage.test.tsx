import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../authSlice'
import dashboardReducer from '@/features/dashboard/dashboardSlice'
import LoginPage from '../LoginPage'

const makeStore = () =>
  configureStore({ reducer: { auth: authReducer, dashboard: dashboardReducer } })

const renderLogin = () =>
  render(
    <Provider store={makeStore()}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  )

describe('LoginPage', () => {
  it('renders username and password fields', () => {
    renderLogin()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders a Sign In button', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('Sign In button is disabled when loading', () => {
    const store = configureStore({
      reducer: { auth: authReducer, dashboard: dashboardReducer },
      preloadedState: {
        auth: { user: null, token: null, isAuthenticated: false, loading: true, error: null },
      },
    })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    )
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })
})
