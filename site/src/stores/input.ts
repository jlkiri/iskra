import { writable } from "svelte/store"

export type State = "idle" | "selecting" | "rejected" | "selected"

export const state = writable("idle")
