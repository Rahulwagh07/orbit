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
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting')
  const [latency, setLatency] = useState<number | null>(null)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const videoReadyRef = useRef(false)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const pointerChannelRef = useRef<RTCDataChannel | null>(null)
  const pendingPointerRef = useRef<Record<string, unknown> | null>(null)
  const pointerFrameRef = useRef<number | null>(null)
  const pendingScrollRef = useRef({ deltaX: 0, deltaY: 0 })
  const scrollFrameRef = useRef<number | null>(null)
  const pressedKeysRef = useRef(new Set<string>())

  useEffect(() => {
    const videoElement = videoRef.current
    const audioElement = audioRef.current
    videoReadyRef.current = false
    setStatus('connecting')
    if (videoElement) videoElement.srcObject = null
    if (audioElement) audioElement.srcObject = null
    if (windowState.status === 'failed') {
      setStatus('disconnected')
      return
    }

    const url = windowState.deployedUrl
    if (!url) {
      setStatus('disconnected')
      return
    }

    let disposed = false
    let retries = 0
    let ws: WebSocket | null = null
    let pc: RTCPeerConnection | null = null
    let connecting = false
    const sockets = new Set<WebSocket>()
    let signalingTimer: ReturnType<typeof setTimeout> | null = null
    let answerTimer: ReturnType<typeof setTimeout> | null = null
    let firstFrameTimer: ReturnType<typeof setTimeout> | null = null

    const closeSocket = (socket: WebSocket) => {
      if (
        socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN
      ) {
        socket.close()
      }
    }

    const clearSessionTimers = () => {
      if (signalingTimer !== null) {
        clearTimeout(signalingTimer)
        signalingTimer = null
      }
      if (answerTimer !== null) {
        clearTimeout(answerTimer)
        answerTimer = null
      }
      if (firstFrameTimer !== null) {
        clearTimeout(firstFrameTimer)
        firstFrameTimer = null
      }
    }

    const releaseSessionKeys = () => {
      const channel = dataChannelRef.current
      if (channel?.readyState === 'open') {
        for (const code of pressedKeysRef.current) {
          channel.send(
            JSON.stringify({
              type: 'key',
              code,
              pressed: false,
              ctrl: false,
              shift: false,
              alt: false,
              meta: false,
            }),
          )
        }
      }
      pressedKeysRef.current.clear()
    }

    const scheduleReconnect = (
      sessionSocket: WebSocket,
      sessionPc: RTCPeerConnection,
      reason: string,
    ) => {
      if (disposed || reconnectTimerRef.current !== null) return
      // Both references must belong to this session. Accepting a match on
      // either side can tear down a newer socket or peer connection.
      if (ws !== sessionSocket || pc !== sessionPc) return

      clearSessionTimers()
      ws = null
      pc = null
      if (peerConnectionRef.current === sessionPc) {
        peerConnectionRef.current = null
      }
      closeSocket(sessionSocket)
      sessionPc.close()
      connecting = false

      const delay = Math.min(4000, 250 * 2 ** Math.min(retries, 4))
      console.warn(`[WebRTC] reconnecting after ${reason}; retry in ${delay}ms`)
      retries++
      setStatus('connecting')
      reconnectTimerRef.current = setTimeout(() => {
        reconnectTimerRef.current = null
        connect()
      }, delay)
    }

    const connect = () => {
      if (
        disposed ||
        connecting ||
        (ws &&
          (ws.readyState === WebSocket.CONNECTING ||
            ws.readyState === WebSocket.OPEN))
      )
        return

      const socket = new WebSocket(url)
      connecting = true
      sockets.add(socket)
      ws = socket
      socket.binaryType = 'arraybuffer'
      socket.onopen = () => {
        connecting = false
      }

      const currentPc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      })
      pc = currentPc
      peerConnectionRef.current = currentPc
      signalingTimer = setTimeout(() => {
        if (!disposed && peerConnectionRef.current === currentPc) {
          scheduleReconnect(socket, currentPc, 'signaling ready timeout')
        }
      }, 20000)
      let sessionVideoReady = false

      const armFirstFrameWatchdog = () => {
        if (firstFrameTimer !== null) clearTimeout(firstFrameTimer)
        firstFrameTimer = setTimeout(() => {
          if (
            !disposed &&
            peerConnectionRef.current === currentPc &&
            !sessionVideoReady
          ) {
            scheduleReconnect(socket, currentPc, 'first video frame timeout')
          }
        }, 10000)
      }

      // Receive video: agent answers with an H264 MediaStreamTrack
      currentPc.addTransceiver('video', { direction: 'recvonly' })
      currentPc.addTransceiver('audio', { direction: 'recvonly' })

      // Input / latency channel
      const dc = currentPc.createDataChannel('input', { ordered: true })
      // Pointer motion is transient. Do not let stale moves queue ahead of
      // clicks or keys on the reliable control channel.
      const pointerDc = currentPc.createDataChannel('pointer', {
        ordered: false,
        maxRetransmits: 0,
      })
      dataChannelRef.current = dc
      pointerChannelRef.current = pointerDc

      dc.onopen = () => {
        if (disposed || peerConnectionRef.current !== currentPc) return
        // Measure real roundtrip latency over the data channel
        setLatency(null)
        const timer = setInterval(() => {
          if (dc.readyState === 'open') {
            dc.send(JSON.stringify({ type: 'ping', t: performance.now() }))
          }
        }, 2000)
        dc.onclose = () => clearInterval(timer)
      }

      dc.onmessage = event => {
        if (disposed || peerConnectionRef.current !== currentPc) return
        try {
          const msg = JSON.parse(String(event.data))
          if (msg.type === 'pong' && typeof msg.t === 'number') {
            setLatency(Math.max(0, performance.now() - msg.t))
          }
        } catch {
          // ignore non-JSON
        }
      }

      currentPc.ontrack = event => {
        if (disposed || peerConnectionRef.current !== currentPc) return
        const stream = event.streams[0] ?? new MediaStream([event.track])
        if (event.track.kind === 'audio') {
          const audio = audioRef.current
          if (!audio) return
          audio.srcObject = stream
          const playAudio = () => {
            audio
              .play()
              .then(() => setAudioBlocked(false))
              .catch(() => setAudioBlocked(true))
          }
          audio.onloadedmetadata = playAudio
          playAudio()
          return
        }
        const video = videoRef.current
        if (video) {
          // Use the stream supplied by the track event. It is the stream the
          // browser's RTP receiver owns, so attaching it directly avoids a
          // blank decoder caused by moving a remote track between streams.
          const videoStream = event.streams[0] ?? new MediaStream([event.track])
          if (video.srcObject !== videoStream) {
            video.srcObject = videoStream
            video.onloadedmetadata = () => {
              video.play().catch(() => undefined)
            }
          }
          video.onplaying = () => {
            if (disposed || peerConnectionRef.current !== currentPc) return
            if (firstFrameTimer !== null) {
              clearTimeout(firstFrameTimer)
              firstFrameTimer = null
            }
            sessionVideoReady = true
            videoReadyRef.current = true
            setStatus('connected')
          }
          video.play().catch(() => undefined)
        }
      }

      currentPc.onconnectionstatechange = () => {
        if (disposed || peerConnectionRef.current !== currentPc) return
        if (currentPc.connectionState === 'connected') {
          if (sessionVideoReady) retries = 0
          setStatus(videoReadyRef.current ? 'connected' : 'connecting')
        } else if (
          currentPc.connectionState === 'failed' ||
          currentPc.connectionState === 'closed'
        ) {
          if (peerConnectionRef.current === currentPc) {
            scheduleReconnect(
              socket,
              currentPc,
              `peer ${currentPc.connectionState}`,
            )
          }
        }
      }

      currentPc.onicecandidate = event => {
        if (
          peerConnectionRef.current === currentPc &&
          event.candidate &&
          socket.readyState === WebSocket.OPEN
        ) {
          socket.send(
            JSON.stringify({
              type: 'candidate',
              candidate: event.candidate.toJSON(),
            }),
          )
        }
      }

      // Wait for gateway's signaling_ready before offering, so the agent
      // socket is already open (offer would be dropped otherwise)
      let offered = false
      const sendOffer = async () => {
        if (offered) return
        offered = true
        try {
          if (socket.readyState !== WebSocket.OPEN) {
            throw new Error('signaling socket is not open')
          }
          const offer = await currentPc.createOffer()
          await currentPc.setLocalDescription(offer)
          socket.send(
            JSON.stringify({
              type: 'offer',
              sdp: offer.sdp,
            }),
          )
        } catch (err) {
          console.warn('[WebRTC] Signaling offer creation failed:', err)
          scheduleReconnect(socket, currentPc, 'offer creation failed')
        }
      }

      // Buffer remote candidates that arrive before the answer is applied
      // (addIceCandidate throws "remote description was null" otherwise)
      const pendingCandidates: RTCIceCandidateInit[] = []

      socket.onmessage = async event => {
        if (disposed || peerConnectionRef.current !== currentPc) return
        if (typeof event.data !== 'string') return
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'signaling_ready') {
            if (signalingTimer !== null) {
              clearTimeout(signalingTimer)
              signalingTimer = null
            }
            answerTimer = setTimeout(() => {
              if (!disposed && peerConnectionRef.current === currentPc) {
                scheduleReconnect(socket, currentPc, 'answer timeout')
              }
            }, 10000)
            sendOffer()
          } else if (
            msg.type === 'answer' &&
            currentPc.signalingState !== 'closed'
          ) {
            if (answerTimer !== null) {
              clearTimeout(answerTimer)
              answerTimer = null
            }
            await currentPc.setRemoteDescription(
              new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }),
            )
            while (pendingCandidates.length > 0) {
              const c = pendingCandidates.shift()!
              await currentPc.addIceCandidate(c).catch(() => undefined)
            }
            if (disposed || peerConnectionRef.current !== currentPc) return
            armFirstFrameWatchdog()
          } else if (
            msg.type === 'candidate' &&
            currentPc.signalingState !== 'closed'
          ) {
            const candidate: RTCIceCandidateInit = msg.candidate
            if (currentPc.remoteDescription) {
              await currentPc.addIceCandidate(candidate).catch(() => undefined)
            } else {
              pendingCandidates.push(candidate)
            }
          }
        } catch {
          // ignore invalid signaling messages
        }
      }

      socket.onclose = () => {
        connecting = false
        sockets.delete(socket)
        dc.close()
        pointerDc.close()
        if (disposed) return
        if (ws === socket && pc === currentPc) {
          scheduleReconnect(socket, currentPc, 'signaling socket closed')
        } else {
          currentPc.close()
        }
      }

      socket.onerror = () => {
        // close handler does the work
      }
    }

    connect()

    return () => {
      disposed = true
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current)
        pointerFrameRef.current = null
      }
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current)
        scrollFrameRef.current = null
      }
      pendingPointerRef.current = null
      pendingScrollRef.current = { deltaX: 0, deltaY: 0 }
      if (videoElement) {
        videoElement.onloadedmetadata = null
        videoElement.onplaying = null
        videoElement.srcObject = null
      }
      if (audioElement) {
        audioElement.onloadedmetadata = null
        audioElement.srcObject = null
      }
      clearSessionTimers()
      if (reconnectTimerRef.current !== null) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      releaseSessionKeys()
      if (peerConnectionRef.current === pc) {
        peerConnectionRef.current = null
        pc?.close()
      }
      dataChannelRef.current = null
      pointerChannelRef.current = null
      for (const socket of sockets) closeSocket(socket)
      sockets.clear()
    }
  }, [windowState.deployedUrl, windowState.status])

  const sendInput = (event: Record<string, unknown>) => {
    const payload = JSON.stringify(event)
    if (dataChannelRef.current?.readyState === 'open') {
      dataChannelRef.current.send(payload)
    }
  }

  const sendPointer = (event: Record<string, unknown>) => {
    const channel = pointerChannelRef.current
    if (channel?.readyState === 'open' && channel.bufferedAmount < 32 * 1024) {
      channel.send(JSON.stringify(event))
    }
  }

  const queuePointer = (event: Record<string, unknown>) => {
    pendingPointerRef.current = event
    if (pointerFrameRef.current !== null) return
    pointerFrameRef.current = requestAnimationFrame(() => {
      pointerFrameRef.current = null
      const pending = pendingPointerRef.current
      pendingPointerRef.current = null
      if (pending) sendPointer(pending)
    })
  }

  const queueScroll = (deltaX: number, deltaY: number) => {
    pendingScrollRef.current.deltaX += deltaX
    pendingScrollRef.current.deltaY += deltaY
    if (scrollFrameRef.current !== null) return
    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = null
      const pending = pendingScrollRef.current
      pendingScrollRef.current = { deltaX: 0, deltaY: 0 }
      if (pending.deltaX !== 0 || pending.deltaY !== 0) {
        sendPointer({ type: 'scroll', ...pending })
      }
    })
  }

  const getRemotePoint = (clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) return null
    const rect = container.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return null
    const sourceWidth = videoRef.current?.videoWidth || 1280
    const sourceHeight = videoRef.current?.videoHeight || 720
    const scale = Math.min(rect.width / sourceWidth, rect.height / sourceHeight)
    const renderedWidth = sourceWidth * scale
    const renderedHeight = sourceHeight * scale
    const offsetX = (rect.width - renderedWidth) / 2
    const offsetY = (rect.height - renderedHeight) / 2
    return {
      x: Math.min(
        1,
        Math.max(0, (clientX - rect.left - offsetX) / renderedWidth),
      ),
      y: Math.min(
        1,
        Math.max(0, (clientY - rect.top - offsetY) / renderedHeight),
      ),
    }
  }

  const handleMouseMove = (e: React.PointerEvent) => {
    const point = getRemotePoint(e.clientX, e.clientY)
    if (point) queuePointer({ type: 'mouse_move', ...point })
  }

  const handleMouseDown = (e: React.PointerEvent) => {
    enableAudio()
    containerRef.current?.focus()
    e.currentTarget.setPointerCapture(e.pointerId)
    const point = getRemotePoint(e.clientX, e.clientY)
    if (point)
      sendInput({
        type: 'mouse_button',
        button: e.button,
        pressed: true,
        ...point,
      })
  }

  const handleMouseUp = (e: React.PointerEvent) => {
    const point = getRemotePoint(e.clientX, e.clientY)
    if (point)
      sendInput({
        type: 'mouse_button',
        button: e.button,
        pressed: false,
        ...point,
      })
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault()
    pressedKeysRef.current.add(e.code)
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
    e.preventDefault()
    pressedKeysRef.current.delete(e.code)
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

  const releaseKeys = () => {
    for (const code of pressedKeysRef.current) {
      sendInput({
        type: 'key',
        code,
        pressed: false,
        ctrl: false,
        shift: false,
        alt: false,
        meta: false,
      })
    }
    pressedKeysRef.current.clear()
  }

  const enableAudio = () => {
    if (audioRef.current) audioRef.current.muted = false
    audioRef.current
      ?.play()
      .then(() => setAudioBlocked(false))
      .catch(() => undefined)
  }

  const handleWheel = (e: React.WheelEvent) => {
    queueScroll(e.deltaX, e.deltaY)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-black overflow-hidden overscroll-none select-none focus:outline-none"
      tabIndex={0}
      onPointerMove={handleMouseMove}
      onPointerDown={handleMouseDown}
      onPointerUp={handleMouseUp}
      onPointerCancel={handleMouseUp}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={releaseKeys}
      onWheel={handleWheel}
    >
      {status !== 'connected' && !videoReadyRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white z-20 backdrop-blur-md">
          {windowState.status === 'failed'
            ? 'Deployment failed. Please close and try again.'
            : status === 'connecting'
              ? 'Connecting to WebRTC display...'
              : 'Disconnected from display'}
        </div>
      )}

      {status === 'connected' && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-emerald-500/30 text-[11px] text-emerald-400 font-mono shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            WebRTC •{' '}
            {latency !== null ? `${latency.toFixed(0)}ms` : 'Ultra-Low Latency'}
          </span>
        </div>
      )}

      {audioBlocked && status === 'connected' && (
        <button
          type="button"
          onClick={enableAudio}
          className="absolute top-2 right-2 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] text-white"
        >
          Enable audio
        </button>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain"
      />
      <audio ref={audioRef} autoPlay className="absolute h-px w-px opacity-0" />
    </div>
  )
}
