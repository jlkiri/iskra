<script>
  export let message = ""
</script>

<div>{@html message}</div>

<style>
  div {
    margin: 1em 0;
    padding: 1em;
    background-color: var(--primary);
    color: var(--secondary);
    border-radius: 1em;
  }
</style>
