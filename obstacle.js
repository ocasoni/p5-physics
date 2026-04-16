class Obstacle {
  constructor(x, y, width, height, angle = 0) {
    this.body = Matter.Bodies.rectangle(x, y, width, height, { isStatic: true });
    this.width = width;
    this.height = height;

    Matter.Body.setAngle(this.body, angle);
  }

  draw() {
    const position = this.body.position;
    const angle = this.body.angle;

    push();
    translate(position.x, position.y);
    rotate(angle);
    rectMode(CENTER);
    noStroke();
    fill(0, 255, 0);
    rect(0, 0, this.width, this.height);
    pop();
  }
}