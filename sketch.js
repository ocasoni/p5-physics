let Engine = Matter.Engine, //motore
    Bodies = Matter.Bodies,  //corpi
    Body = Matter.Body,      //alterare alcune condizioni fisiche come ruotare o applicare una forza
    Composite = Matter.Composite;  //composito, insieme di corpi

let engine;
let brush;

let obstacle; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();

  brush = Bodies.circle(width/2, height/4, 50);

  obstacle = Bodies.rectangle(width/2, 600, 300, 50);
  obstacle.isStatic = true;

  Body.setAngle(obstacle, PI / 6); //inclinazione cerchio

  console.log (obstacle);

  Composite.add(engine.world, [brush, obstacle]);

}

function draw() {
  background(220);

  noStroke();
  fill(255, 0, 0);
  circle (brush.position.x, brush.position.y, brush.circleRadius * 2 );

  rectMode(CENTER);
  fill (0, 255, 0);

  translate (obstacle.position.x, obstacle.position.y);
  rotate (obstacle.angle);
  translate (-obstacle.position.x, -obstacle.position.y);

  rect(obstacle.position.x, obstacle.position.y, 300, 50);
  Engine.update(engine);
}
