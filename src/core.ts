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
