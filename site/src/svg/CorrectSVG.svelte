<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 100 100"
  width="16"
  height="16"
  fill="none"><path d="
		M 10,50
		L 50,90
		L 90,10
	" pathLength="1" />
</svg>

<style>
  path {
    stroke-linecap: round;
    stroke-width: 12;
    stroke: hsl(110deg, 98%, 53%);
    stroke-dasharray: 1;
    max-width: 100%;
    max-height: 100%;
    animation: dash 400ms linear;
  }

  @keyframes dash {
    from {
      opacity: 0.3;
      stroke-dashoffset: 1;
    }

    to {
      opacity: 1;
      stroke-dashoffset: 0;
    }
  }
</style>
