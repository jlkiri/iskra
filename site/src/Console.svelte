<script lang="ts">
  export let command = "repeat 60 (repeat 6 (forward 100 right 60) right 6)"
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
