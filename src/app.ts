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

let canvas = new InputTriangleCanvas(
  new InputTriangleCanvasConfig({
    color: "white",
    lineWidth: 2,
    pointSize: 4,
    canvasId: "canvas",
    anchorRadius: 30,
  })
);

let connectionsCanvas = new OutputTriangleCanvas(
  new OutputTriangleCanvasConfig({
    color: new ColorGenerator(
      () =>
        "#" +
        (
          "00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)
        ).slice(-6) +
        "50"
    ),
    lineWidth: 3,
    pointSize: 8,
    canvasId: "connections",
  })
);

let showTriangleIndex = 0;
let trianglecanvas = new OutputTriangleCanvas(
  new OutputTriangleCanvasConfig({
    color: "black",
    lineWidth: 2,
    pointSize: 4,
    canvasId: "triangles",
  })
);

let calculator = new TrianglesCalculator();

document.getElementById("clear")?.addEventListener("click", () => {
  canvas.clearAll();
  connectionsCanvas.clearCanvas();
  trianglecanvas.clearCanvas();
});

document.getElementById("btn-prev")?.addEventListener("click", () => {
  if (showTriangleIndex > 0) showTriangleIndex--;
  trianglecanvas.clearCanvas();
  trianglecanvas.drawTriangles(calculator.triangles, "grey");
  trianglecanvas.drawTriangle(
    calculator.triangles[showTriangleIndex],
    "red",
    4
  );
});
document.getElementById("btn-next")?.addEventListener("click", () => {
  if (showTriangleIndex < calculator.triangles.length - 1) showTriangleIndex++;
  trianglecanvas.clearCanvas();
  trianglecanvas.drawTriangles(calculator.triangles, "grey");
  trianglecanvas.drawTriangle(
    calculator.triangles[showTriangleIndex],
    "red",
    4
  );
});

document.getElementById("calc")?.addEventListener("click", () => {
  calculator.calc(canvas.lines);
  connectionsCanvas.drawLines(calculator.connections);
  connectionsCanvas.drawPoints(calculator.points, "red");

  trianglecanvas.drawTriangles(calculator.triangles, "grey");
  trianglecanvas.drawTriangle(
    calculator.triangles[showTriangleIndex],
    "red",
    4
  );

  (
    document.getElementById("triangles-count") as HTMLSpanElement | null
  ).textContent = String(calculator.triangles.length);

  (
    document.getElementById("points-count") as HTMLSpanElement | null
  ).textContent = String(calculator.points.length);
});
