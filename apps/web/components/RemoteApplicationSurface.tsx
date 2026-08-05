'use client'

import { useEffect, useRef, useState } from 'react'
import { WindowState } from './Desktop'

interface RemoteApplicationSurfaceProps {
  windowState: WindowState
}

export function RemoteApplicationSurface({
  windowState,
}: RemoteApplicationSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting')
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (windowState.status === 'failed') {
      setStatus('disconnected')
      return
    }

    const url = windowState.deployedUrl
    const ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'
    wsRef.current = ws

    ws.onopen = () => setStatus('connected')
    ws.onclose = () => setStatus('disconnected')

    ws.onmessage = async event => {
      if (event.data instanceof ArrayBuffer) {
        const blob = new Blob([event.data], { type: 'image/jpeg' })
        const imageBitmap = await createImageBitmap(blob)
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)
        }
        imageBitmap.close()
      }
    }

    return () => {
      ws.close()
    }
  }, [windowState.deployedUrl, windowState.status])

  // Handle Resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        sendInput({
          type: 'resize',
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    observer.observe(canvas)
    return () => observer.disconnect()
  }, [status])

  const sendInput = (
    event: Record<string, unknown> | { type: string; [key: string]: unknown }
  ) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event))
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    sendInput({ type: 'mouse_move', x, y })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    sendInput({ type: 'mouse_button', button: e.button, pressed: true, x, y })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    sendInput({
      type: 'key',
      code: e.code,
      key: e.key,
      pressed: true,
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      meta: e.metaKey,
    })
  }

  const handleWheel = (e: React.WheelEvent) => {
    sendInput({
      type: 'scroll',
      deltaY: e.deltaY,
      deltaX: e.deltaX,
    })
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-black">
      {status !== 'connected' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-10 backdrop-blur-sm">
          {windowState.status === 'failed'
            ? 'Deployment failed. Please close and try again.'
            : status === 'connecting'
              ? 'Connecting to display...'
              : 'Disconnected from display'}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-full object-contain focus:outline-none"
        tabIndex={0}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
      />
    </div>
  )
}
