<script>
  import CameraSvg from "./svg/CameraSVG.svelte"
</script>

<div class="help">
  <div class="command-description">
    <span>forward &lt;int&gt;</span>: Draws a line of length &lt;int&gt;.
    Direction depends on current angle of rotation (see <span>turn</span>).
  </div>
  <div class="command-description">
    <span>turn &lt;int&gt;</span>: Turns clockwise by &lt;int&gt; degrees. Does
    not draw anything.
  </div>
  <div class="command-description">
    <span>repeat &lt;int&gt; ( command )</span>: Repeat the command (<span
      >turn</span
    >
    or <span>forward</span>) &lt;int&gt; number of times.
  </div>
  <div class="hints">
    Press <CameraSvg /> to take a screenshot of your drawing.
  </div>
</div>

<style>
  .help {
    background-color: var(--tertiary);
    font-size: 1rem;
  }

  .hints {
    margin-top: 1em;
  }

  .command-description {
    background-color: var(--primary);
    color: var(--secondary);
    padding: 0.4em;
    border-radius: 0.5em;
  }

  .command-description + .command-description {
    margin-top: 0.5em;
  }

  span {
    color: var(--accent);
  }
</style>
