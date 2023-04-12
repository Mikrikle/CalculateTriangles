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
  @param a The first point to compare.
  @param b The second point to compare.
  @param tolerance The maximum allowable difference between the coordinates of the two points.
  @returns True if the two points are equal within the given tolerance, false otherwise.
*/
export function arePointsEqual(
  a: Point,
  b: Point,
  tolerance: number = 1
): boolean {
  return Math.abs(a.x - b.x) <= tolerance && Math.abs(a.y - b.y) <= tolerance;
}

/**
  Determines whether two lines are equal within a given tolerance.
  @param a The first line to compare.
  @param b The second kine to compare.
  @param tolerance The maximum allowable difference between the coordinates of the endpoints of the two lines.
  @returns True if the two lines are equal within the given tolerance, false otherwise.
*/
export function areLinesEqual(
  a: Line,
  b: Line,
  tolerance: number = 1
): boolean {
  return (
    (arePointsEqual(a.start, b.start, tolerance) &&
      arePointsEqual(a.end, b.end, tolerance)) ||
    (arePointsEqual(a.end, b.start, tolerance) &&
      arePointsEqual(a.start, b.end, tolerance))
  );
}

/**
  Determines whether two triangles are equal within a given tolerance.
  @param a The first triangle to compare.
  @param b The second triangle to compare.
  @param tolerance The maximum allowable difference between the coordinates of the vertices of the two triangles.
  @returns True if the two triangles are equal within the given tolerance, false otherwise.
*/
export function isTrianglesEqual(
  a: Triangle,
  b: Triangle,
  tolerance: number = 1
): boolean {
  return a.points.every((pointA) =>
    b.points.find((pointB) => arePointsEqual(pointA, pointB, tolerance))
  );
}
