import { writable } from "svelte/store"

type HistoryEntry = {
  command: string
  error: string | null
}

export const history = writable<Array<HistoryEntry>>([])
