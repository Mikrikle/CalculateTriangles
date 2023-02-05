import { Point, Line, Triangle } from "./core";
import {
  ColorGenerator,
  TriangleCanvas,
  TriangleCanvasConfig,
} from "./trianglecanvas";
import { TrianglesCalculator } from "./calculation";
import {
  InputTriangleCanvas,
  InputTriangleCanvasConfig,
} from "./inputtrianglecanvas";
import {
  OutputTriangleCanvas,
  OutputTriangleCanvasConfig,
} from "./outputtrianglecanvas";

let calculator = new TrianglesCalculator();

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

  let loading = document.getElementById("loading") as HTMLElement | null;
  loading.style.display = "block";
  calculator.calc(canvas.lines);
  drawOutputCanvas();
  (
    document.getElementById("triangles-count") as HTMLSpanElement | null
  ).textContent = String(calculator.triangles.length);
  drawTrianglesSelector();
  outputCanvas.canvasElement.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
  loading.style.display = "none";
});

document.getElementById("redo")?.addEventListener("click", () => {
  canvas.redo();
});
document.getElementById("undo")?.addEventListener("click", () => {
  canvas.undo();
});
