import {
  Point,
  Line,
  Triangle,
  arePointsEqual,
  areLinesEqual,
  isTrianglesEqual,
} from "../src/core";
import { suite, test } from "@testdeck/mocha";
import * as _chai from "chai";
import { expect } from "chai";

_chai.should();
_chai.expect;

@suite
class PointTests {
  @test
  "arePointsEqual returns true for equal points"() {
    const p1 = new Point(0, 0);
    const p2 = new Point(0.01, 0.03);
    expect(arePointsEqual(p1, p2, 0.1)).to.be.true;
  }

  @test
  "arePointsEqual returns false for non-equal points"() {
    const p1 = new Point(0, 0);
    const p2 = new Point(1.3, 0.1);
    expect(arePointsEqual(p1, p2, 1.1)).to.be.false;
  }

  @test
  "arePointsEqual returns true for equal points with default tolerance"() {
    const p1 = new Point(0, 0);
    const p2 = new Point(0.1, 0.1);
    expect(arePointsEqual(p1, p2)).to.be.true;
  }

  @test
  public "clone method should return a new point with the same coordinates"(): void {
    // Arrange
    const originalPoint = new Point(1, 2);

    // Act
    const clonedPoint = originalPoint.clone();

    // Assert
    expect(clonedPoint).to.not.equal(originalPoint);
    expect(clonedPoint.x).to.equal(originalPoint.x);
    expect(clonedPoint.y).to.equal(originalPoint.y);
  }
}

@suite
class LineTests {
  @test
  "areLinesEqual returns true for lines with identical points"() {
    // Arrange
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 1);
    const lineA = new Line(p1, p2);
    const lineB = new Line(p1.clone(), p2.clone()); // clone to get a new reference

    // Act
    const result = areLinesEqual(lineA, lineB);

    // Assert
    expect(result).to.be.true;
  }

  @test
  "areLinesEqual returns true for collinear lines"() {
    // Arrange
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 1);
    const lineA = new Line(p1, p2);
    const lineB = new Line(p2, p1);

    // Act
    const result = areLinesEqual(lineA, lineB);

    // Assert
    expect(result).to.be.true;
  }
}

@suite
class TriangleTests {
  @test
  "isTrianglesEqual returns true for triangles with identical points"() {
    const p1 = new Point(0, 0);
    const p2 = new Point(5, 0);
    const p3 = new Point(0, 5);
    const t1 = new Triangle(p1, p2, p3);
    const t2 = new Triangle(p3, p1, p2);

    const result = isTrianglesEqual(t1, t2);

    expect(result).to.be.true;
  }

  @test
  "isTrianglesEqual returns false for triangles with different points"() {
    const t1 = new Triangle(new Point(0, 0), new Point(5, 0), new Point(0, 5));
    const t2 = new Triangle(new Point(0, 0), new Point(5, 5), new Point(0, 5));

    const result = isTrianglesEqual(t1, t2);

    expect(result).to.be.false;
  }
}
