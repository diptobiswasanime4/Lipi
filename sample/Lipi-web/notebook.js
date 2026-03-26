let allCanvas = [];
const canvasContainer = document.getElementById("canvasContainer");
const newPageElem = document.getElementById("newPage");
const saveDrawingElem = document.getElementById("saveDrawing");
const penColorElem = document.getElementById("penColor");
const brushSizeSliderElem = document.getElementById("brushSize");
const backBtnElem = document.getElementById("backBtn");
const downloadBtnElem = document.getElementById("downloadBtn");

const penElem = document.getElementById("penSelect");
const pencilElem = document.getElementById("pencilSelect");
const brushElem = document.getElementById("brushSelect");
const rubberElem = document.getElementById("rubberSelect");

const undoAction = document.getElementById("undoAction");

const params = new URLSearchParams(window.location.search);
const notebookName = params.get("name") || "default";
const notebookType = params.get("type") || "white";
const notebookSize = params.get("size") || "Landscape";

let currentTool = "pencil";

backBtnElem.addEventListener("click", () => {
  window.history.back();
});

downloadBtnElem.addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;

  let orientation;
  let pageWidth;
  let pageHeight;

  if (notebookSize === "A4") {
    orientation = "portrait";
    pageWidth = 1000;
    pageHeight = 1420;
  } else {
    orientation = "landscape";
    pageWidth = 1250;
    pageHeight = 750;
  }

  const pdf = new jsPDF(orientation, "px", [pageWidth, pageHeight]);

  for (let i = 0; i < allCanvas.length; i++) {
    const canvas = allCanvas[i].canvas;
    const imgData = canvas.toDataURL("image/png");

    if (i !== 0) {
      pdf.addPage([pageWidth, pageHeight], orientation);
    }

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
  }

  pdf.save(`${notebookName}.pdf`);
});

penElem.addEventListener("click", () => {
  currentTool = "pen";
  penElem.style.background = "lightgrey";
  pencilElem.style.background = "none";
  rubberElem.style.background = "none";
  brushElem.style.background = "none";
});

pencilElem.addEventListener("click", () => {
  currentTool = "pencil";
  pencilElem.style.background = "lightgrey";
  penElem.style.background = "none";
  rubberElem.style.background = "none";
  brushElem.style.background = "none";
});

brushElem.addEventListener("click", () => {
  currentTool = "brush";
  brushElem.style.background = "lightgrey";
  pencilElem.style.background = "none";
  penElem.style.background = "none";
  rubberElem.style.background = "none";
});

rubberElem.addEventListener("click", () => {
  currentTool = "eraser";
  rubberElem.style.background = "lightgrey";
  pencilElem.style.background = "none";
  penElem.style.background = "none";
  brushElem.style.background = "none";
});

class Canvas {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    if (notebookSize == "A4") {
      this.canvas.width = 1000;
      this.canvas.height = 1420;
    } else {
      this.canvas.width = 1250;
      this.canvas.height = 750;
    }

    canvasContainer.appendChild(this.canvas);

    this.isDrawing = false;
    this.oldX = undefined;
    this.oldY = undefined;
    this.curX = undefined;
    this.curY = undefined;
    this.currentStroke = [];
    this.allStrokes = [];
    this.lastPressure = 0.5;

    this.canvas.addEventListener("pointerdown", (e) =>
      this.handlePointerDown(e),
    );
    this.canvas.addEventListener("pointermove", (e) =>
      this.handlePointerMove(e),
    );
    this.canvas.addEventListener("pointerup", (e) => this.handlePointerUp(e));
    this.canvas.addEventListener("pointercancel", (e) =>
      this.handlePointerUp(e),
    );

