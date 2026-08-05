'use client'

import { useState, useEffect } from 'react'
import { Dock } from './Dock'
import { DesktopWindow } from './DesktopWindow'
import { useAuth } from './AuthProvider'

export interface WindowState {
  id: string
  appId: string
  instanceId: string
  deployedUrl: string
  status: string
  title: string
  phase?: string
}

export function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([])

  useEffect(() => {
    const fetchWindows = async () => {
      try {
        const res = await fetch('/api/windows')
        if (res.ok) {
          const data = await res.json()
          setWindows(
            data.map(
              (w: {
                window_id: string
                app_id: string
                instance_id: string
                deployed_url: string
                status: string
              }) => ({
                id: w.window_id,
                appId: w.app_id,
                instanceId: w.instance_id,
                deployedUrl: w.deployed_url,
                status: w.status,
                title: 'Chromium',
                phase: 'INITIALIZING',
              })
            )
          )
        }
      } catch (e) {
        console.error('Failed to fetch windows', e)
      }
    }
    fetchWindows()
  }, [])

  const handleLaunchChromium = async () => {
    try {
      const res = await fetch('/api/windows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application: 'chromium' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const newWindow: WindowState = {
        id: data.window_id,
        appId: data.app_id,
        instanceId: data.instance_id,
        deployedUrl: data.deployed_url,
        status: data.status,
        title: 'Chromium',
        phase: 'INITIALIZING',
      }

      setWindows(prev => [...prev, newWindow])

      // Connect to SSE stream
      const eventSource = new EventSource(
        `/api/apps/status/${data.app_id}/stream?instance_id=${data.instance_id}`
      )
      eventSource.onmessage = event => {
        const payload = JSON.parse(event.data)
        
        setWindows(prev =>
          prev.map(w => {
            if (w.id === newWindow.id) {
              if (payload.phase === 'READY') {
                return {
                  ...w,
                  status: 'ready',
                  phase: payload.phase,
                  deployedUrl: payload.deployed_url || 'ws://127.0.0.1:4001',
                }
              } else if (payload.phase === 'FAILED') {
                return { ...w, status: 'failed', phase: payload.phase }
              } else {
                return { ...w, phase: payload.phase }
              }
            }
            return w
          })
        )

        if (payload.phase === 'READY' || payload.phase === 'FAILED') {
          eventSource.close()
        }
      }
    } catch (e) {
      console.error('Failed to launch application:', e)
    }
  }

  const handleCloseWindow = async (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
    try {
      await fetch(`/api/windows/${id}`, { method: 'DELETE' })
    } catch (e) {
      console.error('Failed to delete window', e)
    }
  }

  const { logout } = useAuth()

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Logout Button */}
      <button 
        onClick={logout} 
        className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-all border border-white/10"
        title="Logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>

      {/* Desktop Windows */}
      {windows.map(win => (
        <DesktopWindow
          key={win.id}
          windowState={win}
          onClose={() => handleCloseWindow(win.id)}
        />
      ))}
      <Dock onLaunchChromium={handleLaunchChromium} />
    </div>
  )
}
