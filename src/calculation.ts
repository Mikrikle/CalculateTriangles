import {
  Point,
  Line,
  Triangle,
  isPointsEqual,
  isLinesEqual,
  isTrianglesEqual,
} from "./core";

export class TrianglesCalculatorConfig {
  constructor() {}
}

export class TrianglesCalculator {
  points: Point[] = [];
  lines: Line[] = [];
  connections: Line[] = [];
  triangles: Triangle[] = [];
  segmentsMap: Map<number, Point[]> = new Map<number, Point[]>();

  public calc(lines: Line[]) {
    this.lines = lines;
    this.recalcIntersections();
    this.recalcConnections();
    this.recalcTriangles();
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

function linesToTriangle(l1: Line, l2: Line, l3: Line): Triangle | null {
  let hpoints = [l1.start, l1.end, l2.start, l2.end, l3.start, l3.end];
  hpoints = hpoints.filter(
    (value, index, self) =>
      index === self.findIndex((p) => isPointsEqual(p, value))
  );
  if (hpoints.length != 3) return null;

  var a = distanceBetweenPoints(l1.start, l1.end);
  var b = distanceBetweenPoints(l2.start, l2.end);
  var c = distanceBetweenPoints(l3.start, l3.end);

  if (a > b + c || b > a + c || c > a + b) return null;
  const p = (a + b + c) / 2;
  let S = (p * (p - a) * (p - b) * (p - c)) ** 0.5;
  if (isNaN(S) || Math.abs(S) <= 1) return null;
  return new Triangle(hpoints[0], hpoints[1], hpoints[2]);
}

export function mergePointWithPoint(
  point: Point,
  points: Point[],
  raduis: number
): boolean {
  let minPoint: Point | null = null;
  let minDist: number = Number.MAX_SAFE_INTEGER;
  for (let toPoint of points) {
    let distace = distanceBetweenPoints(point, toPoint);
    if (distace < minDist) {
      minDist = distace;
      minPoint = toPoint;
    }
  }
  if (minPoint != null && minDist <= raduis) {
    point.x = minPoint.x;
    point.y = minPoint.y;
    return true;
  }
  return false;
}

export function mergePointWithLinePoints(
  point: Point,
  lines: Line[],
  raduis: number
): boolean {
  let minPoint: Point | null = null;
  let minDist: number = Number.MAX_SAFE_INTEGER;
  for (let line of lines) {
    let distStart = distanceBetweenPoints(point, line.start);
    let distEnd = distanceBetweenPoints(point, line.end);

    if (Math.min(distStart, distEnd) < minDist) {
      minPoint = distStart < distEnd ? line.start : line.end;
      minDist = Math.min(distStart, distEnd);
    }
  }
  if (minPoint != null && minDist <= raduis) {
    point.x = minPoint.x;
    point.y = minPoint.y;
    return true;
  }
  return false;
}

export function mergePointWithLine(
  point: Point,
  lines: Line[],
  raduis: number
): boolean {
  let minPoint: Point | null = null;
  let minDist: number = Number.MAX_SAFE_INTEGER;
  for (let line of lines) {
    let pd = distanceFromPointToLine(point, line);
    if (pd.distace < minDist) {
      minDist = pd.distace;
      minPoint = pd.point;
    }
  }
  if (minPoint != null && minDist <= raduis) {
    point.x = minPoint.x;
    point.y = minPoint.y;
    return true;
  }
  return false;
}

export function distanceBetweenPoints(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function distanceFromPointToLine(
  point: Point,
  line: Line
): { point: Point; distace: number } {
  const A = point.x - line.start.x;
  const B = point.y - line.start.y;
  const C = line.end.x - line.start.x;
  const D = line.end.y - line.start.y;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = -1;
  if (len_sq != 0) {
    param = dot / len_sq;
  }
  let xx = 0;
  let yy = 0;

  if (param < 0) {
    xx = line.start.x;
    yy = line.start.y;
  } else if (param > 1) {
    xx = line.end.x;
    yy = line.end.y;
  } else {
    xx = line.start.x + param * C;
    yy = line.start.y + param * D;
  }

  let dx = point.x - xx;
  let dy = point.y - yy;

  return { point: new Point(xx, yy), distace: Math.sqrt(dx * dx + dy * dy) };
}

export function checkIntersection(line1: Line, line2: Line): Point | null {
  let checkedPoints = [line1.start, line1.end, line2.start, line2.end];
  let A: number, B: number, C: number;
  let pointxx: number, pointyy: number;

  if (isPointOnLine(line2, line1.start)) return line1.start;
  if (isPointOnLine(line2, line1.end)) return line1.end;

  if (isPointOnLine(line1, line2.start)) return line2.start;
  if (isPointOnLine(line1, line2.end)) return line2.end;

  return TempCheck();

  function isPointOnLine(l: Line, c: Point): boolean {
    let p1 = l.start;
    let p2 = l.end;

    let dx1 = p2.x - p1.x;
    let dy1 = p2.y - p1.y;

    let dx = c.x - p1.x;
    let dy = c.y - p1.y;

    let S = dx1 * dy - dx * dy1;
    let ab = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    let h = S / ab;
    return Math.abs(h) < 0.1;
  }

  function VEK(ax: number, ay: number, bx: number, by: number) {
    return ax * by - bx * ay;
  }

  function CrossingCheck(p1: Point, p2: Point, p3: Point, p4: Point) {
    let v1, v2, v3, v4;

    v1 = VEK(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y);
    v2 = VEK(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y);
    v3 = VEK(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
    v4 = VEK(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y);
    if (v1 * v2 < 0 && v3 * v4 < 0) return true;
    else return false;
  }

  function EquationOfTheLine(p1: Point, p2: Point) {
    A = p2.y - p1.y;
    B = p1.x - p2.x;
    C = -p1.x * (p2.y - p1.y) + p1.y * (p2.x - p1.x);
  }

  function IntersectionX(
    a1: number,
    b1: number,
    c1: number,
    a2: number,
    b2: number,
    c2: number
  ) {
    let d, dx, pointx;
    d = a1 * b2 - b1 * a2;
    dx = -c1 * b2 + b1 * c2;
    pointx = dx / d;
    return pointx;
  }

  function IntersectionY(
    a1: number,
    b1: number,
    c1: number,
    a2: number,
    b2: number,
    c2: number
  ) {
    let d, dy, pointy;
    d = a1 * b2 - b1 * a2;
    dy = -a1 * c2 + c1 * a2;
    pointy = dy / d;
    return pointy;
  }

  function TempCheck(): Point | null {
    if (
      CrossingCheck(
        checkedPoints[0],
        checkedPoints[1],
        checkedPoints[2],
        checkedPoints[3]
      )
    ) {
      let a1, b1, c1, a2, b2, c2;
      EquationOfTheLine(checkedPoints[0], checkedPoints[1]);
      a1 = A;
      b1 = B;
      c1 = C;
      EquationOfTheLine(checkedPoints[2], checkedPoints[3]);
      a2 = A;
      b2 = B;
      c2 = C;
      pointxx = IntersectionX(a1, b1, c1, a2, b2, c2);
      pointyy = IntersectionY(a1, b1, c1, a2, b2, c2);
      return new Point(pointxx, pointyy);
    } else {
      return null;
    }
  }
}
