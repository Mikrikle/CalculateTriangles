import { TrianglesCalculator } from "../src/calculator";
import { Point, Line, Triangle } from "../src/core";
import { suite, test } from "@testdeck/mocha";
import * as _chai from "chai";
import { expect } from "chai";

_chai.should();
_chai.expect;

@suite
class TrianglesCalculatorTests {
  @test
  "After calling calc, the object must store the correct number of triangles"(): void {
    const calculator = new TrianglesCalculator();
    const lines = [
      new Line(new Point(0, 100), new Point(0, 0)),
      new Line(new Point(0, 100), new Point(30, 0)),
      new Line(new Point(0, 100), new Point(60, 0)),
      new Line(new Point(0, 100), new Point(100, 0)),
      new Line(new Point(0, 0), new Point(100, 0)),
      new Line(new Point(0, 50), new Point(50, 50)),
      new Line(new Point(0, 0), new Point(50, 50)),

    ];

    calculator.calc(lines);

    expect(calculator.triangles.length).to.equal(24);
  }

  @test
  "Testing the case if the sides of a triangle consist of more than one segment"(): void {
    const calculator = new TrianglesCalculator();
    const lines = [
      new Line(new Point(0, 0), new Point(0, 50)),
      new Line(new Point(0, 50), new Point(0, 100)),

      new Line(new Point(0, 0), new Point(50, 0)),
      new Line(new Point(50, 0), new Point(100, 0)),

      new Line(new Point(100, 0), new Point(50, 50)),
      new Line(new Point(50, 50), new Point(0, 100)),
    ];

    calculator.calc(lines);

    expect(calculator.triangles.length).to.equal(1);
  }
}
