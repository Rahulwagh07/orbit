# Architecture: Infinity-Style Cloud Computer MVP

## 1. System Architecture

```mermaid
graph TD
    U[USER] -->|HTTPS| Web[Next.js Web UI\nmacOS-like desktop]
    Web -->|REST API\nPOST /api/windows| API[Control Plane API]
    Web -->|SSE| SSE[SSE Endpoint]
    API --> DB[(PostgreSQL)]
    API --> Redis[(Redis)]
    
    Worker[Worker Node.js]
    Redis --> Worker
    Worker --> Runtime[Docker Container Runtime]
    
    Runtime --> Chromium[Chromium Instance\n+ Xvfb + Agents]
    
    Web -->|WebSocket\nBinary Frames + Input| Gateway[Gateway Node.js]
    Gateway --> Chromium
```

## 2. Control Plane

The Control Plane handles the lifecycle of instances. It is separated from the Data Plane.

```mermaid
graph TD
    Next[Next.js API]
    DB[(PostgreSQL)]
    Redis[(Redis Queue/PubSub)]
    Worker[Worker]
    Docker[Docker Daemon]
    
    Next -->|Create Deployment| DB
    Next -->|Push Job| Redis
    Redis -->|Consume Job| Worker
    Worker -->|Create Container| Docker
    Worker -->|Update Status| Redis
    Next -.->|Subscribe| Redis
```

## 3. Data Plane

The Data Plane routes high-frequency real-time traffic.

```mermaid
graph TD
    Browser[Browser\nCanvas + Input]
    Gateway[Data Plane Gateway]
    Instance[Chromium Instance\nDisplay/Input Agents]
    
    Browser -->|Input Events\nWebSocket| Gateway
    Gateway -->|Forward Input| Instance
    
    Instance -->|JPEG Frames\nWebSocket| Gateway
    Gateway -->|Forward Frames| Browser
```

## 4. Deployment Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> CREATING: Worker picks up job
    CREATING --> STARTING: Container provisioning
    STARTING --> WAITING_READY: Container started, waiting for health
    WAITING_READY --> READY: Xvfb, Chromium, Agents are alive
    READY --> STOPPING: User closes window
    STOPPING --> STOPPED: Container removed
    
    CREATING --> FAILED
    STARTING --> FAILED
    WAITING_READY --> FAILED
```

## 5. SSE Lifecycle

```mermaid
sequenceDiagram
    participant Browser
    participant API as Next.js API
    participant Redis as Redis PubSub
    participant Worker

    Browser->>API: GET /api/apps/status/:id/stream
    API->>Redis: Subscribe
    Worker->>Redis: Publish (CREATING_RESOURCES)
    Redis->>API: Event
    API->>Browser: SSE Data
    Worker->>Redis: Publish (CONTAINER_STARTING)
    Redis->>API: Event
    API->>Browser: SSE Data
    Worker->>Redis: Publish (READY + deployed_url)
    Redis->>API: Event
    API->>Browser: SSE Data
```

## 6. Container Architecture

```mermaid
graph TD
    subgraph Docker Container
        Xvfb[Xvfb :99]
        Chromium[Chromium]
        DAgent[Display Agent]
        IAgent[Input Agent]
        HAgent[Health Agent]
        
        Xvfb --> Chromium
        DAgent --> Xvfb
        IAgent --> Xvfb
    end
```

## 7. Display Pipeline

```mermaid
sequenceDiagram
    participant Xvfb as Xvfb Framebuffer
    participant DisplayAgent as Display Agent
    participant Gateway
    participant Browser as Browser Canvas

    loop Every Frame
        Xvfb->>DisplayAgent: Read Framebuffer
        DisplayAgent->>DisplayAgent: Encode JPEG
        DisplayAgent->>Gateway: Binary Message [Header | JPEG]
        Gateway->>Browser: Binary Message
        Browser->>Browser: ArrayBuffer -> Blob -> ImageBitmap -> Canvas
    end
```

## 8. Input Pipeline

```mermaid
sequenceDiagram
    participant Browser as Browser
    participant Gateway
    participant InputAgent as Input Agent
    participant X11

    Browser->>Gateway: JSON {type: "mouse_move", x: 0.5, y: 0.5}
    Gateway->>InputAgent: JSON
    InputAgent->>InputAgent: Translate to 1280x720 (640, 360)
    InputAgent->>X11: Inject X11 Event
    X11->>Chromium: Pointer Move Event
```

## 9. Gateway Routing

```mermaid
graph LR
    WS1[Browser WS 1] --> GW[Gateway]
    WS2[Browser WS 2] --> GW
    GW -->|Instance 34142f| C1[Container A]
    GW -->|Instance abc123| C2[Container B]
```

## 10. Reconnect Behavior

```mermaid
sequenceDiagram
    participant Browser
    participant API as Next.js API
    participant Gateway

    Browser->>API: GET /api/windows
    API-->>Browser: returns existing instance (READY, deployed_url)
    Browser->>Gateway: WebSocket Connect to deployed_url
    Gateway-->>Browser: Session Restored
```

## 11. Failure Behavior

```mermaid
sequenceDiagram
    participant Worker
    participant Docker
    participant DB
    participant SSE

    Worker->>Docker: Start Container
    Docker-->>Worker: Error / Timeout
    Worker->>DB: Update Deployment (FAILED, retryable=true)
    Worker->>SSE: Emit FAILED Event
    SSE-->>Browser: Display Error State in Window
```

## 12. Security Boundaries

- The Chromium container runs as a non-root user.
- strict limits on CPU, memory, PIDs.
- No host filesystem mounts.
- No Docker socket mounts.
- Browser connects only to Gateway, never directly to Docker.
- Gateway enforces session validation before forwarding to runtime.

## 13. WebRTC Architecture

Real-time streaming uses WebRTC (Media Tracks + RTCDataChannel) with Gateway serving as the WebRTC Signaling server:

```mermaid
graph TD
    Browser[Browser <video> + RTCDataChannel]
    Signaling[Gateway Signaling Server ws://localhost:4001]
    STUN[STUN Server stun:stun.l.google.com:19302]
    Remote[Runtime Container Video Track + Input Agent]
    
    Browser <-->|Signaling SDP Offer/Answer/ICE| Signaling
    Remote <-->|Signaling SDP Offer/Answer/ICE| Signaling
    Browser <-->|STUN Candidate Discovery| STUN
    
    Browser <==|WebRTC Video Track (H.264/VP8/VP9)| Remote
    Browser <==|RTCDataChannel Input Events (Mouse/Keyboard/Scroll)| Remote
```

### WebRTC Advantages:
- **Sub-50ms Latency**: Native hardware-accelerated video decoding directly in `<video>` element.
- **Zero Jitter Overhead**: WebRTC Media Engine dynamically adjusts bitrate, resolution, and framerate based on network conditions.
- **Low Overhead Inputs**: Mouse, keyboard, scroll, and resize input events transmitted over UDP-based `RTCDataChannel`.

