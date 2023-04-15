import { TrianglesCalculator } from "../calculator";
import { Line } from "../core";


const calculator = new TrianglesCalculator();

self.onmessage = (message: MessageEvent<Line[]>) => {
  calculator.calc(message.data);
  self.postMessage({
    result: calculator.triangles.length,
    lines: calculator.lines,
    points: calculator.points,
    connections: calculator.connections,
    triangles: calculator.triangles
  });
};
