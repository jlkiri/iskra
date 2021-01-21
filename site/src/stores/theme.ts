import { writable } from "svelte/store"

export type Theme = "light" | "dark" | "fun"

export const theme = writable("fun")

export const setTheme = (th: Theme) => {
  theme.set(th)
  document.documentElement.setAttribute("data-theme", th)
}
