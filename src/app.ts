import {
  InputTriangleCanvas,
  InputTriangleCanvasConfig,
} from "./inputtrianglecanvas";
import {
  OutputTriangleCanvas,
  OutputTriangleCanvasConfig,
} from "./outputtrianglecanvas";

let calculator: any;
const calculatorLoading = document.getElementById(
  "loading"
) as HTMLElement | null;
const calculateworker = new Worker(
  new URL("./workers/calc.worker.ts", import.meta.url)
);
calculateworker.onmessage = (message) => {
  calculator = message.data;
  console.log(calculator);
  if (trianglesCounter) {
    trianglesCounter.textContent = calculator.triangles.length;
  }
  drawOutputCanvas();
  drawTrianglesSelector();
  outputCanvas.canvasElement.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
  calculatorLoading.style.visibility = "hidden";
};

const canvas = new InputTriangleCanvas(
  new InputTriangleCanvasConfig({
    color: "white",
    lineWidth: 2,
    pointSize: 8,
    canvasId: "canvas",
    mergeRadius: 20,
    useGrid: true,
    gridCellSize: 40,
    gridLineWidth: 20,
  })
);

let showTriangleIndex = 0;
const trianglesSelector = document.getElementById(
  "triangles-selector"
) as HTMLElement | null;
const trianglesCounter = document.getElementById(
  "triangles-count"
) as HTMLElement | null;
const outputCanvas = new OutputTriangleCanvas(
  new OutputTriangleCanvasConfig({
    color: "black",
    lineWidth: 2,
    pointSize: 4,
    canvasId: "triangles",
  })
);

function drawOutputCanvas() {
  outputCanvas.clearCanvas();
  if(!calculator)
    return;
  outputCanvas.drawLines(calculator.lines, "grey", 1);
  outputCanvas.drawPoints(calculator.points, "gray", 5);
  outputCanvas.drawTriangle(calculator.triangles[showTriangleIndex], "#EB618F", 4);
}

function drawTrianglesSelector() {
  if (trianglesSelector && calculator && calculator.triangles.length > 0) {
    trianglesSelector.textContent = `${showTriangleIndex + 1} / ${
      calculator.triangles.length
    }`;
  }
}

document.getElementById("clear")?.addEventListener("click", () => {
  showTriangleIndex = 0;
  calculator = null;
  canvas.clearAll();
  outputCanvas.clearCanvas();
  if (trianglesSelector) {
    trianglesSelector.textContent = "0 / 0";
  }
  if (trianglesCounter) {
    trianglesCounter.textContent = "0";
  }
});

document.getElementById("btn-prev")?.addEventListener("click", () => {
  if (calculator && showTriangleIndex > 0) showTriangleIndex--;
  drawOutputCanvas();
  drawTrianglesSelector();
});
document.getElementById("btn-next")?.addEventListener("click", () => {
  if (calculator && showTriangleIndex < calculator.triangles.length - 1) showTriangleIndex++;
  drawOutputCanvas();
  drawTrianglesSelector();
});

document.getElementById("calc")?.addEventListener("click", () => {
  calculatorLoading.style.visibility = "visible";
  calculateworker.postMessage(canvas.lines);
});

document.getElementById("redo")?.addEventListener("click", () => {
  canvas.redo();
});
document.getElementById("undo")?.addEventListener("click", () => {
  canvas.undo();
});
