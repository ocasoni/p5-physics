let Engine = Matter.Engine,
    Composite = Matter.Composite;

let engine;
let brush;
let obstacle; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();

  brush = new Brush(width / 2, height / 4, 50);
  obstacle = new Obstacle(width / 2, 600, 300, 50, PI / 6);

  console.log (obstacle);
  
  Composite.add(engine.world, [brush.body, obstacle.body]);

}

function draw() {
  background(220);

  brush.draw();
  obstacle.draw();
  
  Engine.update(engine);
}
