<script>
  import CameraSvg from "./svg/CameraSVG.svelte"
  import GithubSvg from "./svg/GithubSVG.svelte"
</script>

<aside class="help">
  <div class="command-description">
    <span>forward &lt;number&gt;</span>: Draws a line of length &lt;number&gt;.
    Direction depends on current angle of rotation (see
    <span>turn</span>). Example: forward 200
  </div>
  <div class="command-description">
    <span>turn &lt;number&gt;</span>: Turns clockwise by &lt;number&gt; degrees.
    Does not draw anything. Example: turn 45
  </div>
  <div class="command-description">
    <span>repeat &lt;number&gt; ( command )</span>: Repeat the command (<span
      >turn</span
    >
    or <span>forward</span>) &lt;number&gt; number of times. Example: repeat 4
    (forward 100 turn 90)
  </div>
  <div class="hints">
    <p>Press <CameraSvg /> to take a screenshot of your drawing.</p>

    <div class="command-description">
      Try one of these commands:
      <ul>
        <li>repeat 4 (forward 100 turn 90)</li>
        <li>repeat 6 (forward 100 turn 60)</li>
        <li>repeat 60 (repeat 6 (forward 100 turn 60) turn 6)</li>
        <li>repeat 20 (repeat 8 (forward 170 turn 45) turn 18)</li>
      </ul>
    </div>
  </div>
  <div class="link">
    <GithubSvg /><a href="https://github.com/jlkiri/iskra"> Iskra on Github</a>
  </div>
</aside>

<style>
  ul {
    padding: 0 1.5em;
  }

  .link a {
    color: inherit;
    margin-left: 0.5em;
  }

  .help .link {
    position: absolute;
    bottom: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

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
