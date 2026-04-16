class Brush {
  constructor(x, y, radius) {
    this.body = Matter.Bodies.circle(x, y, radius);
    this.radius = radius;
  }

  draw() {
    const position = this.body.position;

    noStroke();
    fill(255, 0, 0);
    circle(position.x, position.y, this.radius * 2);
  }
}