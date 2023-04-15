import {
  checkIntersection,
  findCommonLine,
  createTriangleFromLines,
  distanceBetweenPoints,
  distanceFromPointToLine,
  areLinesParallel,
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
    const p1 = new Point(0, 0);
    const p2 = new Point(3, 4);
    const expectedDistance = 5;

    const distance = distanceBetweenPoints(p1, p2);

    distance.should.equal(expectedDistance);
  }

  @test
  "distanceBetweenPoints returns the correct distance for points with negative coordinates"() {
    const p1 = new Point(-2, -2);
    const p2 = new Point(-5, -6);
    const expectedDistance = 5;

    const distance = distanceBetweenPoints(p1, p2);

    distance.should.equal(expectedDistance);
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
  public "findCommonLine shold return true if two segments are parts of one line"(): void {
    const line1 = new Line(new Point(-4, -4), new Point(2, 2));
    const line2 = new Line(new Point(2, 2), new Point(4, 4));

    const result = findCommonLine(line1, line2);

    expect(arePointsEqual(line1.start, result.start)).to.be.true;
    expect(arePointsEqual(line2.end, result.end)).to.be.true;
  }
}
