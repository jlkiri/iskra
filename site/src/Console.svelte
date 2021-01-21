<script lang="ts">
  import { onMount, createEventDispatcher, onDestroy } from "svelte"
  import { state } from "./stores/input.js"
  import Autocomplete from "./Autocomplete.svelte"

  let commands = []
  let input

  export let command = ""

  const dispatch = createEventDispatcher()

  function handleConsoleInput(event) {
    if ($state == "idle" || $state == "rejected") {
      if (event.key == "Enter") {
        dispatch("command", { command })

        commands = [...commands, command]
        command = ""
      }
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
    {#each commands as com}
      <li>{com}</li>
    {/each}
  </ul>
  <div class="input">
    <input type="text" bind:this={input} bind:value={command} />
  </div>
  <Autocomplete bind:value={command} {input} />
</div>

<style>
  .console {
    min-width: 600px;
    height: 100vh;
    background-color: rgb(52, 48, 48);
    padding: 1rem 1rem 1rem 2rem;
    font-family: "Source Code Pro", monospace;
    font-size: 1.2rem;
    color: white;
  }

  input {
    width: 100%;
    background-color: rgb(52, 48, 48);
    border: none;
    color: inherit;
    padding: 0;
  }

  .input,
  li {
    position: relative;
    width: 100%;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .input::before,
  li::before {
    content: "#";
    position: absolute;
    left: -2ch;
    top: 0;
    color: rgb(249, 115, 91);
  }

  input:focus {
    outline: rgb(52, 48, 48);
  }
</style>
