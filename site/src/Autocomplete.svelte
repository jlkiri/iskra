<script>
  import { onMount } from "svelte";

  export let input;
  export let value;
  let offset;
  let selected;

  let keywords = [
    "automobile",
    "automatic",
    "automate",
    "australia",
    "auxiliary",
    "autism",
  ];

  $: possibleKeywords = keywords.filter(
    (k) => value && k.startsWith(value) && k.length > value.length
  );

  $: console.log(selected);

  $: if (value) {
    offset = input.selectionStart;
  }
</script>

{#if possibleKeywords.length > 0}
  <div class="auto" style="--offset: {offset}">
    {#each possibleKeywords as kw}
      <div
        class="tabbable"
        tabindex="0"
        on:focus={(e) => (selected = e.target)}
      >
        <span class="matched"><strong>{kw.slice(0, value.length)}</strong></span
        ><span>{kw.slice(value.length)}</span>
      </div>
    {/each}
  </div>
{/if}

<style>
  :global(body) {
    font-family: monospace;
    font-size: 24px;
  }

  .auto {
    transform: translateX(calc(var(--offset) * 1ch + 1ch));
    background-color: #000080;
    color: hsl(28, 57%, 47%);
    max-width: 15ch;
    padding: 0.2em;
    border-radius: 0 0 2px 2px;
    transition: transform 125ms;
  }

  .auto .matched {
    color: hsl(28, 87%, 87%);
  }

  .tabbable:focus {
    outline: none;
    box-shadow: 0 0 0 4px hsl(28, 57%, 47%);
  }

  input {
    margin: 0;
  }
</style>
