<script lang="ts">
  import { onMount, createEventDispatcher, onDestroy } from "svelte"
  import { state } from "./stores/input.js"
  import Autocomplete from "./Autocomplete.svelte"
  import IskraSVG from "./IskraSVG.svelte"

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
      <li>{com}</li>
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

  li::before {
    content: "✅";
    margin-right: 0.7em;
    color: rgb(249, 115, 91);
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
    padding: 1rem 1rem 1rem 1.5rem;
    font-size: 1.2rem;
    color: white;
  }

  .input-wrapper {
    display: flex;
  }

  .input-wrapper::before {
    content: "✨";
    margin-right: 0.7em;
  }
</style>
