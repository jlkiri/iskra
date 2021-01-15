<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const worker = new Worker("./worker.js");

  onMount(() => {
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  worker.addEventListener("message", (event) => {
    console.log(event.data);
  });

  worker.postMessage("forward 90");
</script>

<canvas bind:this={canvas} />

<style>
</style>
