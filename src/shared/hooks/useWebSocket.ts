import { useEffect, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setData, setError, setWsStatus } from '@/features/dashboard/dashboardSlice'
import { WS_URL } from '@/shared/lib/api'
import type { WsMessage } from '@/shared/types'

const RECONNECT_DELAY = 3000

export function useWebSocket() {
  const dispatch = useAppDispatch()
  const token = useAppSelector((s) => s.auth.token)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  const connect = useCallback(() => {
    if (!mountedRef.current || !token) return

    dispatch(setWsStatus('connecting'))

    const ws = new WebSocket(`${WS_URL}?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      if (!mountedRef.current) return
      dispatch(setWsStatus('connected'))
    }

    ws.onmessage = (event: MessageEvent) => {
      if (!mountedRef.current) return
      try {
        const msg = JSON.parse(event.data as string) as WsMessage

        if ((msg.event === 'initial' || msg.event === 'update') && msg.data) {
          dispatch(setData({ data: msg.data, timestamp: msg.timestamp }))
        }

        if (msg.event === 'error') {
          dispatch(setError(msg.message ?? 'WebSocket error'))
        }
      } catch {
        // Ignore malformed messages
      }
    }

    ws.onerror = () => {
      if (!mountedRef.current) return
      dispatch(setWsStatus('error'))
      dispatch(setError('WebSocket connection error. Retrying…'))
    }

    ws.onclose = () => {
      if (!mountedRef.current) return
      dispatch(setWsStatus('disconnected'))
      reconnectTimer.current = setTimeout(() => {
        if (mountedRef.current) connect()
      }, RECONNECT_DELAY)
    }
  }, [dispatch, token])

  useEffect(() => {
    mountedRef.current = true
    connect()
    return () => {
      mountedRef.current = false
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])
}
