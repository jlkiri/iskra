<script lang="ts">
  export let command = "";
</script>

<input type="text" bind:value={command} />

<style>
  input {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
</style>
