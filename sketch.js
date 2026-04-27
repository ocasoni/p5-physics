let Engine = Matter.Engine,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

let engine;
let brush;
let brushes = [];
let persistentLayer;

let NUM_BRUSHES = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  persistentLayer = createGraphics(windowWidth, windowHeight);
  persistentLayer.clear();

  // central collision handler: quando due corpi collidono, il corpo più grande diventa un rombo
  Matter.Events.on(engine, 'collisionStart', (event) => {
    let pairs = event.pairs;
    for (let pair of pairs) {
      let a = pair.bodyA;
      let b = pair.bodyB;

      function area(body) {
        if (body.circleRadius) return Math.PI * body.circleRadius * body.circleRadius;
        if (body._ref && body._ref.width && body._ref.height) return body._ref.width * body._ref.height;
        let w = body.bounds.max.x - body.bounds.min.x;
        let h = body.bounds.max.y - body.bounds.min.y;
        return w * h;
      }

      let areaA = area(a);
      let areaB = area(b);
      let larger = areaA >= areaB ? a : b;
      let smaller = larger === a ? b : a;

      // Se entrambi sono pennelli non bloccati: scambiano l'indice della palette (manteniamo lo swap dei colori)
      if (a._ref && b._ref && a._ref.type === 'brush' && b._ref.type === 'brush' && !a._ref.locked && !b._ref.locked) {
        let idxA = a._ref.getPaletteIndex();
        let idxB = b._ref.getPaletteIndex();

        // swap degli indici di palette
        a._ref.setPaletteIndex(idxB);
        b._ref.setPaletteIndex(idxA);

        // entrambi avanzano alla forma successiva
        a._ref.nextShape();
        b._ref.nextShape();
        continue;
      }

      // comportamento generico: se il corpo più grande è un pennello, diventa rombo
      if (larger._ref && larger._ref.type === 'brush') {
        larger._ref.nextShape();
      }
    }
  });

  // crea pennelli: metà saranno "lente" impostando frictionAir maggiore
  const slowCount = Math.floor(NUM_BRUSHES / 2);
  for (let i = 0; i < NUM_BRUSHES; i++) {
    let size = random(10, 30);
    brush = new Brush(width / 2, height / 4, size); //creati i pennelli in alto al centro
    brushes.push(brush); //aggiunti i pennelli all'array
    Composite.add(engine.world, brush.body); //aggiunti i pennelli al mondo di Matter.js

    if (i < slowCount) {
      // pennelli lenti
      brush.body.frictionAir = 0.08;
      brush.slow = true;
    } else {
      // pennelli normali
      brush.body.frictionAir = 0.005;
      brush.slow = false;
    }
  }


  // crea muri statici ai bordi per far rimbalzare i pennelli
  const wallThickness = 50;
  const walls = [
    Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, restitution: 1 }),
    Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true, restitution: 1 }),
    Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, restitution: 1 }),
    Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, restitution: 1 })
  ];
  Composite.add(engine.world, walls);

  // mouse handler: blocca il pennello cliccato
  window.mousePressed = function() {
    let mousePoint = { x: mouseX, y: mouseY };
    // cerca corpi sotto il punto
    let bodies = Composite.allBodies(engine.world);
    let found = Matter.Query.point(bodies, mousePoint);
    if (found.length > 0) {
      for (let b of found) {
        if (b._ref && b._ref.type === 'brush' && !b._ref.locked) {
          // rendi il corpo statico e marcato come locked
          Body.setStatic(b, true);
          b._ref.locked = true;
          b._ref.type = 'obstacle';

          // disegna permanentemente la forma corrente sul layer persistente
          persistentLayer.push();
          persistentLayer.noStroke();
          let c = b._ref.color;
          persistentLayer.fill(red(c), green(c), blue(c));
          let pos = b.position;
          let shape = b._ref.shape;
          persistentLayer.translate(pos.x, pos.y);
          persistentLayer.rotate(b.angle);
          if (shape === 'diamond') {
            persistentLayer.beginShape();
            persistentLayer.vertex(0, -b._ref.radius);
            persistentLayer.vertex(b._ref.radius, 0);
            persistentLayer.vertex(0, b._ref.radius);
            persistentLayer.vertex(-b._ref.radius, 0);
            persistentLayer.endShape(CLOSE);
          } else if (shape === 'triangle') {
            persistentLayer.beginShape();
            persistentLayer.vertex(-b._ref.radius, b._ref.radius);
            persistentLayer.vertex(b._ref.radius, b._ref.radius);
            persistentLayer.vertex(0, -b._ref.radius);
            persistentLayer.endShape(CLOSE);
          } else if (shape === 'rect') {
            persistentLayer.rectMode(CENTER);
            persistentLayer.rect(0, 0, b._ref.radius * 2, b._ref.radius * 1.2);
          } else {
            persistentLayer.circle(0, 0, b._ref.radius * 2);
          }
          persistentLayer.pop();

          break;
        }
      }
    }
  };


  let button = createButton('Request Sensor Access');

 button.position(10, 10);

 button.mousePressed(() => {

  if (typeof DeviceOrientationEvent.requestPermission === 'function') {

   DeviceOrientationEvent.requestPermission().then(permissionState => {

    if (permissionState === 'granted') {

     console.log('Orientation permission granted');

    }

   }).catch(console.error);

  }

  if (typeof DeviceMotionEvent.requestPermission === 'function') {

   DeviceMotionEvent.requestPermission().then(permissionState => {

    if (permissionState === 'granted') {

     console.log('Motion permission granted');

    }

   }).catch(console.error);

  }

  button.remove();

 });
}

function draw() {
  // disegno un overlay trasparente per far svanire gradualmente le scie
  noStroke();
  fill(255, 255, 255, 40);
  rectMode(CORNER);
  rect(0, 0, width, height);

  // disegna le forme permanenti bloccate
  image(persistentLayer, 0, 0);

  for (let i=0; i < brushes.length; i++) {
    brushes[i].draw();
  }

  console.log (rotationX, rotationY, rotationZ); 

  let gravityY = map(rotationX, PI, -PI, 2, -2);
  engine.world.gravity.y = gravityY;

  let gravityX = map(rotationY, -PI, PI, -2, 2);
  engine.world.gravity.x = gravityX;



  Engine.update(engine);
}
