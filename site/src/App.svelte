<script lang="ts">
  import { evaluateJS } from "./utils.js";
  import Console from "./Console.svelte";
  import Canvas from "./Canvas.svelte";

  let ctx: CanvasRenderingContext2D;
  let resetCanvas: () => void;
  let prepareCanvasThen: (
    ctx: CanvasRenderingContext2D,
    fn: (ctx: CanvasRenderingContext2D, drawLine: Function) => void
  ) => void;

  let command = "";

  const worker = new Worker("./worker.js");

  function handleCommand(event) {
    worker.postMessage(event.detail.command);
  }

  // repeat 60 (repeat 8 (forward 100 right 45) right 6)
  // repeat 60 (repeat 6 (forward 100 right 60) right 6)
  // repeat 12 (repeat 8 (forward 200 turn 45) turn 30)

  worker.addEventListener("message", async (event) => {
    if (event.data.error) {
      resetCanvas();
      return;
    }

    const render = await evaluateJS(event.data.compiled);
    prepareCanvasThen(ctx, render);
  });

  worker.addEventListener("error", (event) => {
    console.warn(`Iskra compiler error: ${event.message}`);
  });
</script>

<div class="container">
  <div class="canvas-wrapper">
    <Canvas bind:resetCanvas bind:prepareCanvasThen bind:ctx />
  </div>
  <Console on:command={handleCommand} bind:command />
</div>

<style>
  .container {
    display: flex;
  }

  .canvas-wrapper {
    height: 100vh;
    flex: 1;
  }
</style>
