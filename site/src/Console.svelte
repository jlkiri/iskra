<script lang="ts">
  import { onMount, createEventDispatcher, onDestroy } from "svelte"
  import { state } from "./stores/input.js"
  import Autocomplete from "./Autocomplete.svelte"
  import CorrectSVG from "./svg/CorrectSVG.svelte"
  import SparkSVG from "./svg/SparkSVG.svelte"
  import Error from "./Error.svelte"
  import { history } from "./stores/history.js"
  import { autoscroll } from "./actions.js"
  import { consoleWidth } from "./stores/console.js"

  let command = ""
  let input: HTMLInputElement

  const dispatch = createEventDispatcher()

  function handleConsoleInput(event) {
    if ($state == "idle" || $state == "rejected") {
      if (event.key == "Enter") {
        dispatch("command", { command })

        command = ""
      }
    }

    if (event.key === "ArrowUp" && !command) {
      command = $history[$history.length - 1].command
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleConsoleInput)
  })

  onDestroy(() => {
    window.removeEventListener("keydown", handleConsoleInput)
  })
</script>

<div class="console" style="--console-width: {$consoleWidth}px;" use:autoscroll>
  <ul>
    {#each $history as entry}
      <li class="console-line">
        <div class="console-line__icon">
          {#if entry.error}<span style="font-size: 0.7em">❌</span>
          {:else}
            <CorrectSVG />
          {/if}
        </div>
        {entry.command}
        {#if entry.error}<Error message={entry.error} />{/if}
      </li>
    {/each}
  </ul>
  <div class="input-wrapper">
    <div class="input-wrapper__icon">
      <SparkSVG />
    </div>
    <input
      type="text"
      bind:this={input}
      bind:value={command}
      placeholder="Enter a command"
    />
  </div>
  <Autocomplete bind:value={command} {input} />
  <div style="height: 150px" />
</div>

<style>
  input {
    width: 100%;
    background-color: var(--tertiary);
    border: none;
    color: inherit;
    padding: 0;
  }

  ::placeholder {
    color: var(--primary);
    opacity: 0.5;
  }

  input:focus {
    outline: var(--tertiary);
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
    position: relative;
    flex-basis: var(--console-width);
    background-color: var(--tertiary);
    padding: 0.8rem;
    font-size: 1.2rem;
    color: var(--primary);
    overflow: auto;
  }

  .console-line .console-line__icon {
    display: inline-block;
    margin-right: 0.3em;
  }

  .input-wrapper {
    display: flex;
  }

  .input-wrapper .input-wrapper__icon {
    margin-right: 0.9em;
  }
</style>
