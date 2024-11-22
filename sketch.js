let colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown', 'gray', 'pink', 'magenta'];
let selectedColor = 'black';
let shapeVertices = [];
let brushStrokes = [];
let isPainting = false;

function setup() {
  let canvas = createCanvas(850, 470);
  canvas.parent("sketch-holder");

  colors.forEach(color => {
    let colorButton = createButton('');
    colorButton.style('background-color', color);
    colorButton.parent("color-buttons");
    colorButton.size(25, 25);
    colorButton.mousePressed(() => selectedColor = color); // For mouse click
    colorButton.touchStarted(() => {
      selectedColor = color;
      return false; // Prevent default behavior
    }); // For touchscreen
  });

  let clearButton = createButton('Clear Screen');
  clearButton.parent("clear-button");
  clearButton.style('background-color', '#333');
  clearButton.mousePressed(clearScreen); // For mouse click
  clearButton.touchStarted(() => {
    clearScreen();
    return false; // Prevent default behavior
  }); // For touchscreen
  
  let clearButton1 = createButton('Screen Shot');
  clearButton1.parent("clear-button");
  clearButton1.style('background-color', '#333');
  clearButton1.mousePressed(takeScreenshot);
  clearButton1.touchStarted(() => {
    takeScreenshot();
    return false; // Prevent default behavior
  }); // For touchscreen

  generateRandomShape();
}

function draw() {
  background(255);

  // Draw the current shape without fill
  noFill();
  stroke(0);
  beginShape();
  for (let v of shapeVertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);

  // Draw all brush strokes within the shape as continuous lines
  for (let s of brushStrokes) {
    strokeWeight(5);
    stroke(s.color);
    for (let j = 1; j < s.points.length; j++) {
      let p1 = s.points[j - 1];
      let p2 = s.points[j];
      line(p1.x, p1.y, p2.x, p2.y);
    }
  }

  // If painting and within the shape, add points to the current stroke
  if (isPainting && pointInShape(mouseX, mouseY)) {
    let currentStroke = brushStrokes[brushStrokes.length - 1];
    currentStroke.points.push(createVector(mouseX, mouseY));
  }
}

// Start painting on mouse press or touch
function mousePressed() {
  startPainting();
}

function mouseReleased() {
  stopPainting();
}

// Touch equivalents for starting and stopping painting
function touchStarted() {
  startPainting();
  return false; // Prevent default touch behavior
}

function touchEnded() {
  stopPainting();
  return false;
}

// Start painting if within the shape
function startPainting() {
  if (pointInShape(mouseX, mouseY)) {
    isPainting = true;
    brushStrokes.push({ color: selectedColor, points: [createVector(mouseX, mouseY)] });
  }
}

function stopPainting() {
  isPainting = false;
}

// Clear the screen and generate a new random shape
function clearScreen() {
  brushStrokes = [];
  generateRandomShape();
}

// Generate a random shape within the canvas
function generateRandomShape() {
  shapeVertices = [];
  let numVertices = int(random(3, 6));
  for (let i = 0; i < numVertices; i++) {
    shapeVertices.push(createVector(random(width), random(height)));
  }
}

// Check if a point is inside the current shape (polygon)
function pointInShape(x, y) {
  let crossings = 0;
  for (let i = 0; i < shapeVertices.length; i++) {
    let v1 = shapeVertices[i];
    let v2 = shapeVertices[(i + 1) % shapeVertices.length];
    if (((v1.y > y) !== (v2.y > y)) && (x < (v2.x - v1.x) * (y - v1.y) / (v2.y - v1.y) + v1.x)) {
      crossings++;
    }
  }
  return (crossings % 2 === 1);
}
function takeScreenshot() {
  saveCanvas('drawingScreenshot', 'png');
}
