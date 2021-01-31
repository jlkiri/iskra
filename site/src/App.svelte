<script lang="ts">
  import { afterUpdate, beforeUpdate, onMount } from "svelte"
  import { evaluateJS } from "./utils.js"
  import Settings from "./Settings.svelte"
  import Console from "./Console.svelte"
  import Canvas from "./Canvas.svelte"
  import CogSvg from "./svg/CogSVG.svelte"
  import HelpSvg from "./svg/HelpSVG.svelte"
  import CameraSvg from "./svg/CameraSVG.svelte"
  import SyntaxDescription from "./SyntaxDescription.svelte"
  import { quintOut } from "svelte/easing"
  import { fly } from "svelte/transition"
  import { theme } from "./stores/theme.js"
  import { error } from "./stores/error.js"
  import { history } from "./stores/history.js"
  import { pannable } from "./actions.js"
  import { consoleWidth } from "./stores/console.js"

  let ctx: CanvasRenderingContext2D
  let canvas: HTMLCanvasElement
  let resetCanvas: () => void
  let prepareCanvasThen: (
    ctx: CanvasRenderingContext2D,
    fn: (ctx: CanvasRenderingContext2D, drawLine: Function) => void
  ) => void

  let dragDx = 0

  const menuFlyIn = {
    duration: 200,
    x: -400,
    easing: quintOut,
  }

  const menuFlyOut = {
    duration: 200,
    x: -100,
    easing: quintOut,
  }

  let showSettings = false
  let showHelp = false

  $: showMenuContainer = showSettings || showHelp

  function toggleSettings() {
    showSettings = !showSettings
    showHelp = false
  }

  function toggleHelp() {
    showHelp = !showHelp
    showSettings = false
  }

  function handlePanMove(event) {
    dragDx += event.detail.dx
  }

  function handlePanEnd(event) {
    dragDx += event.detail.dx
    $consoleWidth = dragDx > 0 ? $consoleWidth - dragDx : $consoleWidth - dragDx
    dragDx = 0
    requestAnimationFrame(() => resetCanvas())
  }

  function saveCanvas() {
    const link = document.createElement("a")
    link.setAttribute("href", canvas.toDataURL())
    link.setAttribute("download", "pixelart.png")
    document.body.appendChild(link)
    link.click()
    link.remove()
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
      $error = event.data.error
      $history = [
        ...$history,
        { error: event.data.error, command: event.data.source },
      ]
      resetCanvas()
      return
    }

    $error = null
    $history = [...$history, { error: null, command: event.data.source }]

    const render = await evaluateJS(event.data.compiled)
    prepareCanvasThen(ctx, render)
  })

  worker.addEventListener("error", (event) => {
    console.warn(`Iskra internal error: ${event.message}`)
  })

  beforeUpdate(() => {
    document.documentElement.setAttribute("data-theme", $theme)
  })
</script>

<svelte:head><title>Iskra language playground</title></svelte:head>

<div class="container">
  <div class="canvas-wrapper">
    <div class="settings">
      {#if showMenuContainer}
        <div class="settings__menu-container">
          {#if showSettings}
            <div class="settings__menu" in:fly={menuFlyIn} out:fly={menuFlyOut}>
              <Settings />
            </div>
          {/if}
          {#if showHelp}
            <div class="settings__menu" in:fly={menuFlyIn} out:fly={menuFlyOut}>
              <SyntaxDescription />
            </div>
          {/if}
        </div>
      {/if}
      <div class="settings__controls">
        <div on:click={toggleSettings} class="settings__icon">
          <CogSvg />
        </div>
        <div on:click={toggleHelp} class="settings__icon">
          <HelpSvg />
        </div>
        <div class="settings__icon" on:click={saveCanvas}>
          <CameraSvg />
        </div>
      </div>
    </div>
    <Canvas bind:prepareCanvasThen bind:resetCanvas bind:canvas bind:ctx />
  </div>

  <Console on:command={handleCommand} />

  <div
    class="resizer"
    use:pannable
    on:panmove={handlePanMove}
    on:panend={handlePanEnd}
    style="--offset: {$consoleWidth + 18}px; --dx: {dragDx}px"
  />
</div>

<style>
  .resizer {
    position: absolute;
    top: 0;
    right: var(--offset);
    transform: translateX(var(--dx));
    height: 100%;
    width: 15px;
    z-index: 1;
    background-color: black;
    opacity: 0.1;
  }

  .resizer:hover {
    cursor: col-resize;
    opacity: 0.4;
  }

  .container {
    display: flex;
    height: 100%;
  }

  .canvas-wrapper {
    position: relative;
    height: 100%;
    flex: 1;
  }

  .settings__icon {
    display: flex;
    align-items: center;
  }

  .settings {
    position: absolute;
    display: flex;
  }

  .settings__menu-container {
    position: relative;
    width: calc(300px + 0.8em);
  }

  .settings__menu {
    position: absolute;
    width: 300px;
    padding: 0.4em;
    top: 0;
    left: 0;
    background-color: var(--tertiary);
    height: 100vh;
  }

  .settings__controls {
    padding: 0.3em;
    transform: translate(0.4em, 0.4em);
    background-color: var(--secondary);
    filter: brightness(0.8);
    border-radius: 0.4em;
  }

  .settings__controls:hover {
    filter: brightness(1);
  }

  .settings__icon {
    filter: brightness(0.8);
  }

  .settings__icon:hover {
    filter: brightness(1);
    cursor: pointer;
  }

  .settings__controls > .settings__icon + .settings__icon {
    margin-top: 0.5em;
  }

  :global(body) {
    font-family: "Source Code Pro", monospace;
    font-size: 1.4rem;
    color: var(--primary);
  }

  :global([data-theme="dark"]) {
    --primary: hsl(0, 0%, 93%);
    --secondary: hsl(216, 18%, 16%);
    --tertiary: hsl(210, 32%, 28%);
    --accent: hsl(26, 84%, 67%);
  }

  :global([data-theme="light"]) {
    --primary: hsl(203, 41%, 32%);
    --secondary: hsl(0, 0%, 98%);
    --tertiary: hsl(39, 28%, 82%);
    --accent: hsl(16, 83%, 64%);
  }

  :global([data-theme="colorful"]) {
    --primary: hsl(43, 60%, 76%);
    --secondary: hsl(288, 34%, 27%);
    --tertiary: hsl(346, 47%, 48%);
    --accent: hsl(7, 95%, 70%);
  }
</style>
