<script lang="ts">
  export let command = "repeat 20 (repeat 8 (forward 170 right 45) right 18)"
</script>

<div class="console"><input type="text" bind:value={command} /></div>

<style>
  .console {
    min-width: 300px;
    height: 100%;
    background-color: gray;
  }

  input {
    width: 100%;
  }
</style>
