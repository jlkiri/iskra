<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { state } from "./stores/input.js"

  export let input
  export let value

  let offset = 0
  let selectedIdx = 0
  let currentWordOffset = 0

  let keywords = ["repeat", "forward", "turn"]

  $: currentWord = value.slice(currentWordOffset)

  $: possibleKeywords = keywords.filter(
    (k) =>
      currentWord && k.startsWith(currentWord) && k.length > currentWord.length
  )

  $: $state =
    possibleKeywords.length > 0 && $state != "rejected" ? "selecting" : $state

  $: if (value) {
    offset = input.selectionStart
  }

  $: console.log(state), value
  $: console.log(value), value
  $: console.log(currentWordOffset), value
  $: console.log(currentWord), value
  $: console.log(selectedIdx), value

  function handleKeydown(event) {
    if ($state == "selected" || $state == "idle") {
      if (event.key == "Enter") {
        $state = "idle"
        currentWordOffset = 0
      }
    }

    if ($state === "selecting") {
      if (event.key == "ArrowDown") {
        selectedIdx = (selectedIdx + 1) % possibleKeywords.length
      }

      if (event.key == "ArrowUp") {
        selectedIdx =
          selectedIdx == 0 ? possibleKeywords.length - 1 : selectedIdx - 1
      }

      if (event.key == "Tab" || event.key == "Escape") {
        selectedIdx = 0
        $state = "rejected"
      }

      if (event.key == "Enter") {
        value = `${value.slice(0, currentWordOffset)}${
          possibleKeywords[selectedIdx]
        }`
        selectedIdx = 0
        $state = "selected"
      }

      if (event.key == " ") {
        selectedIdx = 0
        $state = "idle"
      }
    }

    if ($state == "rejected") {
      if (event.key == " ") {
        $state = "idle"
      }
    }

    if (event.key == " ") {
      currentWordOffset = value.length + 1
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown)
  })

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown)
  })
</script>

{#if possibleKeywords.length > 0 && $state != "rejected"}
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
  .autosuggestion {
    transform: translateX(calc(var(--offset) * 1ch));
    background-color: #00070e;
    color: hsl(195, 69%, 81%);
    max-width: 15ch;
    padding: 0.2em;
    border-radius: 0 0 2px 2px;
    transition: transform 125ms;
  }

  .autosuggestion__item.selected {
    outline: none;
    box-shadow: 0 0 0 4px hsl(213, 45%, 91%);
  }

  .autosuggestion__span {
    opacity: 0.5;
  }

  .autosuggestion__span--matched {
    opacity: 1;
  }
</style>
