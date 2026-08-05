import { z } from "zod";
export * from "./api.js";

export const WebRTCOfferSchema = z.object({
  type: z.literal("offer"),
  sdp: z.string(),
});

export const WebRTCAnswerSchema = z.object({
  type: z.literal("answer"),
  sdp: z.string(),
});

export const WebRTCIceCandidateSchema = z.object({
  type: z.literal("candidate"),
  candidate: z.any(),
});

export const WebRTCSignalingMessageSchema = z.discriminatedUnion("type", [
  WebRTCOfferSchema,
  WebRTCAnswerSchema,
  WebRTCIceCandidateSchema,
]);

export type WebRTCOffer = z.infer<typeof WebRTCOfferSchema>;
export type WebRTCAnswer = z.infer<typeof WebRTCAnswerSchema>;
export type WebRTCIceCandidate = z.infer<typeof WebRTCIceCandidateSchema>;
export type WebRTCSignalingMessage = z.infer<typeof WebRTCSignalingMessageSchema>;

export const MouseMoveEventSchema = z.object({
  type: z.literal("mouse_move"),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const MouseButtonEventSchema = z.object({
  type: z.literal("mouse_button"),
  button: z.number(),
  pressed: z.boolean(),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const KeyboardEventSchema = z.object({
  type: z.literal("key"),
  code: z.string(),
  key: z.string(),
  pressed: z.boolean(),
  ctrl: z.boolean().default(false),
  shift: z.boolean().default(false),
  alt: z.boolean().default(false),
  meta: z.boolean().default(false),
});

export const WheelEventSchema = z.object({
  type: z.literal("wheel"),
  deltaX: z.number(),
  deltaY: z.number(),
});

export const ResizeEventSchema = z.object({
  type: z.literal("resize"),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const InputEventSchema = z.discriminatedUnion("type", [
  MouseMoveEventSchema,
  MouseButtonEventSchema,
  KeyboardEventSchema,
  WheelEventSchema,
  ResizeEventSchema,
]);

export type MouseMoveEvent = z.infer<typeof MouseMoveEventSchema>;
export type MouseButtonEvent = z.infer<typeof MouseButtonEventSchema>;
export type KeyboardEvent = z.infer<typeof KeyboardEventSchema>;
export type WheelEvent = z.infer<typeof WheelEventSchema>;
export type ResizeEvent = z.infer<typeof ResizeEventSchema>;
export type InputEvent = z.infer<typeof InputEventSchema>;

