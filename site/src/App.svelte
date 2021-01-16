<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { tweened } from "svelte/motion";
  import { sineOut } from "svelte/easing";
  import { evaluateJS, debounce } from "./utils.js";
  import Console from "./Console.svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let command = "";

  const speed = 200;

  function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawLine(to: number) {
    const duration = (to / speed) * 1000;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    return new Promise<void>((resolve) => {
      let start;

      function update(timestamp) {
        clearCanvas();

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
        ctx.lineTo(sineOut(elapsed / duration) * to, 0);
        ctx.closePath();
        ctx.stroke();
        requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  const handleWindowResize = debounce(resetCanvas, 500);

  onMount(() => {
    ctx = canvas.getContext("2d", { alpha: false });

    console.log(window.innerWidth, window.innerHeight);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    resetCanvas();

    window.addEventListener("resize", handleWindowResize);

    // drawLine(500);
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
    resetCanvas();

    //ctx.beginPath();
    //ctx.moveTo(0, 0);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    fn(ctx, drawLine);

    ctx.closePath();
    ctx.stroke();
  }

  $: worker.postMessage(command);

  // repeat 4 (forward 100 right 90)

  worker.addEventListener("message", async (event) => {
    const drawCompiled = await evaluateJS(event.data);
    prepareCanvasThen(ctx, drawCompiled);
  });
</script>

<canvas bind:this={canvas} />
<Console bind:command />

<style>
</style>
