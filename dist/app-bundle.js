/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EPSILON": () => (/* binding */ EPSILON),
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "Point": () => (/* binding */ Point),
/* harmony export */   "Triangle": () => (/* binding */ Triangle),
/* harmony export */   "areLinesEqual": () => (/* binding */ areLinesEqual),
/* harmony export */   "arePointsEqual": () => (/* binding */ arePointsEqual),
/* harmony export */   "isTrianglesEqual": () => (/* binding */ isTrianglesEqual)
/* harmony export */ });
var EPSILON = 0.1;
/**
 * Represents a point in 2D coordinate system.
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
    * Creates a new `Point` object with the same x and y coordinates as this one.
    * @returns A new `Point` object with the same x and y coordinates as this one.
    */
    clone() {
        return new Point(this.x, this.y);
    }
}
/**
 * Represents a line by two points.
 */
class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
/**
 * Represents a triangle by three points.
 */
class Triangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
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
function arePointsEqual(pointA, pointB, tolerance = 1) {
    return Math.abs(pointA.x - pointB.x) <= tolerance && Math.abs(pointA.y - pointB.y) <= tolerance;
}
/**
  Determines whether two lines are equal within a given tolerance.
  @param lineA The first line to compare.
  @param lineB The second kine to compare.
  @param tolerance The maximum allowable difference between the coordinates of the endpoints of the two lines.
  @returns True if the two lines are equal within the given tolerance, false otherwise.
*/
function areLinesEqual(lineA, lineB, tolerance = 1) {
    return ((arePointsEqual(lineA.start, lineB.start, tolerance) &&
        arePointsEqual(lineA.end, lineB.end, tolerance)) ||
        (arePointsEqual(lineA.end, lineB.start, tolerance) &&
            arePointsEqual(lineA.start, lineB.end, tolerance)));
}
/**
  Determines whether two triangles are equal within a given tolerance.
  @param triangleA The first triangle to compare.
  @param triangleB The second triangle to compare.
  @param tolerance The maximum allowable difference between the coordinates of the vertices of the two triangles.
  @returns True if the two triangles are equal within the given tolerance, false otherwise.
*/
function isTrianglesEqual(triangleA, triangleB, tolerance = 1) {
    return triangleA.points.every((pointA) => triangleB.points.find((pointB) => arePointsEqual(pointA, pointB, tolerance)));
}


/***/ }),

/***/ "./src/coremath.ts":
/*!*************************!*\
  !*** ./src/coremath.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "areLinesParallel": () => (/* binding */ areLinesParallel),
/* harmony export */   "checkIntersection": () => (/* binding */ checkIntersection),
/* harmony export */   "createTriangleFromLines": () => (/* binding */ createTriangleFromLines),
/* harmony export */   "distanceBetweenPoints": () => (/* binding */ distanceBetweenPoints),
/* harmony export */   "distanceFromPointToLine": () => (/* binding */ distanceFromPointToLine),
/* harmony export */   "findCommonLine": () => (/* binding */ findCommonLine),
/* harmony export */   "isPointOnLine": () => (/* binding */ isPointOnLine),
/* harmony export */   "mergePointWithLine": () => (/* binding */ mergePointWithLine),
/* harmony export */   "mergePointWithLinePoints": () => (/* binding */ mergePointWithLinePoints),
/* harmony export */   "mergePointWithPoint": () => (/* binding */ mergePointWithPoint)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/core.ts");

/**
 * Creates a triangle from three lines.
 * @param line1 - The first line of the triangle.
 * @param line2 - The second line of the triangle.
 * @param line3 - The third line of the triangle.
 * @returns The triangle created from the given lines, or null if the lines cannot form a valid triangle.
 */
function createTriangleFromLines(line1, line2, line3) {
    let hpoints = [
        line1.start,
        line1.end,
        line2.start,
        line2.end,
        line3.start,
        line3.end,
    ];
    hpoints = hpoints.filter((value, index, self) => index === self.findIndex((p) => (0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(p, value)));
    // The triangle must consist strictly of three unique points
    if (hpoints.length != 3)
        return null;
    // Checking for the possibility of the existence of a triangle
    var a = distanceBetweenPoints(line1.start, line1.end);
    var b = distanceBetweenPoints(line2.start, line2.end);
    var c = distanceBetweenPoints(line3.start, line3.end);
    if (a > b + c || b > a + c || c > a + b)
        return null;
    const p = (a + b + c) / 2;
    let S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
    if (isNaN(S) || S <= 1)
        return null;
    return new _core__WEBPACK_IMPORTED_MODULE_0__.Triangle(hpoints[0], hpoints[1], hpoints[2]);
}
function mergePointWithPoint(point, points, raduis) {
    let minPoint = null;
    let minDist = Number.MAX_SAFE_INTEGER;
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
function mergePointWithLinePoints(point, lines, raduis) {
    let minPoint = null;
    let minDist = Number.MAX_SAFE_INTEGER;
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
function mergePointWithLine(point, lines, raduis) {
    let minPoint = null;
    let minDist = Number.MAX_SAFE_INTEGER;
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
function distanceBetweenPoints(pointA, pointB) {
    return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
}
/**
 * Calculates the distance between a point and a line, and finds the nearest point on the line to the given point.
 * @param point - The point to find the distance to the line from.
 * @param line - The line to find the distance to the point from.
 * @returns The nearest point on the line to the given point and the distance between the given point and the line.
 */
function distanceFromPointToLine(point, line) {
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
    const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy);
    // If t is outside the range [0, 1], then the nearest point is one of the line endpoints
    if (t < 0) {
        return {
            distance: distanceBetweenPoints(point, start),
            nearestPoint: start,
        };
    }
    else if (t > 1) {
        return {
            distance: distanceBetweenPoints(point, end),
            nearestPoint: end,
        };
    }
    // Calculate the nearest point on the line and return its distance to the point
    const nearestPoint = new _core__WEBPACK_IMPORTED_MODULE_0__.Point(start.x + t * dx, start.y + t * dy);
    const distance = distanceBetweenPoints(point, nearestPoint);
    return { distance, nearestPoint };
}
/**
 *  Returns a line which contains the common parts of two lines if they are parts of one line
 *  @param line1 The first line
 *  @param line2 The second line
 *  @returns A new Line object that represents the common parts of the two input lines, or null if they are not parts of one line
 */
function findCommonLine(line1, line2) {
    if (!areLinesParallel(line1, line2))
        return null;
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.start, line2.start))
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Line(line1.end, line2.end);
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.end, line2.end))
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Line(line1.start, line2.start);
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.start, line2.end))
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Line(line1.end, line2.start);
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.end, line2.start))
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Line(line1.start, line2.end);
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
function areLinesParallel(line1, line2) {
    if (Math.abs(line1.start.y - line1.end.y) <= _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON &&
        Math.abs(line2.start.y - line2.end.y) <= _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
        return true;
    }
    if (Math.abs(line1.start.x - line1.end.x) <= _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON &&
        Math.abs(line2.start.x - line2.end.x) <= _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
        return true;
    }
    let k1 = Math.atan((line1.end.y - line1.start.y) / (line1.end.x - line1.start.x));
    let k2 = Math.atan((line2.end.y - line2.start.y) / (line2.end.x - line2.start.x));
    return Math.abs(k1 - k2) <= _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON;
}
function isPointOnLine(line, point) {
    return (Math.abs(distanceBetweenPoints(line.start, point) +
        distanceBetweenPoints(line.end, point) -
        distanceBetweenPoints(line.end, line.start)) <= _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON);
}
function checkIntersection(line1, line2) {
    let checkedPoints = [line1.start, line1.end, line2.start, line2.end];
    let A, B, C;
    let pointxx, pointyy;
    if (isPointOnLine(line2, line1.start))
        return line1.start;
    if (isPointOnLine(line2, line1.end))
        return line1.end;
    if (isPointOnLine(line1, line2.start))
        return line2.start;
    if (isPointOnLine(line1, line2.end))
        return line2.end;
    return TempCheck();
    function VEK(ax, ay, bx, by) {
        return ax * by - bx * ay;
    }
    function CrossingCheck(p1, p2, p3, p4) {
        let v1, v2, v3, v4;
        v1 = VEK(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y);
        v2 = VEK(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y);
        v3 = VEK(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
        v4 = VEK(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y);
        if (v1 * v2 < 0 && v3 * v4 < 0)
            return true;
        else
            return false;
    }
    function EquationOfTheLine(p1, p2) {
        A = p2.y - p1.y;
        B = p1.x - p2.x;
        C = -p1.x * (p2.y - p1.y) + p1.y * (p2.x - p1.x);
    }
    function IntersectionX(a1, b1, c1, a2, b2, c2) {
        let d, dx, pointx;
        d = a1 * b2 - b1 * a2;
        dx = -c1 * b2 + b1 * c2;
        pointx = dx / d;
        return pointx;
    }
    function IntersectionY(a1, b1, c1, a2, b2, c2) {
        let d, dy, pointy;
        d = a1 * b2 - b1 * a2;
        dy = -a1 * c2 + c1 * a2;
        pointy = dy / d;
        return pointy;
    }
    function TempCheck() {
        if (CrossingCheck(checkedPoints[0], checkedPoints[1], checkedPoints[2], checkedPoints[3])) {
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
            return new _core__WEBPACK_IMPORTED_MODULE_0__.Point(pointxx, pointyy);
        }
        else {
            return null;
        }
    }
}


/***/ }),

