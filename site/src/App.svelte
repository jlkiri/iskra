<script lang="ts">
  import { onMount } from "svelte";
  import Console from "./Console.svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let input = "";

  const worker = new Worker("./worker.js");

  function prepare_then(
    ctx: CanvasRenderingContext2D,
    fn: (ctx: CanvasRenderingContext2D) => void
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    ctx.translate(canvas.width / 2, canvas.height / 2);
  });

  $: worker.postMessage(input);

  worker.addEventListener("message", async (event) => {
    const blob = new Blob([event.data], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const { default: draw_compiled } = await import(url);
    prepare_then(ctx, draw_compiled);
  });
</script>

<canvas bind:this={canvas} />
<Console bind:input />

<style>
</style>
