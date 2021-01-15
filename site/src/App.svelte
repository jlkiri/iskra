<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let ctx: StatefulCanvasRenderingContext2D;

  interface StatefulCanvasRenderingContext2D extends CanvasRenderingContext2D {
    currentX?: number;
    currentY?: number;
  }

  const worker = new Worker("./worker.js");

  onMount(() => {
    ctx = canvas.getContext("2d");
    ctx.currentX = 300;
    ctx.currentY = 300;

    /* const oldLineTo = ctx.lineTo;

    ctx.lineTo = (x?: number, y?: number) => {
      console.log(ctx.currentX, ctx.currentY);
      oldLineTo.call(
        ctx,
        x ? x + ctx.currentX : ctx.currentX,
        y ? y + ctx.currentY : ctx.currentY
      );
      ctx.currentX = x || ctx.currentX;
      ctx.currentY = y || ctx.currentY;
    }; */

    // ctx.lineTo(100, 100);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.translate(500, 500);
    ctx.beginPath();
    ctx.moveTo(0, 0);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;

    for (let i = 0; i < 4; i++) {
      ctx.lineTo(100, 0);
      ctx.translate(100, 0);
      ctx.rotate((90 * Math.PI) / 180);
    }

    ctx.closePath();
    ctx.stroke();
    // ctx.closePath()
  });

  /* worker.addEventListener("message", (event) => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(300, 300);
    const blob = new Blob([event.data], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    import(url).then(({ default: draw }) => {
      console.log(draw);
      draw(ctx);
      ctx.stroke();
    });
  });

  worker.postMessage("repeat 4 (forward 90 right 90)"); */
</script>

<canvas bind:this={canvas} />

<style>
</style>