/***/ "./src/inputtrianglecanvas.ts":
/*!************************************!*\
  !*** ./src/inputtrianglecanvas.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InputTriangleCanvas": () => (/* binding */ InputTriangleCanvas),
/* harmony export */   "InputTriangleCanvasConfig": () => (/* binding */ InputTriangleCanvasConfig)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/core.ts");
/* harmony import */ var _trianglecanvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");
/* harmony import */ var _coremath__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./coremath */ "./src/coremath.ts");



class InputTriangleCanvasConfig extends _trianglecanvas__WEBPACK_IMPORTED_MODULE_1__.TriangleCanvasConfig {
    constructor(init) {
        super(init);
        this.mergeRadius = 50;
        Object.assign(this, init);
    }
}
class DrawAction {
}
class InputTriangleCanvas extends _trianglecanvas__WEBPACK_IMPORTED_MODULE_1__.TriangleCanvas {
    constructor(config) {
        super(config);
        this.config = config;
        this.lines = [];
        this.intersectionPoints = [[]];
        this.cancelledActions = [];
        this.mousePos = new _core__WEBPACK_IMPORTED_MODULE_0__.Point(0, 0);
        this.pointermoveEventHandler = (e) => {
            this.updateMousePos(e);
            this.clearCanvas();
            this.redraw();
            if (this.selectedPoint != null) {
                this.drawLine(this.selectedPoint, this.mousePos);
            }
        };
        this.pointerdownEventHandler = (e) => {
            this.updateMousePos(e);
            this.correctSelectedPoint();
        };
        this.pointerupEventHandler = (e) => {
            if (this.selectedPoint == null)
                return;
            this.correctMousePoint();
            let line = new _core__WEBPACK_IMPORTED_MODULE_0__.Line(this.selectedPoint.clone(), this.mousePos.clone());
            this.addIntersectionPoint(line);
            this.lines.push(line);
            this.selectedPoint = null;
            this.redraw();
        };
        this.runUserEvents();
    }
    clearAll() {
        this.clearCanvas();
        this.lines = [];
        this.intersectionPoints = [[]];
        this.cancelledActions = [];
    }
    undo() {
        if (this.lines.length == 0)
            return;
        this.cancelledActions.push({
            line: this.lines.pop(),
            ipoints: this.intersectionPoints.length > 0 ? this.intersectionPoints.pop() : [],
        });
        this.redraw();
    }
    redo() {
        if (this.cancelledActions.length == 0)
            return;
        let savedAction = this.cancelledActions.pop();
        this.lines.push(savedAction.line);
        if (savedAction.ipoints.length > 0)
            this.intersectionPoints.push(savedAction.ipoints);
        this.redraw();
    }
    updateMousePos(e) {
        const rect = this.canvasElement.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
    }
    mergePointWithIntersectionPoints(point) {
        if ((0,_coremath__WEBPACK_IMPORTED_MODULE_2__.mergePointWithPoint)(point, this.intersectionPoints.reduce((accum, item) => {
            accum.push(...item);
            return accum;
        }, []), this.config.mergeRadius))
            return true;
        return false;
    }
    mergePointWithGrid(point) {
        let size = this.config.gridCellSize;
        let cx = Math.floor(point.x / size);
        let cy = Math.floor(point.y / size);
        let startPoint = new _core__WEBPACK_IMPORTED_MODULE_0__.Point(cx * size, cy * size);
        let gridPoints = [
            startPoint,
            new _core__WEBPACK_IMPORTED_MODULE_0__.Point(startPoint.x + this.config.gridCellSize, startPoint.y),
            new _core__WEBPACK_IMPORTED_MODULE_0__.Point(startPoint.x, startPoint.y + this.config.gridCellSize),
            new _core__WEBPACK_IMPORTED_MODULE_0__.Point(startPoint.x + this.config.gridCellSize, startPoint.y + this.config.gridCellSize),
        ];
        if ((0,_coremath__WEBPACK_IMPORTED_MODULE_2__.mergePointWithPoint)(point, gridPoints, this.config.gridCellSize))
            return true;
        return false;
    }
    addIntersectionPoint(line) {
        let points = [];
        for (let withLine of this.lines) {
            let point = (0,_coremath__WEBPACK_IMPORTED_MODULE_2__.checkIntersection)(line, withLine);
            if (point != null)
                points.push(point);
        }
        if (points.length > 0) {
            this.intersectionPoints.push(points);
        }
    }
    correctPointPos(point) {
        let res = false;
        if (!res) {
            res = this.mergePointWithIntersectionPoints(point);
        }
        if (!res) {
            res = (0,_coremath__WEBPACK_IMPORTED_MODULE_2__.mergePointWithLinePoints)(point, this.lines, this.config.mergeRadius * 2);
        }
        if (!res) {
            res = (0,_coremath__WEBPACK_IMPORTED_MODULE_2__.mergePointWithLine)(point, this.lines, this.config.mergeRadius * 2);
        }
        if (!res && this.config.useGrid) {
            res = this.mergePointWithGrid(point);
        }
    }
    correctMousePoint() {
        this.correctPointPos(this.mousePos);
    }
    correctSelectedPoint() {
        let point = new _core__WEBPACK_IMPORTED_MODULE_0__.Point(this.mousePos.x, this.mousePos.y);
        this.correctPointPos(point);
        this.selectedPoint = point.clone();
    }
    redraw() {
        this.clearCanvas();
        for (let line of this.lines) {
            this.drawLine(line.start, line.end);
        }
        for (let line of this.lines) {
            this.drawPoint(line.start);
            this.drawPoint(line.end);
        }
        for (let ipoints of this.intersectionPoints) {
            for (let point of ipoints) {
                this.drawPoint(point);
            }
        }
    }
    runUserEvents() {
        let canvas = this.canvasElement;
        canvas.addEventListener("pointerdown", this.pointerdownEventHandler, false);
        canvas.addEventListener("pointerup", this.pointerupEventHandler, false);
        canvas.addEventListener("pointercancel", () => { }, false);
        canvas.addEventListener("pointermove", this.pointermoveEventHandler, false);
    }
}


/***/ }),

/***/ "./src/outputtrianglecanvas.ts":
/*!*************************************!*\
  !*** ./src/outputtrianglecanvas.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OutputTriangleCanvas": () => (/* binding */ OutputTriangleCanvas),
/* harmony export */   "OutputTriangleCanvasConfig": () => (/* binding */ OutputTriangleCanvasConfig)
/* harmony export */ });
/* harmony import */ var _trianglecanvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");

class OutputTriangleCanvasConfig extends _trianglecanvas__WEBPACK_IMPORTED_MODULE_0__.TriangleCanvasConfig {
    constructor(init) {
        super(init);
        Object.assign(this, init);
    }
}
class OutputTriangleCanvas extends _trianglecanvas__WEBPACK_IMPORTED_MODULE_0__.TriangleCanvas {
    constructor(config) {
        super(config);
        this.config = config;
    }
    drawLines(lines, color = this
        .config.color, lineWidth = this.config.lineWidth) {
        for (let line of lines) {
            this.drawLine(line.start, line.end, color, lineWidth);
        }
    }
    drawPoints(points, color = this
        .config.color, pointSize = this.config.pointSize) {
        for (let point of points) {
            this.drawPoint(point, color, pointSize);
        }
    }
    drawTriangles(triangles, color = this
        .config.color, lineWidth = this.config.lineWidth) {
        for (let triangle of triangles) {
            this.drawTriangle(triangle, color, lineWidth);
        }
    }
}


/***/ }),

/***/ "./src/trianglecanvas.ts":
/*!*******************************!*\
  !*** ./src/trianglecanvas.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorGenerator": () => (/* binding */ ColorGenerator),
