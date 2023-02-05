import {
  InputTriangleCanvas,
  InputTriangleCanvasConfig,
} from "./inputtrianglecanvas";
import {
  OutputTriangleCanvas,
  OutputTriangleCanvasConfig,
} from "./outputtrianglecanvas";

let calculator: any;
const calculatorLoading = document.getElementById("loading") as HTMLElement | null;
const calculateworker = new Worker(new URL("./workers/calc.worker.ts", import.meta.url));
calculateworker.onmessage = (message) => {
  calculator = message.data;

  drawOutputCanvas();
  drawTrianglesSelector();
  outputCanvas.canvasElement.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
  calculatorLoading.style.visibility = "hidden";
};

let canvas = new InputTriangleCanvas(
  new InputTriangleCanvasConfig({
    color: "white",
    lineWidth: 2,
    pointSize: 8,
    canvasId: "canvas",
    mergeRadius: 25,
    useGrid: true,
    gridCellSize: 40,
    gridLineWidth: 20,
  })
);

let showTriangleIndex = 0;
let outputCanvas = new OutputTriangleCanvas(
  new OutputTriangleCanvasConfig({
    color: "black",
    lineWidth: 2,
    pointSize: 4,
    canvasId: "triangles",
  })
);

function drawOutputCanvas() {
  outputCanvas.clearCanvas();
  outputCanvas.drawLines(calculator.lines, "grey", 1);
  outputCanvas.drawPoints(calculator.points, "gray", 5);
  outputCanvas.drawTriangle(calculator.triangles[showTriangleIndex], "red", 4);
}

function drawTrianglesSelector(){
  let s = document.getElementById("triangles-selector") as HTMLElement | null;
  if(s){
    s.textContent = `${showTriangleIndex + 1} / ${calculator.triangles.length}`;
  }
}

document.getElementById("clear")?.addEventListener("click", () => {
  canvas.clearAll();
  outputCanvas.clearCanvas();
});

document.getElementById("btn-prev")?.addEventListener("click", () => {
  if (showTriangleIndex > 0) showTriangleIndex--;
  drawOutputCanvas();
  drawTrianglesSelector();
});
document.getElementById("btn-next")?.addEventListener("click", () => {
  if (showTriangleIndex < calculator.triangles.length - 1) showTriangleIndex++;
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
