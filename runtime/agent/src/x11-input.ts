import { spawn, type ChildProcess } from "child_process";
import { DOM_CODE_TO_KEYSYM, MODIFIER_KEYSYM } from "./keymap.js";

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;

type InputMessage = {
  type: string;
  x?: number;
  y?: number;
  button?: number;
  pressed?: boolean;
  code?: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  deltaX?: number;
  deltaY?: number;
};

const MOUSE_BUTTON_MAP: Record<number, number> = { 0: 1, 1: 2, 2: 3 };

export class InputDispatcher {
  private proc: ChildProcess | null = null;
  private pendingMouseMove: { x?: number; y?: number } | null = null;
  private mouseMoveTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingScroll = { deltaX: 0, deltaY: 0 };
  private scrollTimer: ReturnType<typeof setTimeout> | null = null;
  private modifiers: Record<"ctrl" | "shift" | "alt" | "meta", boolean> = {
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
  };

  start(): void {
    if (this.proc) return;
    this.proc = spawn("xdotool", ["-"], {
      env: { ...process.env, DISPLAY: ":99" },
      stdio: ["pipe", "inherit", "inherit"],
    });
    this.proc.on("exit", () => {
      this.proc = null;
    });
  }

  stop(): void {
    if (this.mouseMoveTimer !== null) {
      clearTimeout(this.mouseMoveTimer);
      this.mouseMoveTimer = null;
    }
    if (this.scrollTimer !== null) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }
    this.pendingMouseMove = null;
    this.pendingScroll = { deltaX: 0, deltaY: 0 };
    this.proc?.stdin?.end();
    this.proc?.kill();
    this.proc = null;
  }

  dispatch(message: InputMessage): void {
    switch (message.type) {
      case "mouse_move":
        this.queueMouseMove(message.x, message.y);
        break;
      case "mouse_button": {
        const button = MOUSE_BUTTON_MAP[message.button ?? 0] ?? 1;
        this.flushScroll();
        this.flushMouseMove();
        this.write(`mousemove ${this.scaleX(message.x)} ${this.scaleY(message.y)}`);
        this.write(`${message.pressed ? "mousedown" : "mouseup"} ${button}`);
        break;
      }
      case "scroll":
        this.queueScroll(message.deltaX ?? 0, message.deltaY ?? 0);
        break;
      case "key":
        this.flushScroll();
        this.handleKey(message);
        break;
      default:
        break;
    }
  }

  private handleKey(message: InputMessage): void {
    const desired: Record<"ctrl" | "shift" | "alt" | "meta", boolean> = {
      ctrl: !!message.ctrl,
      shift: !!message.shift,
      alt: !!message.alt,
      meta: !!message.meta,
    };
    for (const name of ["ctrl", "shift", "alt", "meta"] as const) {
      if (desired[name] && !this.modifiers[name]) {
        this.write(`keydown ${MODIFIER_KEYSYM[name]}`);
        this.modifiers[name] = true;
      } else if (!desired[name] && this.modifiers[name]) {
        this.write(`keyup ${MODIFIER_KEYSYM[name]}`);
        this.modifiers[name] = false;
      }
    }
    const keysym = message.code ? DOM_CODE_TO_KEYSYM[message.code] : undefined;
    if (!keysym) return;
    this.write(`${message.pressed ? "keydown" : "keyup"} ${keysym}`);
  }

  private handleScroll(deltaX: number, deltaY: number): void {
    if (deltaY !== 0) {
      const button = deltaY > 0 ? 5 : 4;
      const repeats = this.clamp(Math.ceil(Math.abs(deltaY) / 120), 1, 6);
      this.write(`click --repeat ${repeats} ${button}`);
    }
    if (deltaX !== 0) {
      const button = deltaX > 0 ? 7 : 6;
      const repeats = this.clamp(Math.ceil(Math.abs(deltaX) / 120), 1, 6);
      this.write(`click --repeat ${repeats} ${button}`);
    }
  }

  private scaleX(x: number | undefined): number {
    return Math.round(Math.min(1, Math.max(0, x ?? 0)) * SCREEN_WIDTH);
  }

  private queueMouseMove(x: number | undefined, y: number | undefined): void {
    this.pendingMouseMove = { x, y };
    if (this.mouseMoveTimer !== null) return;
    this.mouseMoveTimer = setTimeout(() => {
      this.mouseMoveTimer = null;
      this.flushMouseMove();
    }, 16);
  }

  private flushMouseMove(): void {
    if (!this.pendingMouseMove) return;
    const { x, y } = this.pendingMouseMove;
    this.pendingMouseMove = null;
    this.write(`mousemove ${this.scaleX(x)} ${this.scaleY(y)}`);
  }

  private queueScroll(deltaX: number, deltaY: number): void {
    this.pendingScroll.deltaX += deltaX;
    this.pendingScroll.deltaY += deltaY;
    if (this.scrollTimer !== null) return;
    this.scrollTimer = setTimeout(() => {
      this.scrollTimer = null;
      const { deltaX: x, deltaY: y } = this.pendingScroll;
      this.pendingScroll = { deltaX: 0, deltaY: 0 };
      this.handleScroll(x, y);
    }, 16);
  }

  private flushScroll(): void {
    if (this.scrollTimer !== null) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }
    const { deltaX, deltaY } = this.pendingScroll;
    this.pendingScroll = { deltaX: 0, deltaY: 0 };
    if (deltaX !== 0 || deltaY !== 0) this.handleScroll(deltaX, deltaY);
  }

  private scaleY(y: number | undefined): number {
    return Math.round(Math.min(1, Math.max(0, y ?? 0)) * SCREEN_HEIGHT);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private write(line: string): void {
    if (this.proc?.stdin?.writable) {
      this.proc.stdin.write(`${line}\n`);
    }
  }
}
