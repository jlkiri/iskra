function draw(ctx) {
  for (let i = 0; i < 4; i++) {
    ctx.moveTo(90, 0);
    ctx.moveTo(45, 0);
  }
}

export default function draw(ctx) {
  ctx.lineTo(90, 0);
}
