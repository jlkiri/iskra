<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { cubicOut } from "svelte/easing"
  import { theme, getThemeColor } from "./stores/theme.js"
  import { debounce } from "./utils.js"

  const speed = 1600

  export let ctx: CanvasRenderingContext2D
  export { resetCanvas, prepareCanvasThen }
  export let canvas: HTMLCanvasElement

  let rafHandles: Array<number> = []

  $: if (canvas) {
    setCanvasColors($theme)
  }

  function setCanvasColors(currentTheme?: any) {
    ctx.fillStyle = getThemeColor("secondary")
    ctx.strokeStyle = getThemeColor("primary")

    ctx.resetTransform()
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.translate(canvas.width / 2, canvas.height / 2)

    ctx.lineWidth = 3
  }

  function resetCanvas() {
    for (const handle of rafHandles) {
      cancelAnimationFrame(handle)
    }

    rafHandles = []

    canvas.width = 0

    setCanvasSize()
    setCanvasColors()
  }

  function prepareCanvasThen(
    ctx: CanvasRenderingContext2D,
    fn: (ctx: CanvasRenderingContext2D, drawLine: Function) => void
  ) {
    resetCanvas()

    fn(ctx, drawLine)
  }

  function setCanvasSize() {
    const parentRect = (canvas.parentNode as HTMLDivElement).getBoundingClientRect()
    canvas.width = parentRect.width + 1
    canvas.height = parentRect.height + 1
  }

  function strokeLine(to: number) {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(to, 0)
    ctx.closePath()
    ctx.stroke()
  }

  function drawLine(to: number) {
    const duration = (to / speed) * 1000

    return new Promise<void>((resolve) => {
      let start

      function update(timestamp) {
        if (!start) {
          start = timestamp
        }

        const elapsed = timestamp - start

        if (elapsed >= duration) {
          strokeLine(to)
          resolve()
          return
        }

        strokeLine(Math.round(cubicOut(elapsed / duration) * to))

        rafHandles.push(requestAnimationFrame(update))
      }

      rafHandles.push(requestAnimationFrame(update))
    })
  }

  const handleWindowResize = debounce(resetCanvas, 500)

  onMount(() => {
    ctx = canvas.getContext("2d", { alpha: false })

    setCanvasSize()
    resetCanvas()

    window.addEventListener("resize", handleWindowResize)
  })

  onDestroy(() => {
    window.removeEventListener("resize", handleWindowResize)
  })
</script>

<canvas bind:this={canvas} />
