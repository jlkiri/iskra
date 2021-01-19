<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import Autocomplete from "./Autocomplete.svelte";

  let commands = [];
  let input;
  let state;

  export let command = "repeat 20 (repeat 8 (forward 170 right 45) right 18)";

  const dispatch = createEventDispatcher();

  onMount(() => {
    window.addEventListener("keydown", (event) => {
      if (state != "selecting") {
        if (event.key == "Enter") {
          dispatch("command", { command });

          commands = [...commands, command];
          command = "";
        }
      }
    });
  });
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
  <Autocomplete bind:state bind:value={command} {input} />
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