    document.addEventListener("touchstart", (e) => e.preventDefault(), {
      passive: false,
    });
    document.addEventListener("touchend", (e) => e.preventDefault(), {
      passive: false,
    });
    document.addEventListener("touchmove", (e) => e.preventDefault(), {
      passive: false,
    });
  }

  handlePointerDown(e) {
    this.isDrawing = true;
    this.currentStroke = [];

    const rect = this.canvas.getBoundingClientRect();
    this.curX = e.clientX - rect.left;
    this.curY = e.clientY - rect.top;
    this.oldX = this.curX;
    this.oldY = this.curY;
  }

  handlePointerMove(e) {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    this.curX = e.clientX - rect.left;
    this.curY = e.clientY - rect.top;

    const strokeData = {
      oldX: this.oldX,
      oldY: this.oldY,
      curX: this.curX,
      curY: this.curY,
      color: penColorElem.value,
      lineWidth: parseInt(brushSizeSliderElem.value),
      pointerType: e.pointerType,
      pressure: e.pressure,
      progress: this.currentStroke.length,
      pressure: e.pressure,
      tool: currentTool,
    };

    this.drawLine(strokeData);
    this.currentStroke.push(strokeData);

    this.oldX = this.curX;
    this.oldY = this.curY;
  }

  handlePointerUp(e) {
    if (this.isDrawing && this.currentStroke.length > 0) {
      this.allStrokes.push([...this.currentStroke]);
    }

    console.log("PUp all Strokes: ", this.allStrokes);

    this.isDrawing = false;
    this.oldX = this.oldY = undefined;
    this.currentStroke = [];
  }

  drawLine(strokeData) {
    const {
      oldX,
      oldY,
      curX,
      curY,
      color,
      lineWidth,
      progress,
      pressure,
      tool,
    } = strokeData;

    this.ctx.beginPath();

    if (tool === "eraser") {
      this.ctx.globalCompositeOperation = "destination-out";
      this.ctx.strokeStyle = "rgba(0,0,0,1)";
    } else if (tool === "brush") {
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.strokeStyle = color;

      const fade = Math.max(1, lineWidth - progress * 0.15);
      this.ctx.lineWidth = fade;
    } else if (tool === "pencil") {
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.strokeStyle = color;

      const minWidth = lineWidth * 0.5;
      const maxWidth = lineWidth * 5;

      const safePressure = Math.max(0.15, pressure);

      const smoothPressure = this.lastPressure * 0.6 + safePressure * 0.4;

      this.lastPressure = smoothPressure;

      const width = minWidth + (maxWidth - minWidth) * smoothPressure;
      this.ctx.lineWidth = width;
    } else {
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lineWidth;
    }

    this.ctx.lineCap = "round";

    this.ctx.moveTo(oldX, oldY);
    this.ctx.lineTo(curX, curY);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  loadStrokes() {
    for (let stroke of this.allStrokes) {
      for (let s of stroke) {
        this.drawLine(s);
      }
    }
  }
}

function createNewCanvas() {
  const canvas = new Canvas();

  if (notebookType === "line") {
    drawLines(canvas.ctx, canvas.canvas);
  } else if (notebookType === "grid") {
    drawGrid(canvas.ctx, canvas.canvas);
  } else if (notebookType === "dot") {
    drawDots(canvas.ctx, canvas.canvas);
  } else if (notebookType === "hanzi") {
    drawHanzi(canvas.ctx, canvas.canvas);
  } else {
    drawWhite(canvas.ctx, canvas.canvas);
  }

  allCanvas.push(canvas);
  return canvas;
}

createNewCanvas();

function drawWhite(ctx, canvas) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawLines(ctx, canvas) {
  drawWhite(ctx, canvas);

  ctx.strokeStyle = "#cccccc";
  ctx.lineWidth = 1;

  const spacing = 50;

  for (let y = 2 * spacing; y < canvas.height - spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawGrid(ctx, canvas) {
  drawWhite(ctx, canvas);

  ctx.strokeStyle = "#dddddd";
  ctx.lineWidth = 1;

  const spacing = 50;

  for (let y = spacing; y < canvas.height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  for (let x = spacing; x < canvas.width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

function drawDots(ctx, canvas) {
  drawWhite(ctx, canvas);

  ctx.fillStyle = "#cccccc";

  const spacing = 50;

  for (let y = spacing; y < canvas.height; y += spacing) {
    for (let x = spacing; x < canvas.width; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawHanzi(ctx, canvas) {
  drawWhite(ctx, canvas);

  let boxesPerRow, rows;
  let gapX, gapY, boxSize;
  let marginX, marginY;
  if (notebookSize == "Landscape") {
    boxesPerRow = 4;
    rows = 2;

    gapX = 50;
    gapY = 100;

    marginX = 50;
    marginY = 50;
    boxSize = 250;
  } else {
    boxesPerRow = 5;
    rows = 7;

    gapX = 15;
    gapY = 20;

    marginX = 20;
    marginY = 20;
    boxSize = 180;
  }

  ctx.strokeStyle = "#cccccc";
  ctx.lineWidth = 1;

  let y = marginY;

  for (let row = 0; row < rows; row++) {
    let x = marginX;

    for (let col = 0; col < boxesPerRow; col++) {
      ctx.strokeRect(x, y, boxSize, boxSize);
      x += boxSize + gapX;
    }

    y += boxSize + gapY;
  }
}

// Undo Action in last page
undoAction.addEventListener("click", () => {
  const currentCanvas = allCanvas[allCanvas.length - 1];
  console.log("Undo all strokes: ", currentCanvas.allStrokes);

  if (currentCanvas && currentCanvas.allStrokes.length > 0) {
    currentCanvas.allStrokes.pop();
    currentCanvas.ctx.clearRect(
      0,
      0,
      currentCanvas.canvas.width,
      currentCanvas.canvas.height,
    );
    currentCanvas.loadStrokes();
  }
});

newPageElem.addEventListener("click", () => {
  createNewCanvas();
});

saveDrawingElem.addEventListener("click", () => {
  const data = allCanvas.map((c) => c.allStrokes);
  localStorage.setItem(notebookName, JSON.stringify(data));
});

(async () => {
  const saved = await JSON.parse(localStorage.getItem(notebookName));
  if (saved && Array.isArray(saved)) {
    canvasContainer.innerHTML = "";
    allCanvas = [];
    for (let strokes of saved) {
      const c = createNewCanvas();
      c.allStrokes = strokes;
      c.loadStrokes();
    }
  }
})();
