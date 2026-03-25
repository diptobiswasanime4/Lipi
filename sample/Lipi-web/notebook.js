let allCanvas = [];
const canvasContainer = document.getElementById("canvasContainer");
const newPageElem = document.getElementById("newPage");
const saveDrawingElem = document.getElementById("saveDrawing");
const penColorElem = document.getElementById("penColor");
const brushSizeSliderElem = document.getElementById("brushSize");

const penElem = document.getElementById("penSelect");
const pencilElem = document.getElementById("pencilSelect");
const brushElem = document.getElementById("brushSelect");
const rubberElem = document.getElementById("rubberSelect");

const undoAction = document.getElementById("undoAction");

const params = new URLSearchParams(window.location.search);
const notebookName = params.get("name") || "default";

let currentTool = "pencil";

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

    this.canvas.width = 1250;
    this.canvas.height = 750;

    canvasContainer.appendChild(this.canvas);

    this.isDrawing = false;
    this.oldX = undefined;
    this.oldY = undefined;
    this.curX = undefined;
    this.curY = undefined;
    this.currentStroke = [];
    this.allStrokes = [];

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

    console.log(this.allStrokes);

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

      const minWidth = lineWidth * 0.2;
      const maxWidth = lineWidth * 5;

      const width = minWidth + (maxWidth - minWidth) * pressure;
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
  allCanvas.push(canvas);
  return canvas;
}

createNewCanvas();

// Undo Action in last page
undoAction.addEventListener("click", () => {
  const currentCanvas = allCanvas[allCanvas.length - 1];
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
