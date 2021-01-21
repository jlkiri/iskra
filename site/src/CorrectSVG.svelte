<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 100 100"
  width="16"
  height="16"
  fill="none"
  ><style>
    path {
      stroke-width: 10;
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
  </style><path
    d="
		M 0,45
		L 45,100
		L 100,0
	"
    pathLength="1"
    stroke-linecap="round"
  />
</svg>
