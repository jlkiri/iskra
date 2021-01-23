<script>
  import { theme } from "./stores/theme"

  $: document.documentElement.setAttribute("data-theme", $theme)
</script>

<fieldset>
  <legend>Color theme</legend>
  <label>
    <input type="radio" bind:group={$theme} value={"light"} />
    Light
  </label>

  <label>
    <input type="radio" bind:group={$theme} value={"dark"} />
    Dark
  </label>

  <label>
    <input type="radio" bind:group={$theme} value={"colorful"} />
    Colorful
  </label>
</fieldset>

<style>
  fieldset {
    padding: 0.3em;
    border-radius: 0.4em;
    border: 3px solid var(--primary);
  }
</style>
