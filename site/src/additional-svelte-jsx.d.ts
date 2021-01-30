declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onpanstart?: (event: any) => void
    onpanmove?: (event: any) => void
    onpanend?: (event: any) => void
  }
}
