import { writable } from "svelte/store"

export type Theme = "light" | "dark" | "colorful"

export const theme = writable("colorful")

export function getThemeColor(prop: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(
    `--${prop}`
  )
}
