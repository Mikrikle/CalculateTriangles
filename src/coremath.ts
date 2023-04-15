import { Point, Line, Triangle, arePointsEqual, EPSILON } from "./core";

/**
 * Creates a triangle from three lines.
 * @param line1 - The first line of the triangle.
 * @param line2 - The second line of the triangle.
 * @param line3 - The third line of the triangle.
 * @returns The triangle created from the given lines, or null if the lines cannot form a valid triangle.
 */
export function createTriangleFromLines(
  line1: Line,
  line2: Line,
  line3: Line
): Triangle | null {
  let hpoints = [
    line1.start,
    line1.end,
    line2.start,
    line2.end,
    line3.start,
    line3.end,
  ];
  hpoints = hpoints.filter(
    (value, index, self) =>
      index === self.findIndex((p) => arePointsEqual(p, value))
  );
  // The triangle must consist strictly of three unique points
  if (hpoints.length != 3) return null;

  // Checking for the possibility of the existence of a triangle
  var a = distanceBetweenPoints(line1.start, line1.end);
  var b = distanceBetweenPoints(line2.start, line2.end);
  var c = distanceBetweenPoints(line3.start, line3.end);
  if (a > b + c || b > a + c || c > a + b) return null;
  const p = (a + b + c) / 2;
  let S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
  if (isNaN(S) || S <= 1) return null;

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
    if (pd.distance < minDist) {
      minDist = pd.distance;
      minPoint = pd.nearestPoint;
    }
  }
  if (minPoint != null && minDist <= raduis) {
    point.x = minPoint.x;
    point.y = minPoint.y;
    return true;
  }
  return false;
}

/**
 * Calculates the distance between two points.
 * @param pointA - The first point
 * @param pointB - The second point
 * @returns The distance between the two points
 */
export function distanceBetweenPoints(pointA: Point, pointB: Point): number {
  return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
}

/**
 * Calculates the distance between a point and a line, and finds the nearest point on the line to the given point.
 * @param point - The point to find the distance to the line from.
 * @param line - The line to find the distance to the point from.
 * @returns The nearest point on the line to the given point and the distance between the given point and the line.
 */
export function distanceFromPointToLine(
  point: Point,
  line: Line
): { nearestPoint: Point; distance: number } {
  const { start, end } = line;
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // If the line is just a point, return distance to that point
  if (dx === 0 && dy === 0) {
    return {
      distance: distanceBetweenPoints(point, start),
      nearestPoint: start,
    };
  }

  // Calculate the parameter of the projection of the point onto the line
  const t =
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy);

  // If t is outside the range [0, 1], then the nearest point is one of the line endpoints
  if (t < 0) {
    return {
      distance: distanceBetweenPoints(point, start),
      nearestPoint: start,
    };
  } else if (t > 1) {
    return {
      distance: distanceBetweenPoints(point, end),
      nearestPoint: end,
    };
  }

  // Calculate the nearest point on the line and return its distance to the point
  const nearestPoint = new Point(start.x + t * dx, start.y + t * dy);
  const distance = distanceBetweenPoints(point, nearestPoint);
  return { distance, nearestPoint };
}

/**
 *  Returns a line which contains the common parts of two lines if they are parts of one line
 *  @param line1 The first line
 *  @param line2 The second line
 *  @returns A new Line object that represents the common parts of the two input lines, or null if they are not parts of one line
 */
export function findCommonLine(line1: Line, line2: Line): Line | null {
  if (!areLinesParallel(line1, line2)) return null;

  if (arePointsEqual(line1.start, line2.start))
    return new Line(line1.end, line2.end);

  if (arePointsEqual(line1.end, line2.end))
    return new Line(line1.start, line2.start);

  if (arePointsEqual(line1.start, line2.end))
    return new Line(line1.end, line2.start);

  if (arePointsEqual(line1.end, line2.start))
    return new Line(line1.start, line2.end);

  return null;
}

/**
 * Checks if two lines are parallel.
 *
 * @param line1 The first line.
 * @param line2 The second line.
 *
 * @returns True if the lines are parallel, false otherwise.
 */
export function areLinesParallel(line1: Line, line2: Line): boolean {
  if (
    Math.abs(line1.start.y - line1.end.y) <= EPSILON &&
    Math.abs(line2.start.y - line2.end.y) <= EPSILON
  ) {
    return true;
  }

  if (
    Math.abs(line1.start.x - line1.end.x) <= EPSILON &&
    Math.abs(line2.start.x - line2.end.x) <= EPSILON
  ) {
    return true;
  }

  let k1 = Math.atan(
    (line1.end.y - line1.start.y) / (line1.end.x - line1.start.x)
  );
  let k2 = Math.atan(
    (line2.end.y - line2.start.y) / (line2.end.x - line2.start.x)
  );
  return Math.abs(k1 - k2) <= EPSILON;
}

export function isPointOnLine(line: Line, point: Point): boolean {
  return (
    Math.abs(
      distanceBetweenPoints(line.start, point) +
        distanceBetweenPoints(line.end, point) -
        distanceBetweenPoints(line.end, line.start)
    ) <= EPSILON
  );
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
