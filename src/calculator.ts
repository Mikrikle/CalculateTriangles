import {
  findIntersectionPoint,
  findCommonLine,
  createTriangleFromLines,
} from "./coremath";
import {
  Line,
  Point,
  Triangle,
  areLinesEqual,
  arePointsEqual,
  isTrianglesEqual,
} from "./core";

export class TrianglesCalculator {
  /**
   * An array of Point objects representing all the points.
   */
  points: Point[] = [];

  /**
   * An array of Line objects representing all the lines in the diagram.
   */
  lines: Line[] = [];

  /**
   * An array of Line objects representing all the line segments, including those that make up the triangles.
   */
  segments: Line[] = [];

  /**
   * An array of Triangle objects representing all the triangles.
   */
  triangles: Triangle[] = [];

  /**
   * Each key in the segments map represents a line index, and its value is an array of points that belong to that line
   * The points array contains all the distinct intersection points between the lines, as well as the start and end points of each line.
   */
  segmentsMap: Map<number, Point[]> = new Map<number, Point[]>();

  public calc(lines: Line[]) {
    this.lines = lines;
    this.calcLines();
    this.calcIntersections();
    this.calcSegments();
    this.calcTriangles();
  }

  /**
   * Calculates the lines array, finding all the unique lines that can be formed
   * and adds to the array.
   */
  private calcLines() {
    const nLines = this.lines.length;
    for (let i = 0; i < nLines - 1; i++) {
      for (let j = i + 1; j < nLines; j++) {
        const line = findCommonLine(this.lines[i], this.lines[j]);
        if (line && !this.lines.some((l) => areLinesEqual(l, line))) {
          this.lines.push(line);
        }
      }
    }
  }

  /**
   * Calculates the intersections of the lines and updates the segments map.
   */
  private calcIntersections() {
    this.segmentsMap = new Map<number, Point[]>();
    for (let i = 0; i < this.lines.length; i++) {
      this.segmentsMap.set(i, []);
    }
    this.points = [];
    for (let i = 0; i < this.lines.length - 1; i++) {
      for (let j = i + 1; j < this.lines.length; j++) {
        const intersectionPoint = findIntersectionPoint(
          this.lines[i],
          this.lines[j]
        );
        if (intersectionPoint != null) {
          if (!this.points.some((p) => arePointsEqual(p, intersectionPoint))) {
            this.points.push(intersectionPoint);
          }
          this.segmentsMap.get(i)?.push(intersectionPoint);
          this.segmentsMap.get(j)?.push(intersectionPoint);
        }
      }
      this.points.push(this.lines[i].start);
      this.points.push(this.lines[i].end);
      this.segmentsMap.get(i)?.push(this.lines[i].start);
      this.segmentsMap.get(i)?.push(this.lines[i].end);
    }
  }

  /**
   * Calculates the connections between the intersection points of the lines
   * and stores them in the segments property.
   */
  private calcSegments() {
    this.segments = [];
    for (let intersectionPoints of this.segmentsMap.values()) {
      for (let i = 0; i < intersectionPoints.length - 1; i++) {
        for (let j = i + 1; j < intersectionPoints.length; j++) {
          const p1 = intersectionPoints[i];
          const p2 = intersectionPoints[j];
          if (!arePointsEqual(p1, p2)) {
            const line = new Line(p1, p2);
            if (!this.segments.some((l) => areLinesEqual(l, line)))
              this.segments.push(new Line(p1, p2));
          }
        }
      }
    }
  }

  /**
   * Calculates the triangles in the current state.
   */
  private calcTriangles() {
    this.triangles = [];
    const nConnections = this.segments.length;
    for (let i = 0; i < nConnections - 1; i++) {
      const l1 = this.segments[i];
      for (let j = i + 1; j < nConnections; j++) {
        const l2 = this.segments[j];
        for (let k = j + 1; k < nConnections; k++) {
          const l3 = this.segments[k];
          const triangle = createTriangleFromLines(l1, l2, l3);
          if (triangle != null) {
            this.triangles.push(triangle);
          }
        }
      }
    }
  }
}
