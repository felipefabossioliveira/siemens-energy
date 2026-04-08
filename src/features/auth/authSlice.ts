import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/shared/lib/api'
import type { AuthState, User } from '@/shared/types'

// ─── Persistence ─────────────────────────────────────────────────────────────
const persistAuth = (user: User, token: string) => {
  localStorage.setItem('auth_token', token)
  localStorage.setItem('auth_user', JSON.stringify(user))
}

const clearAuth = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}

const loadPersistedAuth = (): { user: User | null; token: string | null } => {
  try {
    const token = localStorage.getItem('auth_token')
    const raw = localStorage.getItem('auth_user')
    const user: User | null = raw ? JSON.parse(raw) : null
    return { user, token }
  } catch {
    return { user: null, token: null }
  }
}

// ─── Thunk ───────────────────────────────────────────────────────────────────
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // API endpoint is POST /login (not /auth/login)
      const { data } = await api.post('/login', credentials)
      return data as { user: User; token: string }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Invalid credentials. Please try again.'
      return rejectWithValue(message)
    }
  }
)

// ─── Slice ────────────────────────────────────────────────────────────────────
const persisted = loadPersistedAuth()

const initialState: AuthState = {
  user: persisted.user,
  token: persisted.token,
  isAuthenticated: !!(persisted.user && persisted.token),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      clearAuth()
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        persistAuth(action.payload.user, action.payload.token)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
