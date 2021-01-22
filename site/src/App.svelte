<script lang="ts">
  import { onMount } from "svelte"
  import { evaluateJS } from "./utils.js"
  import { clickOutside } from "./actions.js"
  import Console from "./Console.svelte"
  import Canvas from "./Canvas.svelte"
  import CogSvg from "./svg/CogSVG.svelte"
  import HelpSvg from "./svg/HelpSVG.svelte"
  import CameraSvg from "./svg/CameraSVG.svelte"
  import { quintOut } from "svelte/easing"
  import { fly } from "svelte/transition"

  let ctx: CanvasRenderingContext2D
  let resetCanvas: () => void
  let prepareCanvasThen: (
    ctx: CanvasRenderingContext2D,
    fn: (ctx: CanvasRenderingContext2D, drawLine: Function) => void
  ) => void

  const menuFlyIn = {
    duration: 200,
    x: -400,
    easing: quintOut
  }

  const menuFlyOut = {
    duration: 200,
    x: -100,
    easing: quintOut
  }

  let showSettings = false
  let showHelp = false

  function toggleSettings() {
    showSettings = !showSettings
  }

  function toggleHelp() {
    showHelp = !showHelp
  }

  const worker = new Worker("./worker.js")

  function handleCommand(event) {
    worker.postMessage(event.detail.command)
  }

  // repeat 60 (repeat 8 (forward 100 right 45) right 6)
  // repeat 60 (repeat 6 (forward 100 right 60) right 6)
  // repeat 12 (repeat 8 (forward 200 turn 45) turn 30)
  // repeat 20 (repeat 8 (forward 170 turn 45) turn 18)

  worker.addEventListener("message", async (event) => {
    if (event.data.error) {
      resetCanvas()
      return
    }

    const render = await evaluateJS(event.data.compiled)
    prepareCanvasThen(ctx, render)
  })

  worker.addEventListener("error", (event) => {
    console.warn(`Iskra internal error: ${event.message}`)
  })

  onMount(() => {
    /*     document.documentElement.setAttribute(
      "data-theme",
      storedTheme || (darkQuery.matches ? "dark" : "light")
    );

    setModeTo(storedTheme);

    darkQuery.addListener((e) => {
      setModeTo(e.matches ? "dark" : "light");
    });

    const setPreferredTheme = () => {
      document.documentElement.setAttribute("data-theme", $mode);
      try {
        localStorage.setItem("theme", $mode);
      } catch (e) {}
    };

    mode.subscribe(setPreferredTheme); */
  })
</script>

<div class="container">
  <div class="canvas-wrapper">
    <div class="settings">
      {#if showSettings}
        <div
          class="settings__menu"
          use:clickOutside={showSettings}
          on:clickOutside={() => {
            console.log("clicked outside")
            showSettings = false
          }}
          in:fly={menuFlyIn}
          out:fly={menuFlyOut}
        ><div>Menu item</div></div>
      {/if}
      {#if showHelp}
        <div class="settings__menu" in:fly={menuFlyIn} out:fly={menuFlyOut}>
          <div>HELP HELP</div>
        </div>
      {/if}
      <div class="settings__controls">
        <div on:click={toggleSettings} class="settings__icon">
          <CogSvg />
        </div>
        <div on:click={toggleHelp} class="settings__icon">
          <HelpSvg />
        </div>
        <div class="settings__icon">
          <CameraSvg />
        </div>
      </div>
    </div>
    <Canvas bind:prepareCanvasThen bind:resetCanvas bind:ctx />
  </div>
  <Console on:command={handleCommand} />
</div>

<style>
  .container {
    display: flex;
  }

  .canvas-wrapper {
    position: relative;
    height: 100vh;
    flex: 1;
  }

  .settings__icon {
    display: flex;
    align-items: center;
  }

  .settings {
    position: absolute;
    display: flex;
    align-items: flex-start;
  }

  .settings__menu {
    background-color: hsl(0, 0%, 11%);
    min-width: 300px;
    height: 100vh;
    padding: 0.4em;
  }

  .settings__controls {
    display: flex;
    padding: 0.2em;
    transform: translate(0.4em, 0.4em);
    background-color: hsl(0, 0%, 11%);
    color: hsl(0, 0%, 30%);
    filter: brightness(0.5);
    border-radius: 0.4em;
  }

  .settings__controls:hover {
    filter: brightness(1);
    color: hsl(0, 0%, 50%);
  }

  .settings__icon:hover {
    color: hsl(0, 0%, 80%);
    cursor: pointer;
  }

  .settings__controls > .settings__icon + .settings__icon {
    margin-left: 0.5em;
  }

  :global(body) {
    font-family: "Source Code Pro", monospace;
    font-size: 24px;
  }
</style>
