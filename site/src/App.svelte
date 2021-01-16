<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let ctx: StatefulCanvasRenderingContext2D;

  interface StatefulCanvasRenderingContext2D extends CanvasRenderingContext2D {
    currentX?: number;
    currentY?: number;
  }

  const worker = new Worker("./worker.js");

  function prepare_then(
    ctx: CanvasRenderingContext2D,
    fn: (ctx: CanvasRenderingContext2D) => void
  ) {
    ctx.beginPath();
    ctx.moveTo(0, 0);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;

    fn(ctx);

    ctx.closePath();
    ctx.stroke();
  }

  onMount(() => {
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.currentX = 0;
    ctx.currentY = 0;

    ctx.translate(canvas.width / 2, canvas.height / 2);
  });

  worker.addEventListener("message", async (event) => {
    const blob = new Blob([event.data], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const { default: draw_compiled } = await import(url);
    prepare_then(ctx, draw_compiled);
  });

  worker.postMessage("repeat 4 (forward 100 right 90)");
</script>

<canvas bind:this={canvas} />

<style>
</style>
