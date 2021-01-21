export async function evaluateJS(input: string) {
  const blob = new Blob([input], { type: "text/javascript" })
  const { default: drawCompiled } = await import(URL.createObjectURL(blob))
  return drawCompiled
}

export function debounce(fn: () => void, timeout: number) {
  let handle

  return () => {
    clearTimeout(handle)
    handle = setTimeout(fn, timeout)
  }
}