/* harmony export */   "TriangleCanvas": () => (/* binding */ TriangleCanvas),
/* harmony export */   "TriangleCanvasConfig": () => (/* binding */ TriangleCanvasConfig)
/* harmony export */ });
class ColorGenerator {
    constructor(generate) {
        this.generate = generate;
    }
}
class TriangleCanvasConfig {
    constructor(init) {
        this.color = "#000000";
        this.lineWidth = 3;
        this.pointSize = 5;
        this.canvasId = "canvas";
        this.useGrid = false;
        this.gridColor = "#505050";
        this.gridLineWidth = 1;
        this.gridCellSize = 40;
        Object.assign(this, init);
    }
}
class TriangleCanvas {
    constructor(config) {
        this.config = config;
        this.onResize = (e) => {
            let temp = this.ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
            this.canvasElement.width = this.canvasElement.offsetWidth;
            this.canvasElement.height = this.canvasElement.offsetHeight;
            this.ctx.putImageData(temp, 0, 0);
        };
        this.canvasElement = document.getElementById(config.canvasId);
        this.canvasElement.width = this.canvasElement.offsetWidth;
        this.canvasElement.height = this.canvasElement.offsetHeight;
        window.addEventListener("resize", this.onResize, false);
        this.ctx = this.canvasElement.getContext("2d", {
            willReadFrequently: true,
        });
        this.ctx.lineCap = "round";
        if (this.config.useGrid) {
            this.drawGrid();
        }
    }
    drawGrid(color = this.config.gridColor, size = this.config.gridCellSize) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.canvasElement.width; x += size) {
            this.ctx.moveTo(x + 0.5, 0);
            this.ctx.lineTo(x + 0.5, this.canvasElement.height);
        }
        for (let y = 0; y <= this.canvasElement.height; y += size) {
            this.ctx.moveTo(0, y + 0.5);
            this.ctx.lineTo(this.canvasElement.width, y + 0.5);
        }
        this.ctx.stroke();
    }
    drawLine(from, to, color = this
        .config.color, lineWidth = this.config.lineWidth) {
        if (!from || !to)
            return;
        this.ctx.beginPath();
        if (color instanceof ColorGenerator)
            this.ctx.strokeStyle = color.generate();
        else
            this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
    }
    drawPoint(point, color = this
        .config.color, pointSize = this.config.pointSize) {
        if (!point)
            return;
        this.ctx.beginPath();
        if (color instanceof ColorGenerator)
            this.ctx.fillStyle = color.generate();
        else
            this.ctx.fillStyle = color;
        let size = pointSize;
        this.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
        this.ctx.stroke();
    }
    drawTriangle(triangle, color = this
        .config.color, lineWidth = this.config.lineWidth) {
        if (!triangle)
            return;
        this.ctx.beginPath();
        if (color instanceof ColorGenerator)
            this.ctx.fillStyle = color.generate();
        else
            this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(triangle.p1.x, triangle.p1.y);
        this.ctx.lineTo(triangle.p2.x, triangle.p2.y);
        this.ctx.lineTo(triangle.p3.x, triangle.p3.y);
        this.ctx.lineTo(triangle.p1.x, triangle.p1.y);
        this.ctx.stroke();
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        if (this.config.useGrid) {
            this.drawGrid();
        }
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".app-bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _inputtrianglecanvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inputtrianglecanvas */ "./src/inputtrianglecanvas.ts");
/* harmony import */ var _outputtrianglecanvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./outputtrianglecanvas */ "./src/outputtrianglecanvas.ts");


