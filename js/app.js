let canvas = document.getElementById("captcha-canvas");
let context = canvas.getContext("2d");
const verifyButton = document.getElementById("verifyButton");
const reinitialiseButton = document.getElementById("reinitialiseButton");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const NUM_CELLS = 5;
const CELL_WIDTH = CANVAS_WIDTH / NUM_CELLS;
const CELL_HEIGHT = CANVAS_HEIGHT;

let possibleObjects = ["car", "flower"];
let userSelections = [];
let objectMap = [];
let currentCaptchaTestObject;
let selectionCount = 0;
let failCount = 0;
let canvasLock = false;

window.onload = () => {
  Initialise();

  verifyButton.addEventListener("click", () => {
    if (canvasLock) return;
    let result = verifySelections(objectMap, userSelections);
    if (result == true) {
      showSuccessImage(context);
      displayInstruction("Sucess!");
      canvasLock = true;
    } else {
      if (failCount < 1) {
        selectionCount = 0;
        failCount++;
        showFailImage(context);
        rearrangeGrid();
      } else {
        canvasLock = true;
        displayInstruction(
          "Opportunities have been exhausted, You can no longer contiue!"
        );
        showFailImage(context);
      }
    }
  });

  reinitialiseButton.addEventListener("click", () => {
    Initialise();
  });
};

function Initialise() {
  userSelections = [];
  selectionCount = 0;
  failCount = 0;
  canvasLock = false;
  objectMap = randomlyGenerateObjectMap(5, possibleObjects);

  currentCaptchaTestObject =
    possibleObjects[Math.floor(Math.random() * possibleObjects.length)];

  displayInstruction(
    `Select all the grid cells that contain an ${currentCaptchaTestObject}`
  );

  clearCanvas(context);
  drawGrid(context);
  populateTheGridWithRandomObjects(objectMap);

  canvas.addEventListener("pointerdown", detectUserSelection);
}

// necessary functions
function showSuccessImage(context) {
  let successImage = {
    src: "./assets/success.png",
    x: (NUM_CELLS * CELL_WIDTH) / 2 - CELL_WIDTH,
    y: CELL_HEIGHT / 4,
    w: CELL_WIDTH * 2,
    h: CELL_HEIGHT / 2,
  };
  drawImage(context, successImage);
}
function showFailImage(context) {
  let failImage = {
    src: "./assets/failed.png",
    x: (NUM_CELLS * CELL_WIDTH) / 2 - CELL_WIDTH,
    y: CELL_HEIGHT / 4,
    w: CELL_WIDTH * 2,
    h: CELL_HEIGHT / 2,
  };
  drawImage(context, failImage);
}
function rearrangeGrid() {
  objectMap = randomlyGenerateObjectMap(5, possibleObjects);
  userSelections = [];
  clearCanvas(context);
  drawGrid(context);
  populateTheGridWithRandomObjects(objectMap);
  displayInstruction(
    `Try again. Select all the grid cells that contain an ${currentCaptchaTestObject}`
  );
}

function makeSelection(context, gridNo) {
  let blurRectangle = {
    x: gridNo * CELL_WIDTH,
    y: 0,
    w: CELL_WIDTH,
    h: CELL_HEIGHT,
    color: "rgba(180, 180, 180, 0.5)",
  };

  drawRectangle(context, blurRectangle);
}

function verifySelections(objectMap, userSelections) {
  let success = true;
  userSelections.forEach((selectedGrid) => {
    if (objectMap[selectedGrid] != currentCaptchaTestObject) {
      success = false;
    } else {
      objectMap[selectedGrid] = "selected";
    }
  });

  if (objectMap.indexOf(currentCaptchaTestObject) !== -1)
    return (success = false);

  return success;
}

function populateTheGridWithRandomObjects(objectMap) {
  objectMap.forEach((place, i) => {
    if (place == "car") {
      drawCar(context, i);
    } else {
      drawFlower(context, i);
    }
  });
}

