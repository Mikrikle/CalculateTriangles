import { checkIntersection, isLinesPartsOfOneLine, linesToTriangle } from "../calculation";
import {
  Line,
  Point,
  Triangle,
  isLinesEqual,
  isPointsEqual,
  isTrianglesEqual,
} from "../core";

class TrianglesCalculator {
  points: Point[] = [];
  lines: Line[] = [];
  connections: Line[] = [];
  triangles: Triangle[] = [];
  segmentsMap: Map<number, Point[]> = new Map<number, Point[]>();

  public calc(lines: Line[]) {
    this.lines = lines;
    this.recalcLines();
    this.recalcIntersections();
    this.recalcConnections();
    this.recalcTriangles();
  }

  private recalcLines() {
    for(let line1 of this.lines){
      for(let line2 of this.lines){
        if(line1 == line2) continue;
        let line = isLinesPartsOfOneLine(line1, line2);
        if(line && this.lines.findIndex((l)=>isLinesEqual(l, line)) === -1)
          this.lines.push(line);
      }
    }
  }

  private recalcIntersections() {
    this.segmentsMap = new Map<number, Point[]>();
    for (let i = 0; i < this.lines.length; i++) {
      this.segmentsMap.set(i, []);
    }
    this.points = [];
    for (let line1 of this.lines) {
      this.points.push(line1.start);
      this.points.push(line1.end);
      this.segmentsMap.get(this.lines.indexOf(line1))?.push(line1.start);
      this.segmentsMap.get(this.lines.indexOf(line1))?.push(line1.end);
      for (let line2 of this.lines) {
        if(line1 == line2) continue;
        let intersectionPoint = checkIntersection(line1, line2);
        if (intersectionPoint != null) {
          this.segmentsMap
            .get(this.lines.indexOf(line1))
            ?.push(intersectionPoint);
          this.segmentsMap
            .get(this.lines.indexOf(line2))
            ?.push(intersectionPoint);
          this.points.push(intersectionPoint);
        }
      }
    }

    this.points = this.points.filter(
      (value, index, self) =>
        index === self.findIndex((p) => isPointsEqual(p, value))
    );
  }

  private recalcConnections() {
    this.connections = [];
    for (let intersectionPoints of this.segmentsMap.values()) {
      for (let p1 of intersectionPoints) {
        for (let p2 of intersectionPoints) {
          if (!isPointsEqual(p1, p2)) {
            this.connections.push(new Line(p1, p2));
          }
        }
      }
    }

    this.connections = this.connections.filter(
      (value, index, self) =>
        index === self.findIndex((l) => isLinesEqual(l, value))
    );
  }

  private recalcTriangles() {
    this.triangles = [];
    for (let l1 of this.connections) {
      for (let l2 of this.connections) {
        for (let l3 of this.connections) {
          if (l1 == l2 || l1 == l3 || l2 == l3) continue;
          let triangle = linesToTriangle(l1, l2, l3);
          if (triangle != null) {
            this.triangles.push(triangle);
          }
        }
      }
    }
    this.triangles = this.triangles.filter(
      (value, index, self) =>
        index === self.findIndex((t) => isTrianglesEqual(t, value))
    );
  }
}

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