let calculator;
const calculatorLoading = document.getElementById("loading");
const calculateworker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_workers_calc_worker_ts"), __webpack_require__.b));
calculateworker.onmessage = (message) => {
    calculator = message.data;
    console.log(calculator);
    if (trianglesCounter) {
        trianglesCounter.textContent = calculator.triangles.length;
    }
    drawOutputCanvas();
    drawTrianglesSelector();
    outputCanvas.canvasElement.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });
    calculatorLoading.style.visibility = "hidden";
};
const canvas = new _inputtrianglecanvas__WEBPACK_IMPORTED_MODULE_0__.InputTriangleCanvas(new _inputtrianglecanvas__WEBPACK_IMPORTED_MODULE_0__.InputTriangleCanvasConfig({
    color: "white",
    lineWidth: 2,
    pointSize: 8,
    canvasId: "canvas",
    mergeRadius: 25,
    useGrid: true,
    gridCellSize: 40,
    gridLineWidth: 20,
}));
let showTriangleIndex = 0;
const trianglesSelector = document.getElementById("triangles-selector");
const trianglesCounter = document.getElementById("triangles-count");
const outputCanvas = new _outputtrianglecanvas__WEBPACK_IMPORTED_MODULE_1__.OutputTriangleCanvas(new _outputtrianglecanvas__WEBPACK_IMPORTED_MODULE_1__.OutputTriangleCanvasConfig({
    color: "black",
    lineWidth: 2,
    pointSize: 4,
    canvasId: "triangles",
}));
function drawOutputCanvas() {
    outputCanvas.clearCanvas();
    if (!calculator)
        return;
    outputCanvas.drawLines(calculator.lines, "grey", 1);
    outputCanvas.drawPoints(calculator.points, "gray", 5);
    outputCanvas.drawTriangle(calculator.triangles[showTriangleIndex], "#EB618F", 4);
}
function drawTrianglesSelector() {
    if (trianglesSelector && calculator && calculator.triangles.length > 0) {
        trianglesSelector.textContent = `${showTriangleIndex + 1} / ${calculator.triangles.length}`;
    }
}
document.getElementById("clear")?.addEventListener("click", () => {
    showTriangleIndex = 0;
    calculator = null;
    canvas.clearAll();
    outputCanvas.clearCanvas();
    if (trianglesSelector) {
        trianglesSelector.textContent = "0 / 0";
    }
    if (trianglesCounter) {
        trianglesCounter.textContent = "0";
    }
});
document.getElementById("btn-prev")?.addEventListener("click", () => {
    if (calculator && showTriangleIndex > 0)
        showTriangleIndex--;
    drawOutputCanvas();
    drawTrianglesSelector();
});
document.getElementById("btn-next")?.addEventListener("click", () => {
    if (calculator && showTriangleIndex < calculator.triangles.length - 1)
        showTriangleIndex++;
    drawOutputCanvas();
    drawTrianglesSelector();
});
document.getElementById("calc")?.addEventListener("click", () => {
    calculatorLoading.style.visibility = "visible";
    calculateworker.postMessage(canvas.lines);
});
document.getElementById("redo")?.addEventListener("click", () => {
    canvas.redo();
});
document.getElementById("undo")?.addEventListener("click", () => {
    canvas.undo();
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQzlELE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jb3JlLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jb3JlbWF0aC50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvaW5wdXR0cmlhbmdsZWNhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvb3V0cHV0dHJpYW5nbGVjYW52YXMudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL3RyaWFuZ2xlY2FudmFzLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvYXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB2YXIgRVBTSUxPTjogbnVtYmVyID0gMC4xO1xyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgYSBwb2ludCBpbiAyRCBjb29yZGluYXRlIHN5c3RlbS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cclxuXHJcbiAgLyoqXHJcbiAgKiBDcmVhdGVzIGEgbmV3IGBQb2ludGAgb2JqZWN0IHdpdGggdGhlIHNhbWUgeCBhbmQgeSBjb29yZGluYXRlcyBhcyB0aGlzIG9uZS5cclxuICAqIEByZXR1cm5zIEEgbmV3IGBQb2ludGAgb2JqZWN0IHdpdGggdGhlIHNhbWUgeCBhbmQgeSBjb29yZGluYXRlcyBhcyB0aGlzIG9uZS5cclxuICAqL1xyXG4gIHB1YmxpYyBjbG9uZSgpOiBQb2ludCB7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXByZXNlbnRzIGEgbGluZSBieSB0d28gcG9pbnRzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExpbmUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogUG9pbnQsIHB1YmxpYyBlbmQ6IFBvaW50KSB7fVxyXG59XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIHRyaWFuZ2xlIGJ5IHRocmVlIHBvaW50cy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZSB7XHJcbiAgcHVibGljIHBvaW50czogUG9pbnRbXTtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcDE6IFBvaW50LCBwdWJsaWMgcDI6IFBvaW50LCBwdWJsaWMgcDM6IFBvaW50KSB7XHJcbiAgICB0aGlzLnBvaW50cyA9IFtwMSwgcDIsIHAzXTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gIERldGVybWluZXMgd2hldGhlciB0d28gcG9pbnRzIGFyZSBlcXVhbCB3aXRoaW4gYSBnaXZlbiB0b2xlcmFuY2UuXHJcbiAgQHBhcmFtIHBvaW50QSBUaGUgZmlyc3QgcG9pbnQgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gcG9pbnRCIFRoZSBzZWNvbmQgcG9pbnQgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gdG9sZXJhbmNlIFRoZSBtYXhpbXVtIGFsbG93YWJsZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSB0d28gcG9pbnRzLlxyXG4gIEByZXR1cm5zIFRydWUgaWYgdGhlIHR3byBwb2ludHMgYXJlIGVxdWFsIHdpdGhpbiB0aGUgZ2l2ZW4gdG9sZXJhbmNlLCBmYWxzZSBvdGhlcndpc2UuXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcmVQb2ludHNFcXVhbChcclxuICBwb2ludEE6IFBvaW50LFxyXG4gIHBvaW50QjogUG9pbnQsXHJcbiAgdG9sZXJhbmNlOiBudW1iZXIgPSAxXHJcbik6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBNYXRoLmFicyhwb2ludEEueCAtIHBvaW50Qi54KSA8PSB0b2xlcmFuY2UgJiYgTWF0aC5hYnMocG9pbnRBLnkgLSBwb2ludEIueSkgPD0gdG9sZXJhbmNlO1xyXG59XHJcblxyXG4vKipcclxuICBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIGxpbmVzIGFyZSBlcXVhbCB3aXRoaW4gYSBnaXZlbiB0b2xlcmFuY2UuXHJcbiAgQHBhcmFtIGxpbmVBIFRoZSBmaXJzdCBsaW5lIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIGxpbmVCIFRoZSBzZWNvbmQga2luZSB0byBjb21wYXJlLlxyXG4gIEBwYXJhbSB0b2xlcmFuY2UgVGhlIG1heGltdW0gYWxsb3dhYmxlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIGVuZHBvaW50cyBvZiB0aGUgdHdvIGxpbmVzLlxyXG4gIEByZXR1cm5zIFRydWUgaWYgdGhlIHR3byBsaW5lcyBhcmUgZXF1YWwgd2l0aGluIHRoZSBnaXZlbiB0b2xlcmFuY2UsIGZhbHNlIG90aGVyd2lzZS5cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZUxpbmVzRXF1YWwoXHJcbiAgbGluZUE6IExpbmUsXHJcbiAgbGluZUI6IExpbmUsXHJcbiAgdG9sZXJhbmNlOiBudW1iZXIgPSAxXHJcbik6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICAoYXJlUG9pbnRzRXF1YWwobGluZUEuc3RhcnQsIGxpbmVCLnN0YXJ0LCB0b2xlcmFuY2UpICYmXHJcbiAgICAgIGFyZVBvaW50c0VxdWFsKGxpbmVBLmVuZCwgbGluZUIuZW5kLCB0b2xlcmFuY2UpKSB8fFxyXG4gICAgKGFyZVBvaW50c0VxdWFsKGxpbmVBLmVuZCwgbGluZUIuc3RhcnQsIHRvbGVyYW5jZSkgJiZcclxuICAgICAgYXJlUG9pbnRzRXF1YWwobGluZUEuc3RhcnQsIGxpbmVCLmVuZCwgdG9sZXJhbmNlKSlcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIHRyaWFuZ2xlcyBhcmUgZXF1YWwgd2l0aGluIGEgZ2l2ZW4gdG9sZXJhbmNlLlxyXG4gIEBwYXJhbSB0cmlhbmdsZUEgVGhlIGZpcnN0IHRyaWFuZ2xlIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIHRyaWFuZ2xlQiBUaGUgc2Vjb25kIHRyaWFuZ2xlIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIHRvbGVyYW5jZSBUaGUgbWF4aW11bSBhbGxvd2FibGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgdmVydGljZXMgb2YgdGhlIHR3byB0cmlhbmdsZXMuXHJcbiAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgdHdvIHRyaWFuZ2xlcyBhcmUgZXF1YWwgd2l0aGluIHRoZSBnaXZlbiB0b2xlcmFuY2UsIGZhbHNlIG90aGVyd2lzZS5cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJpYW5nbGVzRXF1YWwoXHJcbiAgdHJpYW5nbGVBOiBUcmlhbmdsZSxcclxuICB0cmlhbmdsZUI6IFRyaWFuZ2xlLFxyXG4gIHRvbGVyYW5jZTogbnVtYmVyID0gMVxyXG4pOiBib29sZWFuIHtcclxuICByZXR1cm4gdHJpYW5nbGVBLnBvaW50cy5ldmVyeSgocG9pbnRBKSA9PlxyXG4gICAgdHJpYW5nbGVCLnBvaW50cy5maW5kKChwb2ludEIpID0+IGFyZVBvaW50c0VxdWFsKHBvaW50QSwgcG9pbnRCLCB0b2xlcmFuY2UpKVxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlLCBhcmVQb2ludHNFcXVhbCwgRVBTSUxPTiB9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgdHJpYW5nbGUgZnJvbSB0aHJlZSBsaW5lcy5cclxuICogQHBhcmFtIGxpbmUxIC0gVGhlIGZpcnN0IGxpbmUgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gKiBAcGFyYW0gbGluZTIgLSBUaGUgc2Vjb25kIGxpbmUgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gKiBAcGFyYW0gbGluZTMgLSBUaGUgdGhpcmQgbGluZSBvZiB0aGUgdHJpYW5nbGUuXHJcbiAqIEByZXR1cm5zIFRoZSB0cmlhbmdsZSBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGxpbmVzLCBvciBudWxsIGlmIHRoZSBsaW5lcyBjYW5ub3QgZm9ybSBhIHZhbGlkIHRyaWFuZ2xlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyaWFuZ2xlRnJvbUxpbmVzKFxyXG4gIGxpbmUxOiBMaW5lLFxyXG4gIGxpbmUyOiBMaW5lLFxyXG4gIGxpbmUzOiBMaW5lXHJcbik6IFRyaWFuZ2xlIHwgbnVsbCB7XHJcbiAgbGV0IGhwb2ludHMgPSBbXHJcbiAgICBsaW5lMS5zdGFydCxcclxuICAgIGxpbmUxLmVuZCxcclxuICAgIGxpbmUyLnN0YXJ0LFxyXG4gICAgbGluZTIuZW5kLFxyXG4gICAgbGluZTMuc3RhcnQsXHJcbiAgICBsaW5lMy5lbmQsXHJcbiAgXTtcclxuICBocG9pbnRzID0gaHBvaW50cy5maWx0ZXIoXHJcbiAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHApID0+IGFyZVBvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICApO1xyXG4gIC8vIFRoZSB0cmlhbmdsZSBtdXN0IGNvbnNpc3Qgc3RyaWN0bHkgb2YgdGhyZWUgdW5pcXVlIHBvaW50c1xyXG4gIGlmIChocG9pbnRzLmxlbmd0aCAhPSAzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgLy8gQ2hlY2tpbmcgZm9yIHRoZSBwb3NzaWJpbGl0eSBvZiB0aGUgZXhpc3RlbmNlIG9mIGEgdHJpYW5nbGVcclxuICB2YXIgYSA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lMS5zdGFydCwgbGluZTEuZW5kKTtcclxuICB2YXIgYiA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lMi5zdGFydCwgbGluZTIuZW5kKTtcclxuICB2YXIgYyA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lMy5zdGFydCwgbGluZTMuZW5kKTtcclxuICBpZiAoYSA+IGIgKyBjIHx8IGIgPiBhICsgYyB8fCBjID4gYSArIGIpIHJldHVybiBudWxsO1xyXG4gIGNvbnN0IHAgPSAoYSArIGIgKyBjKSAvIDI7XHJcbiAgbGV0IFMgPSBNYXRoLnNxcnQocCAqIChwIC0gYSkgKiAocCAtIGIpICogKHAgLSBjKSk7XHJcbiAgaWYgKGlzTmFOKFMpIHx8IFMgPD0gMSkgcmV0dXJuIG51bGw7XHJcblxyXG4gIHJldHVybiBuZXcgVHJpYW5nbGUoaHBvaW50c1swXSwgaHBvaW50c1sxXSwgaHBvaW50c1syXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBwb2ludHM6IFBvaW50W10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCB0b1BvaW50IG9mIHBvaW50cykge1xyXG4gICAgbGV0IGRpc3RhY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHRvUG9pbnQpO1xyXG4gICAgaWYgKGRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBkaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHRvUG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBkaXN0U3RhcnQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuc3RhcnQpO1xyXG4gICAgbGV0IGRpc3RFbmQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuZW5kKTtcclxuXHJcbiAgICBpZiAoTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluUG9pbnQgPSBkaXN0U3RhcnQgPCBkaXN0RW5kID8gbGluZS5zdGFydCA6IGxpbmUuZW5kO1xyXG4gICAgICBtaW5EaXN0ID0gTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IHBkID0gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUocG9pbnQsIGxpbmUpO1xyXG4gICAgaWYgKHBkLmRpc3RhbmNlIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5EaXN0ID0gcGQuZGlzdGFuY2U7XHJcbiAgICAgIG1pblBvaW50ID0gcGQubmVhcmVzdFBvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYWxjdWxhdGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMuXHJcbiAqIEBwYXJhbSBwb2ludEEgLSBUaGUgZmlyc3QgcG9pbnRcclxuICogQHBhcmFtIHBvaW50QiAtIFRoZSBzZWNvbmQgcG9pbnRcclxuICogQHJldHVybnMgVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnRBOiBQb2ludCwgcG9pbnRCOiBQb2ludCk6IG51bWJlciB7XHJcbiAgcmV0dXJuIE1hdGguc3FydCgocG9pbnRBLnggLSBwb2ludEIueCkgKiogMiArIChwb2ludEEueSAtIHBvaW50Qi55KSAqKiAyKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBwb2ludCBhbmQgYSBsaW5lLCBhbmQgZmluZHMgdGhlIG5lYXJlc3QgcG9pbnQgb24gdGhlIGxpbmUgdG8gdGhlIGdpdmVuIHBvaW50LlxyXG4gKiBAcGFyYW0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gZmluZCB0aGUgZGlzdGFuY2UgdG8gdGhlIGxpbmUgZnJvbS5cclxuICogQHBhcmFtIGxpbmUgLSBUaGUgbGluZSB0byBmaW5kIHRoZSBkaXN0YW5jZSB0byB0aGUgcG9pbnQgZnJvbS5cclxuICogQHJldHVybnMgVGhlIG5lYXJlc3QgcG9pbnQgb24gdGhlIGxpbmUgdG8gdGhlIGdpdmVuIHBvaW50IGFuZCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgZ2l2ZW4gcG9pbnQgYW5kIHRoZSBsaW5lLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lOiBMaW5lXHJcbik6IHsgbmVhcmVzdFBvaW50OiBQb2ludDsgZGlzdGFuY2U6IG51bWJlciB9IHtcclxuICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IGxpbmU7XHJcbiAgY29uc3QgZHggPSBlbmQueCAtIHN0YXJ0Lng7XHJcbiAgY29uc3QgZHkgPSBlbmQueSAtIHN0YXJ0Lnk7XHJcblxyXG4gIC8vIElmIHRoZSBsaW5lIGlzIGp1c3QgYSBwb2ludCwgcmV0dXJuIGRpc3RhbmNlIHRvIHRoYXQgcG9pbnRcclxuICBpZiAoZHggPT09IDAgJiYgZHkgPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRpc3RhbmNlOiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHN0YXJ0KSxcclxuICAgICAgbmVhcmVzdFBvaW50OiBzdGFydCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIHBhcmFtZXRlciBvZiB0aGUgcHJvamVjdGlvbiBvZiB0aGUgcG9pbnQgb250byB0aGUgbGluZVxyXG4gIGNvbnN0IHQgPVxyXG4gICAgKChwb2ludC54IC0gc3RhcnQueCkgKiBkeCArIChwb2ludC55IC0gc3RhcnQueSkgKiBkeSkgLyAoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAvLyBJZiB0IGlzIG91dHNpZGUgdGhlIHJhbmdlIFswLCAxXSwgdGhlbiB0aGUgbmVhcmVzdCBwb2ludCBpcyBvbmUgb2YgdGhlIGxpbmUgZW5kcG9pbnRzXHJcbiAgaWYgKHQgPCAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkaXN0YW5jZTogZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBzdGFydCksXHJcbiAgICAgIG5lYXJlc3RQb2ludDogc3RhcnQsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAodCA+IDEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRpc3RhbmNlOiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGVuZCksXHJcbiAgICAgIG5lYXJlc3RQb2ludDogZW5kLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIENhbGN1bGF0ZSB0aGUgbmVhcmVzdCBwb2ludCBvbiB0aGUgbGluZSBhbmQgcmV0dXJuIGl0cyBkaXN0YW5jZSB0byB0aGUgcG9pbnRcclxuICBjb25zdCBuZWFyZXN0UG9pbnQgPSBuZXcgUG9pbnQoc3RhcnQueCArIHQgKiBkeCwgc3RhcnQueSArIHQgKiBkeSk7XHJcbiAgY29uc3QgZGlzdGFuY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIG5lYXJlc3RQb2ludCk7XHJcbiAgcmV0dXJuIHsgZGlzdGFuY2UsIG5lYXJlc3RQb2ludCB9O1xyXG59XHJcblxyXG4vKipcclxuICogIFJldHVybnMgYSBsaW5lIHdoaWNoIGNvbnRhaW5zIHRoZSBjb21tb24gcGFydHMgb2YgdHdvIGxpbmVzIGlmIHRoZXkgYXJlIHBhcnRzIG9mIG9uZSBsaW5lXHJcbiAqICBAcGFyYW0gbGluZTEgVGhlIGZpcnN0IGxpbmVcclxuICogIEBwYXJhbSBsaW5lMiBUaGUgc2Vjb25kIGxpbmVcclxuICogIEByZXR1cm5zIEEgbmV3IExpbmUgb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgY29tbW9uIHBhcnRzIG9mIHRoZSB0d28gaW5wdXQgbGluZXMsIG9yIG51bGwgaWYgdGhleSBhcmUgbm90IHBhcnRzIG9mIG9uZSBsaW5lXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZmluZENvbW1vbkxpbmUobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogTGluZSB8IG51bGwge1xyXG4gIGlmICghYXJlTGluZXNQYXJhbGxlbChsaW5lMSwgbGluZTIpKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLnN0YXJ0LCBsaW5lMi5zdGFydCkpXHJcbiAgICByZXR1cm4gbmV3IExpbmUobGluZTEuZW5kLCBsaW5lMi5lbmQpO1xyXG5cclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuZW5kLCBsaW5lMi5lbmQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLnN0YXJ0LCBsaW5lMi5zdGFydCk7XHJcblxyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5zdGFydCwgbGluZTIuZW5kKSlcclxuICAgIHJldHVybiBuZXcgTGluZShsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0KTtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLmVuZCwgbGluZTIuc3RhcnQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLnN0YXJ0LCBsaW5lMi5lbmQpO1xyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0d28gbGluZXMgYXJlIHBhcmFsbGVsLlxyXG4gKlxyXG4gKiBAcGFyYW0gbGluZTEgVGhlIGZpcnN0IGxpbmUuXHJcbiAqIEBwYXJhbSBsaW5lMiBUaGUgc2Vjb25kIGxpbmUuXHJcbiAqXHJcbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGxpbmVzIGFyZSBwYXJhbGxlbCwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZUxpbmVzUGFyYWxsZWwobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogYm9vbGVhbiB7XHJcbiAgaWYgKFxyXG4gICAgTWF0aC5hYnMobGluZTEuc3RhcnQueSAtIGxpbmUxLmVuZC55KSA8PSBFUFNJTE9OICYmXHJcbiAgICBNYXRoLmFicyhsaW5lMi5zdGFydC55IC0gbGluZTIuZW5kLnkpIDw9IEVQU0lMT05cclxuICApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKFxyXG4gICAgTWF0aC5hYnMobGluZTEuc3RhcnQueCAtIGxpbmUxLmVuZC54KSA8PSBFUFNJTE9OICYmXHJcbiAgICBNYXRoLmFicyhsaW5lMi5zdGFydC54IC0gbGluZTIuZW5kLngpIDw9IEVQU0lMT05cclxuICApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgbGV0IGsxID0gTWF0aC5hdGFuKFxyXG4gICAgKGxpbmUxLmVuZC55IC0gbGluZTEuc3RhcnQueSkgLyAobGluZTEuZW5kLnggLSBsaW5lMS5zdGFydC54KVxyXG4gICk7XHJcbiAgbGV0IGsyID0gTWF0aC5hdGFuKFxyXG4gICAgKGxpbmUyLmVuZC55IC0gbGluZTIuc3RhcnQueSkgLyAobGluZTIuZW5kLnggLSBsaW5lMi5zdGFydC54KVxyXG4gICk7XHJcbiAgcmV0dXJuIE1hdGguYWJzKGsxIC0gazIpIDw9IEVQU0lMT047XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50T25MaW5lKGxpbmU6IExpbmUsIHBvaW50OiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBNYXRoLmFicyhcclxuICAgICAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUuc3RhcnQsIHBvaW50KSArXHJcbiAgICAgICAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUuZW5kLCBwb2ludCkgLVxyXG4gICAgICAgIGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lLmVuZCwgbGluZS5zdGFydClcclxuICAgICkgPD0gRVBTSUxPTlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ludGVyc2VjdGlvbihsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBQb2ludCB8IG51bGwge1xyXG4gIGxldCBjaGVja2VkUG9pbnRzID0gW2xpbmUxLnN0YXJ0LCBsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0LCBsaW5lMi5lbmRdO1xyXG4gIGxldCBBOiBudW1iZXIsIEI6IG51bWJlciwgQzogbnVtYmVyO1xyXG4gIGxldCBwb2ludHh4OiBudW1iZXIsIHBvaW50eXk6IG51bWJlcjtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTIsIGxpbmUxLnN0YXJ0KSkgcmV0dXJuIGxpbmUxLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5lbmQpKSByZXR1cm4gbGluZTEuZW5kO1xyXG5cclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMSwgbGluZTIuc3RhcnQpKSByZXR1cm4gbGluZTIuc3RhcnQ7XHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLmVuZCkpIHJldHVybiBsaW5lMi5lbmQ7XHJcblxyXG4gIHJldHVybiBUZW1wQ2hlY2soKTtcclxuXHJcbiAgZnVuY3Rpb24gVkVLKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGJ4OiBudW1iZXIsIGJ5OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBheCAqIGJ5IC0gYnggKiBheTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIENyb3NzaW5nQ2hlY2socDE6IFBvaW50LCBwMjogUG9pbnQsIHAzOiBQb2ludCwgcDQ6IFBvaW50KSB7XHJcbiAgICBsZXQgdjEsIHYyLCB2MywgdjQ7XHJcblxyXG4gICAgdjEgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMS54IC0gcDMueCwgcDEueSAtIHAzLnkpO1xyXG4gICAgdjIgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMi54IC0gcDMueCwgcDIueSAtIHAzLnkpO1xyXG4gICAgdjMgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwMy54IC0gcDEueCwgcDMueSAtIHAxLnkpO1xyXG4gICAgdjQgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwNC54IC0gcDEueCwgcDQueSAtIHAxLnkpO1xyXG4gICAgaWYgKHYxICogdjIgPCAwICYmIHYzICogdjQgPCAwKSByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gRXF1YXRpb25PZlRoZUxpbmUocDE6IFBvaW50LCBwMjogUG9pbnQpIHtcclxuICAgIEEgPSBwMi55IC0gcDEueTtcclxuICAgIEIgPSBwMS54IC0gcDIueDtcclxuICAgIEMgPSAtcDEueCAqIChwMi55IC0gcDEueSkgKyBwMS55ICogKHAyLnggLSBwMS54KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblgoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeCwgcG9pbnR4O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHggPSAtYzEgKiBiMiArIGIxICogYzI7XHJcbiAgICBwb2ludHggPSBkeCAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gSW50ZXJzZWN0aW9uWShcclxuICAgIGExOiBudW1iZXIsXHJcbiAgICBiMTogbnVtYmVyLFxyXG4gICAgYzE6IG51bWJlcixcclxuICAgIGEyOiBudW1iZXIsXHJcbiAgICBiMjogbnVtYmVyLFxyXG4gICAgYzI6IG51bWJlclxyXG4gICkge1xyXG4gICAgbGV0IGQsIGR5LCBwb2ludHk7XHJcbiAgICBkID0gYTEgKiBiMiAtIGIxICogYTI7XHJcbiAgICBkeSA9IC1hMSAqIGMyICsgYzEgKiBhMjtcclxuICAgIHBvaW50eSA9IGR5IC8gZDtcclxuICAgIHJldHVybiBwb2ludHk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBUZW1wQ2hlY2soKTogUG9pbnQgfCBudWxsIHtcclxuICAgIGlmIChcclxuICAgICAgQ3Jvc3NpbmdDaGVjayhcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzBdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMV0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1syXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzNdXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICBsZXQgYTEsIGIxLCBjMSwgYTIsIGIyLCBjMjtcclxuICAgICAgRXF1YXRpb25PZlRoZUxpbmUoY2hlY2tlZFBvaW50c1swXSwgY2hlY2tlZFBvaW50c1sxXSk7XHJcbiAgICAgIGExID0gQTtcclxuICAgICAgYjEgPSBCO1xyXG4gICAgICBjMSA9IEM7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMl0sIGNoZWNrZWRQb2ludHNbM10pO1xyXG4gICAgICBhMiA9IEE7XHJcbiAgICAgIGIyID0gQjtcclxuICAgICAgYzIgPSBDO1xyXG4gICAgICBwb2ludHh4ID0gSW50ZXJzZWN0aW9uWChhMSwgYjEsIGMxLCBhMiwgYjIsIGMyKTtcclxuICAgICAgcG9pbnR5eSA9IEludGVyc2VjdGlvblkoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHJldHVybiBuZXcgUG9pbnQocG9pbnR4eCwgcG9pbnR5eSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQgeyBUcmlhbmdsZUNhbnZhcywgVHJpYW5nbGVDYW52YXNDb25maWcgfSBmcm9tIFwiLi90cmlhbmdsZWNhbnZhc1wiO1xyXG5pbXBvcnQge1xyXG4gIGNoZWNrSW50ZXJzZWN0aW9uLFxyXG4gIGRpc3RhbmNlQmV0d2VlblBvaW50cyxcclxuICBkaXN0YW5jZUZyb21Qb2ludFRvTGluZSxcclxuICBtZXJnZVBvaW50V2l0aExpbmUsXHJcbiAgbWVyZ2VQb2ludFdpdGhMaW5lUG9pbnRzLFxyXG4gIG1lcmdlUG9pbnRXaXRoUG9pbnQsXHJcbn0gZnJvbSBcIi4vY29yZW1hdGhcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnIGV4dGVuZHMgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBtZXJnZVJhZGl1czogbnVtYmVyID0gNTA7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgc3VwZXIoaW5pdCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGluaXQpO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgRHJhd0FjdGlvbiB7XHJcbiAgbGluZTogTGluZTtcclxuICBpcG9pbnRzOiBQb2ludFtdO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBJbnB1dFRyaWFuZ2xlQ2FudmFzIGV4dGVuZHMgVHJpYW5nbGVDYW52YXMge1xyXG4gIGxpbmVzOiBMaW5lW10gPSBbXTtcclxuICBpbnRlcnNlY3Rpb25Qb2ludHM6IFtQb2ludFtdXSA9IFtbXV07XHJcbiAgY2FuY2VsbGVkQWN0aW9uczogRHJhd0FjdGlvbltdID0gW107XHJcblxyXG4gIG1vdXNlUG9zOiBQb2ludCA9IG5ldyBQb2ludCgwLCAwKTtcclxuICBzZWxlY3RlZFBvaW50OiBQb2ludCB8IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25maWc6IElucHV0VHJpYW5nbGVDYW52YXNDb25maWcpIHtcclxuICAgIHN1cGVyKGNvbmZpZyBhcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyk7XHJcbiAgICB0aGlzLnJ1blVzZXJFdmVudHMoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbGVhckFsbCgpIHtcclxuICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgIHRoaXMubGluZXMgPSBbXTtcclxuICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzID0gW1tdXTtcclxuICAgIHRoaXMuY2FuY2VsbGVkQWN0aW9ucyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVuZG8oKSB7XHJcbiAgICBpZiAodGhpcy5saW5lcy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgdGhpcy5jYW5jZWxsZWRBY3Rpb25zLnB1c2goe1xyXG4gICAgICBsaW5lOiB0aGlzLmxpbmVzLnBvcCgpLFxyXG4gICAgICBpcG9pbnRzOlxyXG4gICAgICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLmxlbmd0aCA+IDAgPyB0aGlzLmludGVyc2VjdGlvblBvaW50cy5wb3AoKSA6IFtdLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZG8oKSB7XHJcbiAgICBpZiAodGhpcy5jYW5jZWxsZWRBY3Rpb25zLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICBsZXQgc2F2ZWRBY3Rpb24gPSB0aGlzLmNhbmNlbGxlZEFjdGlvbnMucG9wKCk7XHJcbiAgICB0aGlzLmxpbmVzLnB1c2goc2F2ZWRBY3Rpb24ubGluZSk7XHJcbiAgICBpZiAoc2F2ZWRBY3Rpb24uaXBvaW50cy5sZW5ndGggPiAwKVxyXG4gICAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cy5wdXNoKHNhdmVkQWN0aW9uLmlwb2ludHMpO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlTW91c2VQb3MoZTogUG9pbnRlckV2ZW50KSB7XHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy5jYW52YXNFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgdGhpcy5tb3VzZVBvcy54ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xyXG4gICAgdGhpcy5tb3VzZVBvcy55ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1lcmdlUG9pbnRXaXRoSW50ZXJzZWN0aW9uUG9pbnRzKHBvaW50OiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKFxyXG4gICAgICBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gICAgICAgIHBvaW50LFxyXG4gICAgICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLnJlZHVjZSgoYWNjdW0sIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGFjY3VtLnB1c2goLi4uaXRlbSk7XHJcbiAgICAgICAgICByZXR1cm4gYWNjdW07XHJcbiAgICAgICAgfSwgW10pLFxyXG4gICAgICAgIHRoaXMuY29uZmlnLm1lcmdlUmFkaXVzXHJcbiAgICAgIClcclxuICAgIClcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1lcmdlUG9pbnRXaXRoR3JpZChwb2ludDogUG9pbnQpOiBib29sZWFuIHtcclxuICAgIGxldCBzaXplID0gdGhpcy5jb25maWcuZ3JpZENlbGxTaXplO1xyXG4gICAgbGV0IGN4ID0gTWF0aC5mbG9vcihwb2ludC54IC8gc2l6ZSk7XHJcbiAgICBsZXQgY3kgPSBNYXRoLmZsb29yKHBvaW50LnkgLyBzaXplKTtcclxuICAgIGxldCBzdGFydFBvaW50ID0gbmV3IFBvaW50KGN4ICogc2l6ZSwgY3kgKiBzaXplKTtcclxuICAgIGxldCBncmlkUG9pbnRzID0gW1xyXG4gICAgICBzdGFydFBvaW50LFxyXG4gICAgICBuZXcgUG9pbnQoc3RhcnRQb2ludC54ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplLCBzdGFydFBvaW50LnkpLFxyXG4gICAgICBuZXcgUG9pbnQoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnkgKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUpLFxyXG4gICAgICBuZXcgUG9pbnQoXHJcbiAgICAgICAgc3RhcnRQb2ludC54ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplLFxyXG4gICAgICAgIHN0YXJ0UG9pbnQueSArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZVxyXG4gICAgICApLFxyXG4gICAgXTtcclxuICAgIGlmIChtZXJnZVBvaW50V2l0aFBvaW50KHBvaW50LCBncmlkUG9pbnRzLCB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUpKVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkSW50ZXJzZWN0aW9uUG9pbnQobGluZTogTGluZSkge1xyXG4gICAgbGV0IHBvaW50czogUG9pbnRbXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgd2l0aExpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICBsZXQgcG9pbnQgPSBjaGVja0ludGVyc2VjdGlvbihsaW5lLCB3aXRoTGluZSk7XHJcbiAgICAgIGlmIChwb2ludCAhPSBudWxsKSBwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICB9XHJcbiAgICBpZiAocG9pbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMucHVzaChwb2ludHMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0UG9pbnRQb3MocG9pbnQ6IFBvaW50KSB7XHJcbiAgICBsZXQgcmVzID0gZmFsc2U7XHJcbiAgICBpZiAoIXJlcykge1xyXG4gICAgICByZXMgPSB0aGlzLm1lcmdlUG9pbnRXaXRoSW50ZXJzZWN0aW9uUG9pbnRzKHBvaW50KTtcclxuICAgIH1cclxuICAgIGlmICghcmVzKSB7XHJcbiAgICAgIHJlcyA9IG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICAgICAgICBwb2ludCxcclxuICAgICAgICB0aGlzLmxpbmVzLFxyXG4gICAgICAgIHRoaXMuY29uZmlnLm1lcmdlUmFkaXVzICogMlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKCFyZXMpIHtcclxuICAgICAgcmVzID0gbWVyZ2VQb2ludFdpdGhMaW5lKHBvaW50LCB0aGlzLmxpbmVzLCB0aGlzLmNvbmZpZy5tZXJnZVJhZGl1cyAqIDIpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFyZXMgJiYgdGhpcy5jb25maWcudXNlR3JpZCkge1xyXG4gICAgICByZXMgPSB0aGlzLm1lcmdlUG9pbnRXaXRoR3JpZChwb2ludCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvcnJlY3RNb3VzZVBvaW50KCkge1xyXG4gICAgdGhpcy5jb3JyZWN0UG9pbnRQb3ModGhpcy5tb3VzZVBvcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvcnJlY3RTZWxlY3RlZFBvaW50KCkge1xyXG4gICAgbGV0IHBvaW50ID0gbmV3IFBvaW50KHRoaXMubW91c2VQb3MueCwgdGhpcy5tb3VzZVBvcy55KTtcclxuICAgIHRoaXMuY29ycmVjdFBvaW50UG9zKHBvaW50KTtcclxuICAgIHRoaXMuc2VsZWN0ZWRQb2ludCA9IHBvaW50LmNsb25lKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZHJhdygpIHtcclxuICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgIGZvciAobGV0IGxpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKGxpbmUuc3RhcnQsIGxpbmUuZW5kKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGxpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdQb2ludChsaW5lLnN0YXJ0KTtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQobGluZS5lbmQpO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaXBvaW50cyBvZiB0aGlzLmludGVyc2VjdGlvblBvaW50cykge1xyXG4gICAgICBmb3IgKGxldCBwb2ludCBvZiBpcG9pbnRzKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnQocG9pbnQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJ1blVzZXJFdmVudHMoKSB7XHJcbiAgICBsZXQgY2FudmFzID0gdGhpcy5jYW52YXNFbGVtZW50O1xyXG5cclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgdGhpcy5wb2ludGVyZG93bkV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgdGhpcy5wb2ludGVydXBFdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmNhbmNlbFwiLCAoKSA9PiB7fSwgZmFsc2UpO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCB0aGlzLnBvaW50ZXJtb3ZlRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBvaW50ZXJtb3ZlRXZlbnRIYW5kbGVyID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xyXG4gICAgdGhpcy51cGRhdGVNb3VzZVBvcyhlKTtcclxuICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgIHRoaXMucmVkcmF3KCk7XHJcblxyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRQb2ludCAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuZHJhd0xpbmUodGhpcy5zZWxlY3RlZFBvaW50LCB0aGlzLm1vdXNlUG9zKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIHBvaW50ZXJkb3duRXZlbnRIYW5kbGVyID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xyXG4gICAgdGhpcy51cGRhdGVNb3VzZVBvcyhlKTtcclxuICAgIHRoaXMuY29ycmVjdFNlbGVjdGVkUG9pbnQoKTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHBvaW50ZXJ1cEV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUG9pbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdE1vdXNlUG9pbnQoKTtcclxuICAgIGxldCBsaW5lID0gbmV3IExpbmUodGhpcy5zZWxlY3RlZFBvaW50LmNsb25lKCksIHRoaXMubW91c2VQb3MuY2xvbmUoKSk7XHJcbiAgICB0aGlzLmFkZEludGVyc2VjdGlvblBvaW50KGxpbmUpO1xyXG4gICAgdGhpcy5saW5lcy5wdXNoKGxpbmUpO1xyXG4gICAgdGhpcy5zZWxlY3RlZFBvaW50ID0gbnVsbDtcclxuICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcbmltcG9ydCB7XHJcbiAgQ29sb3JHZW5lcmF0b3IsXHJcbiAgVHJpYW5nbGVDYW52YXMsXHJcbiAgVHJpYW5nbGVDYW52YXNDb25maWcsXHJcbn0gZnJvbSBcIi4vdHJpYW5nbGVjYW52YXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyBleHRlbmRzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIHtcclxuICBwdWJsaWMgY29uc3RydWN0b3IoaW5pdD86IFBhcnRpYWw8T3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWc+KSB7XHJcbiAgICBzdXBlcihpbml0KTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgaW5pdCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgT3V0cHV0VHJpYW5nbGVDYW52YXMgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhcyB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcpIHtcclxuICAgIHN1cGVyKGNvbmZpZyBhcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0xpbmVzKFxyXG4gICAgbGluZXM6IExpbmVbXSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgIHRoaXMuZHJhd0xpbmUobGluZS5zdGFydCwgbGluZS5lbmQsIGNvbG9yLCBsaW5lV2lkdGgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdQb2ludHMoXHJcbiAgICBwb2ludHM6IFBvaW50W10sXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBwb2ludFNpemU6IG51bWJlciA9IHRoaXMuY29uZmlnLnBvaW50U2l6ZVxyXG4gICkge1xyXG4gICAgZm9yIChsZXQgcG9pbnQgb2YgcG9pbnRzKSB7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KHBvaW50LCBjb2xvciwgcG9pbnRTaXplKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3VHJpYW5nbGVzKFxyXG4gICAgdHJpYW5nbGVzOiBUcmlhbmdsZVtdLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIGZvciAobGV0IHRyaWFuZ2xlIG9mIHRyaWFuZ2xlcykge1xyXG4gICAgICB0aGlzLmRyYXdUcmlhbmdsZSh0cmlhbmdsZSwgY29sb3IsIGxpbmVXaWR0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSB9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvckdlbmVyYXRvciB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIGdlbmVyYXRlOiAoKSA9PiBzdHJpbmcpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyB7XHJcbiAgcHVibGljIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9XHJcbiAgICBcIiMwMDAwMDBcIjtcclxuICBwdWJsaWMgbGluZVdpZHRoOiBudW1iZXIgPSAzO1xyXG4gIHB1YmxpYyBwb2ludFNpemU6IG51bWJlciA9IDU7XHJcbiAgcHVibGljIGNhbnZhc0lkOiBzdHJpbmcgPSBcImNhbnZhc1wiO1xyXG5cclxuICBwdWJsaWMgdXNlR3JpZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBncmlkQ29sb3I6IHN0cmluZyA9IFwiIzUwNTA1MFwiO1xyXG4gIHB1YmxpYyBncmlkTGluZVdpZHRoOiBudW1iZXIgPSAxO1xyXG4gIHB1YmxpYyBncmlkQ2VsbFNpemU6IG51bWJlciA9IDQwO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoaW5pdD86IFBhcnRpYWw8VHJpYW5nbGVDYW52YXNDb25maWc+KSB7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGluaXQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlQ2FudmFzIHtcclxuICBjYW52YXNFbGVtZW50OiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcbiAgb25SZXNpemUgPSAoZTogVUlFdmVudCkgPT4ge1xyXG4gICAgbGV0IHRlbXAgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoXHJcbiAgICAgIDAsXHJcbiAgICAgIDAsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodFxyXG4gICAgKTtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCA9IHRoaXMuY2FudmFzRWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQgPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgdGhpcy5jdHgucHV0SW1hZ2VEYXRhKHRlbXAsIDAsIDApO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25maWc6IFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgY29uZmlnLmNhbnZhc0lkXHJcbiAgICApIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodCA9IHRoaXMuY2FudmFzRWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLm9uUmVzaXplLCBmYWxzZSk7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzRWxlbWVudC5nZXRDb250ZXh0KFwiMmRcIiwge1xyXG4gICAgICB3aWxsUmVhZEZyZXF1ZW50bHk6IHRydWUsXHJcbiAgICB9KSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICB0aGlzLmN0eC5saW5lQ2FwID0gXCJyb3VuZFwiO1xyXG5cclxuICAgIGlmICh0aGlzLmNvbmZpZy51c2VHcmlkKSB7XHJcbiAgICAgIHRoaXMuZHJhd0dyaWQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3R3JpZChcclxuICAgIGNvbG9yOiBzdHJpbmcgPSB0aGlzLmNvbmZpZy5ncmlkQ29sb3IsXHJcbiAgICBzaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemVcclxuICApIHtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDE7XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPD0gdGhpcy5jYW52YXNFbGVtZW50LndpZHRoOyB4ICs9IHNpemUpIHtcclxuICAgICAgdGhpcy5jdHgubW92ZVRvKHggKyAwLjUsIDApO1xyXG4gICAgICB0aGlzLmN0eC5saW5lVG8oeCArIDAuNSwgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPD0gdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodDsgeSArPSBzaXplKSB7XHJcbiAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB5ICsgMC41KTtcclxuICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCwgeSArIDAuNSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0xpbmUoXHJcbiAgICBmcm9tOiBQb2ludCxcclxuICAgIHRvOiBQb2ludCxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICBpZiAoIWZyb20gfHwgIXRvKSByZXR1cm47XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yR2VuZXJhdG9yKVxyXG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICB0aGlzLmN0eC5tb3ZlVG8oZnJvbS54LCBmcm9tLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRvLngsIHRvLnkpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1BvaW50KFxyXG4gICAgcG9pbnQ6IFBvaW50LFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgcG9pbnRTaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5wb2ludFNpemVcclxuICApIHtcclxuICAgIGlmICghcG9pbnQpIHJldHVybjtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JHZW5lcmF0b3IpIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgbGV0IHNpemUgPSBwb2ludFNpemU7XHJcbiAgICB0aGlzLmN0eC5maWxsUmVjdChwb2ludC54IC0gc2l6ZSAvIDIsIHBvaW50LnkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3VHJpYW5nbGUoXHJcbiAgICB0cmlhbmdsZTogVHJpYW5nbGUsXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgaWYgKCF0cmlhbmdsZSkgcmV0dXJuO1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvckdlbmVyYXRvcikgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3IuZ2VuZXJhdGUoKTtcclxuICAgIGVsc2UgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcclxuICAgIHRoaXMuY3R4Lm1vdmVUbyh0cmlhbmdsZS5wMS54LCB0cmlhbmdsZS5wMS55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0cmlhbmdsZS5wMi54LCB0cmlhbmdsZS5wMi55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0cmlhbmdsZS5wMy54LCB0cmlhbmdsZS5wMy55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0cmlhbmdsZS5wMS54LCB0cmlhbmdsZS5wMS55KTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsZWFyQ2FudmFzKCkge1xyXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHRcclxuICAgICk7XHJcbiAgICBpZiAodGhpcy5jb25maWcudXNlR3JpZCkge1xyXG4gICAgICB0aGlzLmRyYXdHcmlkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYXN5bmMgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnUgPSAoY2h1bmtJZCkgPT4ge1xuXHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcblx0cmV0dXJuIFwiXCIgKyBjaHVua0lkICsgXCIuYXBwLWJ1bmRsZS5qc1wiO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiaW1wb3J0IHtcclxuICBJbnB1dFRyaWFuZ2xlQ2FudmFzLFxyXG4gIElucHV0VHJpYW5nbGVDYW52YXNDb25maWcsXHJcbn0gZnJvbSBcIi4vaW5wdXR0cmlhbmdsZWNhbnZhc1wiO1xyXG5pbXBvcnQge1xyXG4gIE91dHB1dFRyaWFuZ2xlQ2FudmFzLFxyXG4gIE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL291dHB1dHRyaWFuZ2xlY2FudmFzXCI7XHJcblxyXG5sZXQgY2FsY3VsYXRvcjogYW55O1xyXG5jb25zdCBjYWxjdWxhdG9yTG9hZGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gIFwibG9hZGluZ1wiXHJcbikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xyXG5jb25zdCBjYWxjdWxhdGV3b3JrZXIgPSBuZXcgV29ya2VyKFxyXG4gIG5ldyBVUkwoXCIuL3dvcmtlcnMvY2FsYy53b3JrZXIudHNcIiwgaW1wb3J0Lm1ldGEudXJsKVxyXG4pO1xyXG5jYWxjdWxhdGV3b3JrZXIub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICBjYWxjdWxhdG9yID0gbWVzc2FnZS5kYXRhO1xyXG4gIGNvbnNvbGUubG9nKGNhbGN1bGF0b3IpO1xyXG4gIGlmICh0cmlhbmdsZXNDb3VudGVyKSB7XHJcbiAgICB0cmlhbmdsZXNDb3VudGVyLnRleHRDb250ZW50ID0gY2FsY3VsYXRvci50cmlhbmdsZXMubGVuZ3RoO1xyXG4gIH1cclxuICBkcmF3T3V0cHV0Q2FudmFzKCk7XHJcbiAgZHJhd1RyaWFuZ2xlc1NlbGVjdG9yKCk7XHJcbiAgb3V0cHV0Q2FudmFzLmNhbnZhc0VsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgYmVoYXZpb3I6IFwic21vb3RoXCIsXHJcbiAgICBibG9jazogXCJlbmRcIixcclxuICB9KTtcclxuICBjYWxjdWxhdG9yTG9hZGluZy5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxufTtcclxuXHJcbmNvbnN0IGNhbnZhcyA9IG5ldyBJbnB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKHtcclxuICAgIGNvbG9yOiBcIndoaXRlXCIsXHJcbiAgICBsaW5lV2lkdGg6IDIsXHJcbiAgICBwb2ludFNpemU6IDgsXHJcbiAgICBjYW52YXNJZDogXCJjYW52YXNcIixcclxuICAgIG1lcmdlUmFkaXVzOiAyNSxcclxuICAgIHVzZUdyaWQ6IHRydWUsXHJcbiAgICBncmlkQ2VsbFNpemU6IDQwLFxyXG4gICAgZ3JpZExpbmVXaWR0aDogMjAsXHJcbiAgfSlcclxuKTtcclxuXHJcbmxldCBzaG93VHJpYW5nbGVJbmRleCA9IDA7XHJcbmNvbnN0IHRyaWFuZ2xlc1NlbGVjdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgXCJ0cmlhbmdsZXMtc2VsZWN0b3JcIlxyXG4pIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcclxuY29uc3QgdHJpYW5nbGVzQ291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gIFwidHJpYW5nbGVzLWNvdW50XCJcclxuKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XHJcbmNvbnN0IG91dHB1dENhbnZhcyA9IG5ldyBPdXRwdXRUcmlhbmdsZUNhbnZhcyhcclxuICBuZXcgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcoe1xyXG4gICAgY29sb3I6IFwiYmxhY2tcIixcclxuICAgIGxpbmVXaWR0aDogMixcclxuICAgIHBvaW50U2l6ZTogNCxcclxuICAgIGNhbnZhc0lkOiBcInRyaWFuZ2xlc1wiLFxyXG4gIH0pXHJcbik7XHJcblxyXG5mdW5jdGlvbiBkcmF3T3V0cHV0Q2FudmFzKCkge1xyXG4gIG91dHB1dENhbnZhcy5jbGVhckNhbnZhcygpO1xyXG4gIGlmKCFjYWxjdWxhdG9yKVxyXG4gICAgcmV0dXJuO1xyXG4gIG91dHB1dENhbnZhcy5kcmF3TGluZXMoY2FsY3VsYXRvci5saW5lcywgXCJncmV5XCIsIDEpO1xyXG4gIG91dHB1dENhbnZhcy5kcmF3UG9pbnRzKGNhbGN1bGF0b3IucG9pbnRzLCBcImdyYXlcIiwgNSk7XHJcbiAgb3V0cHV0Q2FudmFzLmRyYXdUcmlhbmdsZShjYWxjdWxhdG9yLnRyaWFuZ2xlc1tzaG93VHJpYW5nbGVJbmRleF0sIFwiI0VCNjE4RlwiLCA0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1RyaWFuZ2xlc1NlbGVjdG9yKCkge1xyXG4gIGlmICh0cmlhbmdsZXNTZWxlY3RvciAmJiBjYWxjdWxhdG9yICYmIGNhbGN1bGF0b3IudHJpYW5nbGVzLmxlbmd0aCA+IDApIHtcclxuICAgIHRyaWFuZ2xlc1NlbGVjdG9yLnRleHRDb250ZW50ID0gYCR7c2hvd1RyaWFuZ2xlSW5kZXggKyAxfSAvICR7XHJcbiAgICAgIGNhbGN1bGF0b3IudHJpYW5nbGVzLmxlbmd0aFxyXG4gICAgfWA7XHJcbiAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHNob3dUcmlhbmdsZUluZGV4ID0gMDtcclxuICBjYWxjdWxhdG9yID0gbnVsbDtcclxuICBjYW52YXMuY2xlYXJBbGwoKTtcclxuICBvdXRwdXRDYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICBpZiAodHJpYW5nbGVzU2VsZWN0b3IpIHtcclxuICAgIHRyaWFuZ2xlc1NlbGVjdG9yLnRleHRDb250ZW50ID0gXCIwIC8gMFwiO1xyXG4gIH1cclxuICBpZiAodHJpYW5nbGVzQ291bnRlcikge1xyXG4gICAgdHJpYW5nbGVzQ291bnRlci50ZXh0Q29udGVudCA9IFwiMFwiO1xyXG4gIH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1wcmV2XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmIChjYWxjdWxhdG9yICYmIHNob3dUcmlhbmdsZUluZGV4ID4gMCkgc2hvd1RyaWFuZ2xlSW5kZXgtLTtcclxuICBkcmF3T3V0cHV0Q2FudmFzKCk7XHJcbiAgZHJhd1RyaWFuZ2xlc1NlbGVjdG9yKCk7XHJcbn0pO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1uZXh0XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmIChjYWxjdWxhdG9yICYmIHNob3dUcmlhbmdsZUluZGV4IDwgY2FsY3VsYXRvci50cmlhbmdsZXMubGVuZ3RoIC0gMSkgc2hvd1RyaWFuZ2xlSW5kZXgrKztcclxuICBkcmF3T3V0cHV0Q2FudmFzKCk7XHJcbiAgZHJhd1RyaWFuZ2xlc1NlbGVjdG9yKCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYWxjXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGNhbGN1bGF0b3JMb2FkaW5nLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcclxuICBjYWxjdWxhdGV3b3JrZXIucG9zdE1lc3NhZ2UoY2FudmFzLmxpbmVzKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZG9cIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FudmFzLnJlZG8oKTtcclxufSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5kb1wiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjYW52YXMudW5kbygpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9