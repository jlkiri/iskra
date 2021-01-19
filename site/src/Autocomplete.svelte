<script lang="ts">
  import { onMount } from "svelte";

  type State = "idle" | "selecting" | "rejected";

  export let input;
  export let value;
  export let state: State = "idle";

  let offset = 0;
  let selectedIdx = 0;
  let currentWordOffset = 0;

  let keywords = [
    "automobile",
    "automatic",
    "automate",
    "australia",
    "auxiliary",
    "autism",
  ];

  $: currentWord = value.slice(currentWordOffset);

  $: possibleKeywords = keywords.filter(
    (k) =>
      currentWord && k.startsWith(currentWord) && k.length > currentWord.length
  );

  $: state =
    possibleKeywords.length > 0 && state != "rejected" ? "selecting" : state;

  $: if (value) {
    offset = input.selectionStart;
  }

  $: console.log(state);
  $: console.log(value);
  $: console.log(currentWordOffset);
  $: console.log(currentWord);

  onMount(() => {
    window.addEventListener("keydown", (event) => {
      if (state === "selecting") {
        if (event.key == "ArrowDown") {
          selectedIdx = (selectedIdx + 1) % possibleKeywords.length;
        }

        if (event.key == "ArrowUp") {
          selectedIdx =
            selectedIdx == 0 ? possibleKeywords.length - 1 : selectedIdx - 1;
        }

        if (event.key == "Tab" || event.key == "Escape") {
          selectedIdx = 0;
          state = "rejected";
        }

        if (event.key == "Enter") {
          value = `${value.slice(0, currentWordOffset)}${
            possibleKeywords[selectedIdx]
          }`;
          selectedIdx = 0;
        }

        if (event.key == " ") {
          selectedIdx = 0;
          state = "idle";
        }
      }

      if (state == "rejected") {
        if (event.key == " ") {
          state = "idle";
        }
      }

      if (event.key == " ") {
        currentWordOffset = value.length + 1;
      }
    });
  });
</script>

{#if possibleKeywords.length > 0 && state != "rejected"}
  <div class="autosuggestion" style="--offset: {offset}">
    {#each possibleKeywords as kw, i}
      <div class="autosuggestion__item" class:selected={i == selectedIdx}>
        <span class="autosuggestion__span--matched"
          ><strong>{kw.slice(0, currentWord.length)}</strong></span
        ><span class="autosuggestion__span">{kw.slice(currentWord.length)}</span
        >
      </div>
    {/each}
  </div>
{/if}

<style>
  :global(body) {
    font-family: monospace;
    font-size: 24px;
  }

  .autosuggestion {
    transform: translateX(calc(var(--offset) * 1ch));
    background-color: #a8d0f7;
    color: hsl(200, 5%, 13%);
    max-width: 15ch;
    padding: 0.2em;
    border-radius: 0 0 2px 2px;
    transition: transform 125ms;
  }

  .autosuggestion__item.selected {
    outline: none;
    box-shadow: 0 0 0 4px hsl(231, 50%, 25%);
  }

  .autosuggestion__span {
    opacity: 0.5;
  }

  .autosuggestion__span--matched {
    opacity: 1;
  }

  input {
    margin: 0;
  }
</style>
