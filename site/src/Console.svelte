<script lang="ts">
  import { onMount, createEventDispatcher, onDestroy } from "svelte"
  import { state } from "./stores/input.js"
  import Autocomplete from "./Autocomplete.svelte"
  import CorrectSVG from "./CorrectSVG.svelte"

  let history: Array<string> = []
  let command = ""
  let input: HTMLInputElement

  const dispatch = createEventDispatcher()

  function handleConsoleInput(event) {
    if ($state == "idle" || $state == "rejected") {
      if (event.key == "Enter") {
        dispatch("command", { command })

        history = [...history, command]
        command = ""
      }
    }

    if (event.key === "ArrowUp" && !command) {
      command = history[history.length - 1]
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleConsoleInput)
  })

  onDestroy(() => {
    window.removeEventListener("keydown", handleConsoleInput)
  })
</script>

<div class="console">
  <ul>
    {#each history as com}
      <li class="console-line">
        <div class="console-line__icon"><CorrectSVG /></div>
        {com}
      </li>
    {/each}
  </ul>
  <div class="input-wrapper">
    <input type="text" bind:this={input} bind:value={command} />
  </div>
  <Autocomplete bind:value={command} {input} />
</div>

<style>
  input {
    width: 100%;
    background-color: rgb(52, 48, 48);
    border: none;
    color: inherit;
    padding: 0;
  }

  input:focus {
    outline: rgb(52, 48, 48);
  }

  li {
    position: relative;
    width: 100%;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .console {
    min-width: 600px;
    height: 100vh;
    background-color: rgb(52, 48, 48);
    padding: 0.8rem;
    font-size: 1.2rem;
    color: white;
  }

  .console-line .console-line__icon {
    display: inline-block;
    margin-right: 0.3em;
  }

  .input-wrapper {
    display: flex;
  }

  .input-wrapper::before {
    content: "✨";
    margin-right: 0.7em;
  }
</style>
