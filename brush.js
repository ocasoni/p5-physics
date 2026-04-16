class Brush {
  constructor(x, y, radius) {
    this.body = Matter.Bodies.circle(x, y, radius);
    this.radius = radius;
    this.body.restitution = 1; // Aggiungi un po' di rimbalzo
    this.color = color(random(255), random(255), random(255)); // Colore casuale per ogni pennello
}

  draw() {
    const position = this.body.position;

    this.keepInBounds();
    noStroke();
    fill(this.color);
    circle(position.x, position.y, this.radius * 2);
  }

  keepInBounds() {
    let pos = this.body.position;
    let r = this.body.circleRadius;

    if (pos.x > width - r) {
        Body.setPosition (this.body, { x: width - r, y: pos.y });
        Body.setVelocity (this.body, { x: 0, y: this.body.velocity.y });
    }

    if (pos.x < r) {
        Body.setPosition (this.body, { x: r, y: pos.y });
        Body.setVelocity (this.body, { x: 0, y: this.body.velocity.y });
        }

    if (pos.y > height -r) {
        Body.setPosition (this.body, { x: pos.x, y: height - r });
        Body.setVelocity (this.body, { x: this.body.velocity.x, y: 0 });
    }   

    if (pos.y < r) {
        Body.setPosition (this.body, { x: pos.x, y: r });
        Body.setVelocity (this.body, { x: this.body.velocity.x, y: 0 });
    }
    }
}