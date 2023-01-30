export class Point {
  constructor(public x: number, public y: number) {}

  public clone(): Point {
    return new Point(this.x, this.y);
  }
}

export class Line {
  constructor(public start: Point, public end: Point) {}
}

export class Triangle {
  constructor(public p1: Point, public p2: Point, public p3: Point) {}
}

export function isPointsEqual(a: Point, b: Point): boolean {
  return Math.abs(a.x - b.x) <= 0.001 && Math.abs(a.y - b.y) <= 0.001;
}

export function isLinesEqual(a: Line, b: Line): boolean {
  return (
    (isPointsEqual(a.start, b.start) && isPointsEqual(a.end, b.end)) ||
    (isPointsEqual(a.end, b.start) && isPointsEqual(a.start, b.end))
  );
}

export function isTrianglesEqual(a: Triangle, b: Triangle): boolean {
  let equals = 0;
  equals +=
    isPointsEqual(a.p1, b.p1) ||
    isPointsEqual(a.p1, b.p2) ||
    isPointsEqual(a.p1, b.p3)
      ? 1
      : 0;
  equals +=
    isPointsEqual(a.p2, b.p1) ||
    isPointsEqual(a.p2, b.p2) ||
    isPointsEqual(a.p2, b.p3)
      ? 1
      : 0;
  equals +=
    isPointsEqual(a.p3, b.p1) ||
    isPointsEqual(a.p3, b.p2) ||
    isPointsEqual(a.p3, b.p3)
      ? 1
      : 0;
  return equals === 3;
}

export function distanceBetween(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
