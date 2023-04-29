export var EPSILON: number = 0.1;

/**
 * Represents a point in 2D coordinate system.
 */
export class Point {
  constructor(public x: number, public y: number) {}

  /**
  * Creates a new `Point` object with the same x and y coordinates as this one.
  * @returns A new `Point` object with the same x and y coordinates as this one.
  */
  public clone(): Point {
    return new Point(this.x, this.y);
  }
}

/**
 * Represents a line by two points.
 */
export class Line {
  constructor(public start: Point, public end: Point) {}
}

/**
 * Represents a triangle by three points.
 */
export class Triangle {
  public points: Point[];
  constructor(public p1: Point, public p2: Point, public p3: Point) {
    this.points = [p1, p2, p3];
  }
}

/**
  Determines whether two points are equal within a given tolerance.
  @param pointA The first point to compare.
  @param pointB The second point to compare.
  @param tolerance The maximum allowable difference between the coordinates of the two points.
  @returns True if the two points are equal within the given tolerance, false otherwise.
*/
export function arePointsEqual(
  pointA: Point,
  pointB: Point,
  tolerance: number = 1
): boolean {
  return Math.abs(pointA.x - pointB.x) <= tolerance && Math.abs(pointA.y - pointB.y) <= tolerance;
}

/**
  Determines whether two lines are equal within a given tolerance.
  @param lineA The first line to compare.
  @param lineB The second kine to compare.
  @param tolerance The maximum allowable difference between the coordinates of the endpoints of the two lines.
  @returns True if the two lines are equal within the given tolerance, false otherwise.
*/
export function areLinesEqual(
  lineA: Line,
  lineB: Line,
  tolerance: number = 1
): boolean {
  return (
    (arePointsEqual(lineA.start, lineB.start, tolerance) &&
      arePointsEqual(lineA.end, lineB.end, tolerance)) ||
    (arePointsEqual(lineA.end, lineB.start, tolerance) &&
      arePointsEqual(lineA.start, lineB.end, tolerance))
  );
}

/**
  Determines whether two triangles are equal within a given tolerance.
  @param triangleA The first triangle to compare.
  @param triangleB The second triangle to compare.
  @param tolerance The maximum allowable difference between the coordinates of the vertices of the two triangles.
  @returns True if the two triangles are equal within the given tolerance, false otherwise.
*/
export function isTrianglesEqual(
  triangleA: Triangle,
  triangleB: Triangle,
  tolerance: number = 1
): boolean {
  return triangleA.points.every((pointA) =>
    triangleB.points.find((pointB) => arePointsEqual(pointA, pointB, tolerance))
  );
}