function randomlyGenerateObjectMap(totalObjects, possibleObjects) {
  let result = [];

  result.push("car");
  result.push("flower");
  for (let i = 2; i < totalObjects; i++) {
    let randomObject =
      possibleObjects[Math.floor(Math.random() * possibleObjects.length)];
    result.push(randomObject);
  }
  for (let i = result.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

function drawCar(context, gridNo) {
  let halfCircle = {
    x: gridNo * CELL_WIDTH + 120,
    y: 100,
    radius: 70,
    direction: "top",
    color: "grey",
  };
  let rectangle = {
    x: gridNo * CELL_WIDTH + 20,
    y: 90,
    w: 200,
    h: 80,
    color: "blue",
  };
  let circle1 = {
    x: gridNo * CELL_WIDTH + 70,
    y: 160,
    radius: 35,
    color: "black",
  };
  let circle2 = {
    x: gridNo * CELL_WIDTH + 170,
    y: 160,
    radius: 35,
    color: "black",
  };
  drawHalfCircle(context, halfCircle);
  drawRectangle(context, rectangle);
  drawCircle(context, circle1);
  drawCircle(context, circle2);
}

function drawFlower(context, gridNo) {
  let circle = {
    x: gridNo * CELL_WIDTH + CELL_WIDTH / 2,
    y: CELL_HEIGHT / 2,
    radius: 30,
    color: "orange",
  };
  let halfCircle1 = {
    x: gridNo * CELL_WIDTH + CELL_WIDTH / 2 + 50,
    y: CELL_HEIGHT / 2,
    radius: 50,
    direction: "top",
    color: "tomato",
  };
  let halfCircle2 = {
    x: gridNo * CELL_WIDTH + CELL_WIDTH / 2 - 50,
    y: CELL_HEIGHT / 2,
    radius: 50,
    direction: "bottom",
    color: "tomato",
  };
  let halfCircle3 = {
    x: gridNo * CELL_WIDTH + CELL_WIDTH / 2,
    y: CELL_HEIGHT / 2 + 50,
    radius: 50,
    direction: "right",
    color: "tomato",
  };
  let halfCircle4 = {
    x: gridNo * CELL_WIDTH + CELL_WIDTH / 2,
    y: CELL_HEIGHT / 2 - 50,
    radius: 50,
    direction: "left",
    color: "tomato",
  };
  drawHalfCircle(context, halfCircle1);
  drawHalfCircle(context, halfCircle2);
  drawHalfCircle(context, halfCircle3);
  drawHalfCircle(context, halfCircle4);
  drawCircle(context, circle);
}

function getMouseXY(e) {
  let canvas = document.getElementById("captcha-canvas");
  let boundingRect = canvas.getBoundingClientRect();
  let offsetX = boundingRect.left;
  let offsetY = boundingRect.top;
  let w = (boundingRect.width - canvas.width) / 2;
  let h = (boundingRect.height - canvas.height) / 2;
  offsetX += w;
  offsetY += h;

  let mx = Math.round(e.clientX - offsetX);
  let my = Math.round(e.clientY - offsetY);
  return { x: mx, y: my };
}

function displayResult(str) {
  let outputArea = document.getElementById("instruction_area");
  let myElement = document.createElement("p");
  let textNode = document.createTextNode(str);
  myElement.appendChild(textNode);
  if (outputArea.firstChild)
    outputArea.replaceChild(myElement, outputArea.firstChild);
  else outputArea.appendChild(myElement);
}
function displayInstruction(str) {
  let outputArea = document.getElementById("instruction_area");
  let myElement = document.createElement("p");
  let textNode = document.createTextNode(str);
  myElement.appendChild(textNode);
  if (outputArea.firstChild)
    outputArea.replaceChild(myElement, outputArea.firstChild);
  else outputArea.appendChild(myElement);
}

function drawGrid(context) {
  context.strokeStyle = "rgb(100,100,100)";
  context.lineWidth = "1";
  for (let x = 0; x < CANVAS_WIDTH; x += CELL_WIDTH) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, CANVAS_HEIGHT);
    context.stroke();
  }
  for (let y = 0; y < CANVAS_HEIGHT; y += CELL_HEIGHT) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(CANVAS_WIDTH, y);
    context.stroke();
  }
}

function whichGridCell(x, y) {
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x >= CANVAS_WIDTH) x = CANVAS_WIDTH - 1;
  if (y >= CANVAS_HEIGHT) y = CANVAS_HEIGHT - 1;
  let gx = Math.floor(x / CELL_WIDTH);
  let gy = Math.floor(y / CELL_HEIGHT);
  return { j: gx, i: gy };
}
function detectUserSelection(evt) {
  if (canvasLock || selectionCount > 4) return;
  selectionCount++;
  let pos = getMouseXY(evt);
  let gridCell = whichGridCell(pos.x, pos.y);
  userSelections.push(gridCell.j);
  makeSelection(context, gridCell.j);
}
function clearCanvas(context) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
function drawRectangle(context, rectangle) {
  context.fillStyle = rectangle.color;
  context.beginPath();
  context.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
  context.fill();
}
function drawImage(context, image) {
  let imgElement = new Image();
  imgElement.src = image.src;
  context.drawImage(imgElement, image.x, image.y, image.w, image.h);
}
function drawCircle(context, circle) {
  context.fillStyle = circle.color;
  context.beginPath();
  context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  context.fill();
}

function drawHalfCircle(context, halfCircle) {
  context.fillStyle = halfCircle.color;
  context.beginPath();
  let startAngle, endAngle;
  switch (halfCircle.direction) {
    case "top":
      startAngle = Math.PI;
      endAngle = 2 * Math.PI;
      break;
    case "bottom":
      startAngle = 0;
      endAngle = Math.PI;
      break;
    case "left":
      startAngle = 0.5 * Math.PI;
      endAngle = 1.5 * Math.PI;
      break;
    case "right":
      startAngle = 1.5 * Math.PI;
      endAngle = 0.5 * Math.PI;
      break;
    default:
      startAngle = 0;
      endAngle = 2 * Math.PI;
  }
  context.arc(
    halfCircle.x,
    halfCircle.y,
    halfCircle.radius,
    startAngle,
    endAngle
  ); // Draw a half circle
  context.lineTo(halfCircle.x, halfCircle.y);
  context.fill();
}
