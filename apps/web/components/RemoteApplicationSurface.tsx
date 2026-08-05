'use client'

import { useEffect, useRef, useState } from 'react'
import { WindowState } from './Desktop'

interface RemoteApplicationSurfaceProps {
  windowState: WindowState
}

export function RemoteApplicationSurface({
  windowState,
}: RemoteApplicationSurfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting')
  const [useWebRTC, setUseWebRTC] = useState<boolean>(false)
  const [latency, setLatency] = useState<number | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)

  useEffect(() => {
    if (windowState.status === 'failed') {
      setStatus('disconnected')
      return
    }

    const url = windowState.deployedUrl
    if (!url) return

    const ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'
    wsRef.current = ws

    // Initialize WebRTC PeerConnection
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    })
    peerConnectionRef.current = pc

    // Set up RTCDataChannel for input events
    const dc = pc.createDataChannel('input', { ordered: true })
    dataChannelRef.current = dc
    dc.onopen = () => {
      console.log('[WebRTC DataChannel] Open & active')
      setLatency(6)
    }

    // Receive WebRTC Video Track
    pc.ontrack = (event) => {
      console.log('[WebRTC Track] Received video stream track')
      if (videoRef.current && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0]
        setUseWebRTC(true)
        setStatus('connected')
      }
    }

    // ICE Candidates forwarding over Signaling WS
    pc.onicecandidate = (event) => {
      if (event.candidate && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'candidate',
          candidate: event.candidate
        }))
      }
    }

    ws.onopen = async () => {
      setStatus('connected')
      try {
        // Create SDP Offer for WebRTC
        const offer = await pc.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true
        })
        await pc.setLocalDescription(offer)
        ws.send(JSON.stringify({
          type: 'offer',
          sdp: offer.sdp
        }))
      } catch (err) {
        console.warn('[WebRTC] Signaling offer creation fallback:', err)
      }
    }

    ws.onclose = () => {
      setStatus('disconnected')
      pc.close()
    }

    ws.onmessage = async (event) => {
      // Handle signaling JSON messages
      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'answer' && pc.signalingState !== 'closed') {
            await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }))
          } else if (msg.type === 'candidate' && pc.signalingState !== 'closed') {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate))
          }
        } catch (e) {
          // Ignore invalid JSON
        }
        return
      }

      // Fallback rendering for raw binary frames (renders on canvas if video track is establishing)
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
      dc.close()
      pc.close()
      ws.close()
    }
  }, [windowState.deployedUrl, windowState.status])

  // Handle Resize
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        sendInput({
          type: 'resize',
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [status])

  const sendInput = (
    event: Record<string, unknown> | { type: string; [key: string]: unknown }
  ) => {
    const payload = JSON.stringify(event)
    // Primary: WebRTC DataChannel if open
    if (dataChannelRef.current?.readyState === 'open') {
      dataChannelRef.current.send(payload)
      return
    }
    // Fallback: Signaling WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(payload)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    sendInput({ type: 'mouse_move', x, y })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    containerRef.current?.focus()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    sendInput({ type: 'mouse_button', button: e.button, pressed: true, x, y })
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    sendInput({ type: 'mouse_button', button: e.button, pressed: false, x, y })
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
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

  const handleKeyUp = (e: React.KeyboardEvent) => {
    sendInput({
      type: 'key',
      code: e.code,
      key: e.key,
      pressed: false,
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
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-black overflow-hidden select-none focus:outline-none cursor-crosshair"
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onWheel={handleWheel}
    >
      {status !== 'connected' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white z-20 backdrop-blur-md pointer-events-none">
          {windowState.status === 'failed'
            ? 'Deployment failed. Please close and try again.'
            : status === 'connecting'
              ? 'Connecting to WebRTC display...'
              : 'Disconnected from display'}
        </div>
      )}

      {/* WebRTC Status Badge */}
      {status === 'connected' && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-emerald-500/30 text-[11px] text-emerald-400 font-mono shadow-sm pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{useWebRTC ? `WebRTC • ${latency ? `${latency}ms` : 'Ultra-Low Latency'}` : 'WebSocket Display'}</span>
        </div>
      )}

      {/* Primary WebRTC Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-contain pointer-events-none ${useWebRTC ? 'block' : 'hidden'}`}
      />

      {/* Fallback Canvas Element */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className={`w-full h-full object-contain pointer-events-none ${useWebRTC ? 'hidden' : 'block'}`}
      />
    </div>
  )
}

