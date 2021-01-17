<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { sineOut } from "svelte/easing";
  import { evaluateJS, debounce } from "./utils.js";
  import Console from "./Console.svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let rafHandles: Array<number> = [];

  let command = "repeat 60 (repeat 6 (forward 100 right 60) right 6)";

  const speed = 5000;

  function drawLine(to: number) {
    const duration = (to / speed) * 1000;

    return new Promise<void>((resolve) => {
      let start;

      function update(timestamp) {
        if (!start) {
          start = timestamp;
        }

        const elapsed = timestamp - start;

        if (elapsed >= duration) {
          resolve();
          return;
        }

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sineOut(Math.round(elapsed / duration)) * to, 0);
        ctx.closePath();
        ctx.stroke();

        rafHandles.push(requestAnimationFrame(update));
      }

      rafHandles.push(requestAnimationFrame(update));
    });
  }

  const handleWindowResize = debounce(resetCanvas, 500);

  onMount(() => {
    ctx = canvas.getContext("2d", { alpha: false });
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    resetCanvas();

    window.addEventListener("resize", handleWindowResize);
  });

  $: onDestroy(() => {
    window.removeEventListener("resize", handleWindowResize);
  });

  const worker = new Worker("./worker.js");

  function resetCanvas() {
    ctx.resetTransform();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
  }

  function prepareCanvasThen(
    ctx: CanvasRenderingContext2D,
    fn: (ctx: CanvasRenderingContext2D, drawLine: Function) => void
  ) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    fn(ctx, drawLine);
  }

  $: worker.postMessage(command);

  // repeat 60 (repeat 8 (forward 100 right 45) right 6)
  // repeat 60 (repeat 6 (forward 100 right 60) right 6)

  worker.addEventListener("message", async (event) => {
    for (const rafHandle of rafHandles) {
      cancelAnimationFrame(rafHandle);
    }

    resetCanvas();

    if (event.data.error) {
      return;
    }

    const drawCompiled = await evaluateJS(event.data.compiled);
    prepareCanvasThen(ctx, drawCompiled);
  });

  worker.addEventListener("error", (event) => {
    console.warn(`${event.message}`);
  });
</script>

<canvas bind:this={canvas} />
<Console bind:command />

<style>
</style>
