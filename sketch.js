let Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

let engine;
let brush;

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();

  brush = Bodies.circle(width/2, height/4, 50);

  Composite.add(engine.world, brush);

}

function draw() {
  background(220);

  noStroke();
  fill(255, 0, 0);
  circle (brush.position.x, brush.position.y, brush.circleRadius * 2 );

  Engine.update(engine);
}
