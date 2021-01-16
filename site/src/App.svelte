<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { evaluateJS, debounce } from "./utils.js";
  import Console from "./Console.svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let command = "";

  const handleWindowResize = debounce(resetCanvas, 500);

  onMount(() => {
    ctx = canvas.getContext("2d", { alpha: false });

    console.log(window.innerWidth, window.innerHeight);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    resetCanvas();

    window.addEventListener("resize", handleWindowResize);
  });

  onDestroy(() => {
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
    fn: (ctx: CanvasRenderingContext2D) => void
  ) {
    resetCanvas();

    ctx.beginPath();
    ctx.moveTo(0, 0);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    fn(ctx);

    ctx.closePath();
    ctx.stroke();
  }

  $: worker.postMessage(command);

  worker.addEventListener("message", async (event) => {
    const drawCompiled = await evaluateJS(event.data);
    prepareCanvasThen(ctx, drawCompiled);
  });
</script>

<canvas bind:this={canvas} />
<Console bind:command />

<style>
</style>
