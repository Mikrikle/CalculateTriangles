import {
  findIntersectionPoint,
  findCommonLine,
  createTriangleFromLines,
  distanceBetweenPoints,
  distanceFromPointToLine,
  areLinesParallel,
  isPointOnLine,
} from "../src/coremath";
import { Point, Line, Triangle, arePointsEqual } from "../src/core";
import { suite, test } from "@testdeck/mocha";
import * as _chai from "chai";
import { expect } from "chai";

_chai.should();
_chai.expect;

@suite
class CalculationTests {
  private readonly tolerance = 0.01;

  @test
  "distanceBetweenPoints returns the correct distance for points with positive coordinates"() {
    const point1 = new Point(0, 0);
    const point2 = new Point(3, 4);
    const expectedDistance = 5;

    const distance = distanceBetweenPoints(point1, point2);

    distance.should.equal(expectedDistance);
  }

  @test
  "distanceBetweenPoints returns the correct distance for points with negative coordinates"() {
    const point1 = new Point(-2, -2);
    const point2 = new Point(-5, -6);
    const expectedDistance = 5;

    const distance = distanceBetweenPoints(point1, point2);

    distance.should.equal(expectedDistance);
  }

  @test
  "isPointOnLine returns false if the point is not on a line"() {
    const point = new Point(100, 10);
    const line = new Line(new Point(10, 10), new Point(50, 10));
    const expectedDistance = 0;

    const result = isPointOnLine(line, point);

    expect(result).is.false;
  }

  @test
  "distanceBetweenPoints returns zero for the same point"() {
    const p1 = new Point(1, 1);
    const p2 = new Point(1, 1);
    const expectedDistance = 0;

    const distance = distanceBetweenPoints(p1, p2);

    distance.should.equal(expectedDistance);
  }

  @test
  public "distanceFromPointToLine should return 0 if the point on the line"(): void {
    const point = new Point(2, 2);
    const line = new Line(new Point(1, 1), new Point(4, 4));
    const expectedPoint = point.clone();
    const expectedDistance = 0;

    const result = distanceFromPointToLine(point, line);
    const { nearestPoint: resultPoint, distance: resultDistance } = result;

    expect(resultPoint.x).to.be.closeTo(expectedPoint.x, this.tolerance);
    expect(resultPoint.y).to.be.closeTo(expectedPoint.y, this.tolerance);
    expect(resultDistance).to.be.closeTo(expectedDistance, this.tolerance);
  }

  @test
  public "distanceFromPointToLine should return lines end if point above line"(): void {
    const point = new Point(10, 10);
    const line = new Line(new Point(1, 3), new Point(7, 6));
    const expectedPoint = line.end.clone();
    const expectedDistance = 5;

    const result = distanceFromPointToLine(point, line);
    const { nearestPoint: resultPoint, distance: resultDistance } = result;

    expect(resultPoint.x).to.be.closeTo(expectedPoint.x, this.tolerance);
    expect(resultPoint.y).to.be.closeTo(expectedPoint.y, this.tolerance);
    expect(resultDistance).to.be.closeTo(expectedDistance, this.tolerance);
  }

  @test
  public "distanceFromPointToLine should return nearest point"(): void {
    const point = new Point(3, 7);
    const line = new Line(new Point(0, 0), new Point(0, 10));
    const expectedPoint = new Point(0, 7);
    const expectedDistance = 3;

    const result = distanceFromPointToLine(point, line);
    const { nearestPoint: resultPoint, distance: resultDistance } = result;

    expect(resultPoint.x).to.be.closeTo(expectedPoint.x, this.tolerance);
    expect(resultPoint.y).to.be.closeTo(expectedPoint.y, this.tolerance);
    expect(resultDistance).to.be.closeTo(expectedDistance, this.tolerance);
  }

  @test
  public "areLinesParallel should return true for parallel lines"(): void {
    const line1 = new Line(new Point(1, 1), new Point(3, 3));
    const line2 = new Line(new Point(2, 2), new Point(4, 4));
    const line3 = new Line(new Point(5, 5), new Point(-3, -3));

    expect(areLinesParallel(line1, line2)).to.be.true;
    expect(areLinesParallel(line2, line1)).to.be.true;
    expect(areLinesParallel(line1, line3)).to.be.true;
    expect(areLinesParallel(line3, line2)).to.be.true;
  }

  @test
  public "areLinesParallel should return true for parallel lines on X"(): void {
    const line1 = new Line(new Point(4, 4), new Point(4, 6));
    const line2 = new Line(new Point(4, 9), new Point(4, 6));
    const line3 = new Line(new Point(4, 4), new Point(4, -8));

    expect(areLinesParallel(line1, line2)).to.be.true;
    expect(areLinesParallel(line2, line1)).to.be.true;
    expect(areLinesParallel(line1, line3)).to.be.true;
    expect(areLinesParallel(line3, line2)).to.be.true;
  }


  @test
  public "areLinesParallel should return true for parallel lines on Y"(): void {
    const line1 = new Line(new Point(4, 4), new Point(6, 4));
    const line2 = new Line(new Point(9, 4), new Point(6, 4));
    const line3 = new Line(new Point(4, 4), new Point(-8, 4));

    expect(areLinesParallel(line1, line2)).to.be.true;
    expect(areLinesParallel(line2, line1)).to.be.true;
    expect(areLinesParallel(line1, line3)).to.be.true;
    expect(areLinesParallel(line3, line2)).to.be.true;
  }

  @test
  public "findCommonLine shold return true if two segments are parts of one line"(): void {
    const line1 = new Line(new Point(-4, -4), new Point(2, 2));
    const line2 = new Line(new Point(2, 2), new Point(4, 4));

    const result = findCommonLine(line1, line2);

    expect(arePointsEqual(line1.start, result.start)).to.be.true;
    expect(arePointsEqual(line2.end, result.end)).to.be.true;
  }

  @test
  public "findIntersectionPoint shold return correct intersection point"():void {
    const line1 = new Line(new Point(0, 0), new Point(0, 10));
    const line2 = new Line(new Point(5, 5), new Point(0, 5));
    const line3 = new Line(new Point(0, 5), new Point(5, 5));

    const result12 = findIntersectionPoint(line1, line2);
    const result13 = findIntersectionPoint(line1, line3);

    expect(result12).not.null;
    expect(result13).not.null;
    expect(result12.x).to.be.closeTo(0, this.tolerance);
    expect(result12.y).to.be.closeTo(5, this.tolerance);
  }

  @test
  public "findIntersectionPoint shold return null fot lines that do not intersect"():void {
    const line1 = new Line(new Point(10, 10), new Point(20, 10));
    const line2 = new Line(new Point(100, 50), new Point(100, 30));

    const result = findIntersectionPoint(line1, line2);
    
    expect(result).is.null;
  }

  @test
  public "findIntersectionPoint shold find correct intersection point for segments of the same line"():void {
    const line1 = new Line(new Point(0, 0), new Point(0, 10));
    const line2 = new Line(new Point(0, 10), new Point(0, 20));

    const result = findIntersectionPoint(line1, line2);

    expect(result).not.null;
    expect(result.x).to.be.closeTo(0, this.tolerance);
    expect(result.y).to.be.closeTo(10, this.tolerance);
  }

}
