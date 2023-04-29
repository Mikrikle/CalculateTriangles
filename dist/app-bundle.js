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
/* harmony export */   "createTriangleFromLines": () => (/* binding */ createTriangleFromLines),
/* harmony export */   "distanceBetweenPoints": () => (/* binding */ distanceBetweenPoints),
/* harmony export */   "distanceFromPointToLine": () => (/* binding */ distanceFromPointToLine),
/* harmony export */   "findCommonLine": () => (/* binding */ findCommonLine),
/* harmony export */   "findCommonPoint": () => (/* binding */ findCommonPoint),
/* harmony export */   "findIntersectionPoint": () => (/* binding */ findIntersectionPoint),
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
 *  Returns a line which contains the common parts of two lines if they are parts of one line.
 *  @param line1 The first line.
 *  @param line2 The second line.
 *  @returns A new Line object that represents the common parts of the two input lines, or null if they are not parts of one line.
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
function findCommonPoint(line1, line2) {
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.start, line2.start))
        return line1.start;
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.end, line2.end))
        return line1.end;
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.start, line2.end))
        return line1.start;
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.end, line2.start))
        return line1.end;
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
    if (Math.abs(line1.start.y - line1.end.y) <= Number.EPSILON &&
        Math.abs(line2.start.y - line2.end.y) <= Number.EPSILON) {
        return true;
    }
    if (Math.abs(line1.start.x - line1.end.x) <= Number.EPSILON &&
        Math.abs(line2.start.x - line2.end.x) <= Number.EPSILON) {
        return true;
    }
    let k1 = Math.atan((line1.end.y - line1.start.y) / (line1.end.x - line1.start.x));
    let k2 = Math.atan((line2.end.y - line2.start.y) / (line2.end.x - line2.start.x));
    return Math.abs(k1 - k2) <= Number.EPSILON;
}
/**
 * Determines whether a point is located on a given line segment.
 * @param line - The line segment to test.
 * @param point - The point to check.
 * @returns True if the point is on the line segment, false otherwise.
 */
function isPointOnLine(line, point) {
    return (Math.abs(distanceBetweenPoints(line.start, point) +
        distanceBetweenPoints(line.end, point) -
        distanceBetweenPoints(line.end, line.start)) <= _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON);
}
/**
 * Returns the point of intersection or connection between two line segments.
 * @param line1 - The first line segment.
 * @param line2 - The second line segment.
 * @returns The point of intersection or connection between the two line segments, or null.
 */
function findIntersectionPoint(line1, line2) {
    // Check if the two line segments are parallel
    if (areLinesParallel(line1, line2)) {
        // If they are parallel, check if they lie on the same line
        return findCommonPoint(line1, line2);
    }
    // Calculate the slopes of the lines
    const slope1 = (line1.end.y - line1.start.y) / (line1.end.x - line1.start.x);
    const slope2 = (line2.end.y - line2.start.y) / (line2.end.x - line2.start.x);
    // Calculate the y-intercepts of the lines
    const yIntercept1 = line1.start.y - slope1 * line1.start.x;
    const yIntercept2 = line2.start.y - slope2 * line2.start.x;
    // Calculate the x-coordinate of the intersection point
    let x = (yIntercept2 - yIntercept1) / (slope1 - slope2);
    // Calculate the y-coordinate of the intersection point
    let y = slope1 * x + yIntercept1;
    // Check if either slope is vertical (i.e. infinite)
    if (!isFinite(slope1)) {
        x = line1.start.x;
        y = slope2 * line1.start.x + yIntercept2;
    }
    if (!isFinite(slope2)) {
        x = line2.start.x;
        y = slope1 * line2.start.x + yIntercept1;
    }
    const point = new _core__WEBPACK_IMPORTED_MODULE_0__.Point(x, y);
    if (!isPointOnLine(line1, point) || !isPointOnLine(line2, point)) {
        return null;
    }
    // Return the intersection point
    return new _core__WEBPACK_IMPORTED_MODULE_0__.Point(x, y);
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
            let point = (0,_coremath__WEBPACK_IMPORTED_MODULE_2__.findIntersectionPoint)(line, withLine);
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
/******/ 				scriptUrl = document.currentScript.src;
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
    mergeRadius: 20,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLElBQUksT0FBTyxHQUFXLEdBQUcsQ0FBQztBQUVqQzs7R0FFRztBQUNJLE1BQU0sS0FBSztJQUNoQixZQUFtQixDQUFTLEVBQVMsQ0FBUztRQUEzQixNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBUTtJQUFHLENBQUM7SUFFbEQ7OztNQUdFO0lBQ0ssS0FBSztRQUNWLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFDSSxNQUFNLElBQUk7SUFDZixZQUFtQixLQUFZLEVBQVMsR0FBVTtRQUEvQixVQUFLLEdBQUwsS0FBSyxDQUFPO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBTztJQUFHLENBQUM7Q0FDdkQ7QUFFRDs7R0FFRztBQUNJLE1BQU0sUUFBUTtJQUVuQixZQUFtQixFQUFTLEVBQVMsRUFBUyxFQUFTLEVBQVM7UUFBN0MsT0FBRSxHQUFGLEVBQUUsQ0FBTztRQUFTLE9BQUUsR0FBRixFQUFFLENBQU87UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFPO1FBQzlELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDRjtBQUVEOzs7Ozs7RUFNRTtBQUNLLFNBQVMsY0FBYyxDQUM1QixNQUFhLEVBQ2IsTUFBYSxFQUNiLFlBQW9CLENBQUM7SUFFckIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQztBQUNsRyxDQUFDO0FBRUQ7Ozs7OztFQU1FO0FBQ0ssU0FBUyxhQUFhLENBQzNCLEtBQVcsRUFDWCxLQUFXLEVBQ1gsWUFBb0IsQ0FBQztJQUVyQixPQUFPLENBQ0wsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQztRQUNsRCxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7WUFDaEQsY0FBYyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUNyRCxDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7RUFNRTtBQUNLLFNBQVMsZ0JBQWdCLENBQzlCLFNBQW1CLEVBQ25CLFNBQW1CLEVBQ25CLFlBQW9CLENBQUM7SUFFckIsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ3ZDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUM3RSxDQUFDO0FBQ0osQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwRnVFO0FBRXhFOzs7Ozs7R0FNRztBQUNJLFNBQVMsdUJBQXVCLENBQ3JDLEtBQVcsRUFDWCxLQUFXLEVBQ1gsS0FBVztJQUVYLElBQUksT0FBTyxHQUFHO1FBQ1osS0FBSyxDQUFDLEtBQUs7UUFDWCxLQUFLLENBQUMsR0FBRztRQUNULEtBQUssQ0FBQyxLQUFLO1FBQ1gsS0FBSyxDQUFDLEdBQUc7UUFDVCxLQUFLLENBQUMsS0FBSztRQUNYLEtBQUssQ0FBQyxHQUFHO0tBQ1YsQ0FBQztJQUNGLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUN0QixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDckIsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLHFEQUFjLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQzVELENBQUM7SUFDRiw0REFBNEQ7SUFDNUQsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUVyQyw4REFBOEQ7SUFDOUQsSUFBSSxDQUFDLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEQsSUFBSSxDQUFDLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEQsSUFBSSxDQUFDLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUNyRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUVwQyxP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QyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUN2RDtRQUNBLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxJQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTztRQUN2RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sRUFDdkQ7UUFDQSxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FDaEIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FDOUQsQ0FBQztJQUNGLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQ2hCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQzlELENBQUM7SUFDRixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDN0MsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0ksU0FBUyxhQUFhLENBQUMsSUFBVSxFQUFFLEtBQVk7SUFDcEQsT0FBTyxDQUNMLElBQUks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USxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQzlELGlCQUFpQixDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQy9DLGVBQWUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQzlELE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQixDQUFDLENBQUMsQ0FBQztBQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUM5RCxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY29yZW1hdGgudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2lucHV0dHJpYW5nbGVjYW52YXMudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL291dHB1dHRyaWFuZ2xlY2FudmFzLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy90cmlhbmdsZWNhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdmFyIEVQU0lMT046IG51bWJlciA9IDAuMTtcclxuXHJcbi8qKlxyXG4gKiBSZXByZXNlbnRzIGEgcG9pbnQgaW4gMkQgY29vcmRpbmF0ZSBzeXN0ZW0uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUG9pbnQge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB4OiBudW1iZXIsIHB1YmxpYyB5OiBudW1iZXIpIHt9XHJcblxyXG4gIC8qKlxyXG4gICogQ3JlYXRlcyBhIG5ldyBgUG9pbnRgIG9iamVjdCB3aXRoIHRoZSBzYW1lIHggYW5kIHkgY29vcmRpbmF0ZXMgYXMgdGhpcyBvbmUuXHJcbiAgKiBAcmV0dXJucyBBIG5ldyBgUG9pbnRgIG9iamVjdCB3aXRoIHRoZSBzYW1lIHggYW5kIHkgY29vcmRpbmF0ZXMgYXMgdGhpcyBvbmUuXHJcbiAgKi9cclxuICBwdWJsaWMgY2xvbmUoKTogUG9pbnQge1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIGxpbmUgYnkgdHdvIHBvaW50cy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBMaW5lIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhcnQ6IFBvaW50LCBwdWJsaWMgZW5kOiBQb2ludCkge31cclxufVxyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgYSB0cmlhbmdsZSBieSB0aHJlZSBwb2ludHMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGUge1xyXG4gIHB1YmxpYyBwb2ludHM6IFBvaW50W107XHJcbiAgY29uc3RydWN0b3IocHVibGljIHAxOiBQb2ludCwgcHVibGljIHAyOiBQb2ludCwgcHVibGljIHAzOiBQb2ludCkge1xyXG4gICAgdGhpcy5wb2ludHMgPSBbcDEsIHAyLCBwM107XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIHBvaW50cyBhcmUgZXF1YWwgd2l0aGluIGEgZ2l2ZW4gdG9sZXJhbmNlLlxyXG4gIEBwYXJhbSBwb2ludEEgVGhlIGZpcnN0IHBvaW50IHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIHBvaW50QiBUaGUgc2Vjb25kIHBvaW50IHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIHRvbGVyYW5jZSBUaGUgbWF4aW11bSBhbGxvd2FibGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgdHdvIHBvaW50cy5cclxuICBAcmV0dXJucyBUcnVlIGlmIHRoZSB0d28gcG9pbnRzIGFyZSBlcXVhbCB3aXRoaW4gdGhlIGdpdmVuIHRvbGVyYW5jZSwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4qL1xyXG5leHBvcnQgZnVuY3Rpb24gYXJlUG9pbnRzRXF1YWwoXHJcbiAgcG9pbnRBOiBQb2ludCxcclxuICBwb2ludEI6IFBvaW50LFxyXG4gIHRvbGVyYW5jZTogbnVtYmVyID0gMVxyXG4pOiBib29sZWFuIHtcclxuICByZXR1cm4gTWF0aC5hYnMocG9pbnRBLnggLSBwb2ludEIueCkgPD0gdG9sZXJhbmNlICYmIE1hdGguYWJzKHBvaW50QS55IC0gcG9pbnRCLnkpIDw9IHRvbGVyYW5jZTtcclxufVxyXG5cclxuLyoqXHJcbiAgRGV0ZXJtaW5lcyB3aGV0aGVyIHR3byBsaW5lcyBhcmUgZXF1YWwgd2l0aGluIGEgZ2l2ZW4gdG9sZXJhbmNlLlxyXG4gIEBwYXJhbSBsaW5lQSBUaGUgZmlyc3QgbGluZSB0byBjb21wYXJlLlxyXG4gIEBwYXJhbSBsaW5lQiBUaGUgc2Vjb25kIGtpbmUgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gdG9sZXJhbmNlIFRoZSBtYXhpbXVtIGFsbG93YWJsZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBlbmRwb2ludHMgb2YgdGhlIHR3byBsaW5lcy5cclxuICBAcmV0dXJucyBUcnVlIGlmIHRoZSB0d28gbGluZXMgYXJlIGVxdWFsIHdpdGhpbiB0aGUgZ2l2ZW4gdG9sZXJhbmNlLCBmYWxzZSBvdGhlcndpc2UuXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcmVMaW5lc0VxdWFsKFxyXG4gIGxpbmVBOiBMaW5lLFxyXG4gIGxpbmVCOiBMaW5lLFxyXG4gIHRvbGVyYW5jZTogbnVtYmVyID0gMVxyXG4pOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgKGFyZVBvaW50c0VxdWFsKGxpbmVBLnN0YXJ0LCBsaW5lQi5zdGFydCwgdG9sZXJhbmNlKSAmJlxyXG4gICAgICBhcmVQb2ludHNFcXVhbChsaW5lQS5lbmQsIGxpbmVCLmVuZCwgdG9sZXJhbmNlKSkgfHxcclxuICAgIChhcmVQb2ludHNFcXVhbChsaW5lQS5lbmQsIGxpbmVCLnN0YXJ0LCB0b2xlcmFuY2UpICYmXHJcbiAgICAgIGFyZVBvaW50c0VxdWFsKGxpbmVBLnN0YXJ0LCBsaW5lQi5lbmQsIHRvbGVyYW5jZSkpXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAgRGV0ZXJtaW5lcyB3aGV0aGVyIHR3byB0cmlhbmdsZXMgYXJlIGVxdWFsIHdpdGhpbiBhIGdpdmVuIHRvbGVyYW5jZS5cclxuICBAcGFyYW0gdHJpYW5nbGVBIFRoZSBmaXJzdCB0cmlhbmdsZSB0byBjb21wYXJlLlxyXG4gIEBwYXJhbSB0cmlhbmdsZUIgVGhlIHNlY29uZCB0cmlhbmdsZSB0byBjb21wYXJlLlxyXG4gIEBwYXJhbSB0b2xlcmFuY2UgVGhlIG1heGltdW0gYWxsb3dhYmxlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHZlcnRpY2VzIG9mIHRoZSB0d28gdHJpYW5nbGVzLlxyXG4gIEByZXR1cm5zIFRydWUgaWYgdGhlIHR3byB0cmlhbmdsZXMgYXJlIGVxdWFsIHdpdGhpbiB0aGUgZ2l2ZW4gdG9sZXJhbmNlLCBmYWxzZSBvdGhlcndpc2UuXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyaWFuZ2xlc0VxdWFsKFxyXG4gIHRyaWFuZ2xlQTogVHJpYW5nbGUsXHJcbiAgdHJpYW5nbGVCOiBUcmlhbmdsZSxcclxuICB0b2xlcmFuY2U6IG51bWJlciA9IDFcclxuKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIHRyaWFuZ2xlQS5wb2ludHMuZXZlcnkoKHBvaW50QSkgPT5cclxuICAgIHRyaWFuZ2xlQi5wb2ludHMuZmluZCgocG9pbnRCKSA9PiBhcmVQb2ludHNFcXVhbChwb2ludEEsIHBvaW50QiwgdG9sZXJhbmNlKSlcclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSwgYXJlUG9pbnRzRXF1YWwsIEVQU0lMT04gfSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIHRyaWFuZ2xlIGZyb20gdGhyZWUgbGluZXMuXHJcbiAqIEBwYXJhbSBsaW5lMSAtIFRoZSBmaXJzdCBsaW5lIG9mIHRoZSB0cmlhbmdsZS5cclxuICogQHBhcmFtIGxpbmUyIC0gVGhlIHNlY29uZCBsaW5lIG9mIHRoZSB0cmlhbmdsZS5cclxuICogQHBhcmFtIGxpbmUzIC0gVGhlIHRoaXJkIGxpbmUgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gKiBAcmV0dXJucyBUaGUgdHJpYW5nbGUgY3JlYXRlZCBmcm9tIHRoZSBnaXZlbiBsaW5lcywgb3IgbnVsbCBpZiB0aGUgbGluZXMgY2Fubm90IGZvcm0gYSB2YWxpZCB0cmlhbmdsZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmlhbmdsZUZyb21MaW5lcyhcclxuICBsaW5lMTogTGluZSxcclxuICBsaW5lMjogTGluZSxcclxuICBsaW5lMzogTGluZVxyXG4pOiBUcmlhbmdsZSB8IG51bGwge1xyXG4gIGxldCBocG9pbnRzID0gW1xyXG4gICAgbGluZTEuc3RhcnQsXHJcbiAgICBsaW5lMS5lbmQsXHJcbiAgICBsaW5lMi5zdGFydCxcclxuICAgIGxpbmUyLmVuZCxcclxuICAgIGxpbmUzLnN0YXJ0LFxyXG4gICAgbGluZTMuZW5kLFxyXG4gIF07XHJcbiAgaHBvaW50cyA9IGhwb2ludHMuZmlsdGVyKFxyXG4gICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChwKSA9PiBhcmVQb2ludHNFcXVhbChwLCB2YWx1ZSkpXHJcbiAgKTtcclxuICAvLyBUaGUgdHJpYW5nbGUgbXVzdCBjb25zaXN0IHN0cmljdGx5IG9mIHRocmVlIHVuaXF1ZSBwb2ludHNcclxuICBpZiAoaHBvaW50cy5sZW5ndGggIT0gMykgcmV0dXJuIG51bGw7XHJcblxyXG4gIC8vIENoZWNraW5nIGZvciB0aGUgcG9zc2liaWxpdHkgb2YgdGhlIGV4aXN0ZW5jZSBvZiBhIHRyaWFuZ2xlXHJcbiAgdmFyIGEgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobGluZTEuc3RhcnQsIGxpbmUxLmVuZCk7XHJcbiAgdmFyIGIgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobGluZTIuc3RhcnQsIGxpbmUyLmVuZCk7XHJcbiAgdmFyIGMgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobGluZTMuc3RhcnQsIGxpbmUzLmVuZCk7XHJcbiAgaWYgKGEgPiBiICsgYyB8fCBiID4gYSArIGMgfHwgYyA+IGEgKyBiKSByZXR1cm4gbnVsbDtcclxuICBjb25zdCBwID0gKGEgKyBiICsgYykgLyAyO1xyXG4gIGxldCBTID0gTWF0aC5zcXJ0KHAgKiAocCAtIGEpICogKHAgLSBiKSAqIChwIC0gYykpO1xyXG4gIGlmIChpc05hTihTKSB8fCBTIDw9IDEpIHJldHVybiBudWxsO1xyXG5cclxuICByZXR1cm4gbmV3IFRyaWFuZ2xlKGhwb2ludHNbMF0sIGhwb2ludHNbMV0sIGhwb2ludHNbMl0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhQb2ludChcclxuICBwb2ludDogUG9pbnQsXHJcbiAgcG9pbnRzOiBQb2ludFtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgdG9Qb2ludCBvZiBwb2ludHMpIHtcclxuICAgIGxldCBkaXN0YWNlID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCB0b1BvaW50KTtcclxuICAgIGlmIChkaXN0YWNlIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5EaXN0ID0gZGlzdGFjZTtcclxuICAgICAgbWluUG9pbnQgPSB0b1BvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMoXHJcbiAgcG9pbnQ6IFBvaW50LFxyXG4gIGxpbmVzOiBMaW5lW10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICBsZXQgZGlzdFN0YXJ0ID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBsaW5lLnN0YXJ0KTtcclxuICAgIGxldCBkaXN0RW5kID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBsaW5lLmVuZCk7XHJcblxyXG4gICAgaWYgKE1hdGgubWluKGRpc3RTdGFydCwgZGlzdEVuZCkgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pblBvaW50ID0gZGlzdFN0YXJ0IDwgZGlzdEVuZCA/IGxpbmUuc3RhcnQgOiBsaW5lLmVuZDtcclxuICAgICAgbWluRGlzdCA9IE1hdGgubWluKGRpc3RTdGFydCwgZGlzdEVuZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZShcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBwZCA9IGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKHBvaW50LCBsaW5lKTtcclxuICAgIGlmIChwZC5kaXN0YW5jZSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluRGlzdCA9IHBkLmRpc3RhbmNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHBkLm5lYXJlc3RQb2ludDtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlcyB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzLlxyXG4gKiBAcGFyYW0gcG9pbnRBIC0gVGhlIGZpcnN0IHBvaW50XHJcbiAqIEBwYXJhbSBwb2ludEIgLSBUaGUgc2Vjb25kIHBvaW50XHJcbiAqIEByZXR1cm5zIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50QTogUG9pbnQsIHBvaW50QjogUG9pbnQpOiBudW1iZXIge1xyXG4gIHJldHVybiBNYXRoLnNxcnQoKHBvaW50QS54IC0gcG9pbnRCLngpICoqIDIgKyAocG9pbnRBLnkgLSBwb2ludEIueSkgKiogMik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYWxjdWxhdGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGEgcG9pbnQgYW5kIGEgbGluZSwgYW5kIGZpbmRzIHRoZSBuZWFyZXN0IHBvaW50IG9uIHRoZSBsaW5lIHRvIHRoZSBnaXZlbiBwb2ludC5cclxuICogQHBhcmFtIHBvaW50IC0gVGhlIHBvaW50IHRvIGZpbmQgdGhlIGRpc3RhbmNlIHRvIHRoZSBsaW5lIGZyb20uXHJcbiAqIEBwYXJhbSBsaW5lIC0gVGhlIGxpbmUgdG8gZmluZCB0aGUgZGlzdGFuY2UgdG8gdGhlIHBvaW50IGZyb20uXHJcbiAqIEByZXR1cm5zIFRoZSBuZWFyZXN0IHBvaW50IG9uIHRoZSBsaW5lIHRvIHRoZSBnaXZlbiBwb2ludCBhbmQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGdpdmVuIHBvaW50IGFuZCB0aGUgbGluZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUZyb21Qb2ludFRvTGluZShcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZTogTGluZVxyXG4pOiB7IG5lYXJlc3RQb2ludDogUG9pbnQ7IGRpc3RhbmNlOiBudW1iZXIgfSB7XHJcbiAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBsaW5lO1xyXG4gIGNvbnN0IGR4ID0gZW5kLnggLSBzdGFydC54O1xyXG4gIGNvbnN0IGR5ID0gZW5kLnkgLSBzdGFydC55O1xyXG5cclxuICAvLyBJZiB0aGUgbGluZSBpcyBqdXN0IGEgcG9pbnQsIHJldHVybiBkaXN0YW5jZSB0byB0aGF0IHBvaW50XHJcbiAgaWYgKGR4ID09PSAwICYmIGR5ID09PSAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkaXN0YW5jZTogZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBzdGFydCksXHJcbiAgICAgIG5lYXJlc3RQb2ludDogc3RhcnQsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIHRoZSBwYXJhbWV0ZXIgb2YgdGhlIHByb2plY3Rpb24gb2YgdGhlIHBvaW50IG9udG8gdGhlIGxpbmVcclxuICBjb25zdCB0ID1cclxuICAgICgocG9pbnQueCAtIHN0YXJ0LngpICogZHggKyAocG9pbnQueSAtIHN0YXJ0LnkpICogZHkpIC8gKGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcbiAgLy8gSWYgdCBpcyBvdXRzaWRlIHRoZSByYW5nZSBbMCwgMV0sIHRoZW4gdGhlIG5lYXJlc3QgcG9pbnQgaXMgb25lIG9mIHRoZSBsaW5lIGVuZHBvaW50c1xyXG4gIGlmICh0IDwgMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZGlzdGFuY2U6IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgc3RhcnQpLFxyXG4gICAgICBuZWFyZXN0UG9pbnQ6IHN0YXJ0LFxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKHQgPiAxKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkaXN0YW5jZTogZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBlbmQpLFxyXG4gICAgICBuZWFyZXN0UG9pbnQ6IGVuZCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIG5lYXJlc3QgcG9pbnQgb24gdGhlIGxpbmUgYW5kIHJldHVybiBpdHMgZGlzdGFuY2UgdG8gdGhlIHBvaW50XHJcbiAgY29uc3QgbmVhcmVzdFBvaW50ID0gbmV3IFBvaW50KHN0YXJ0LnggKyB0ICogZHgsIHN0YXJ0LnkgKyB0ICogZHkpO1xyXG4gIGNvbnN0IGRpc3RhbmNlID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBuZWFyZXN0UG9pbnQpO1xyXG4gIHJldHVybiB7IGRpc3RhbmNlLCBuZWFyZXN0UG9pbnQgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqICBSZXR1cm5zIGEgbGluZSB3aGljaCBjb250YWlucyB0aGUgY29tbW9uIHBhcnRzIG9mIHR3byBsaW5lcyBpZiB0aGV5IGFyZSBwYXJ0cyBvZiBvbmUgbGluZS5cclxuICogIEBwYXJhbSBsaW5lMSBUaGUgZmlyc3QgbGluZS5cclxuICogIEBwYXJhbSBsaW5lMiBUaGUgc2Vjb25kIGxpbmUuXHJcbiAqICBAcmV0dXJucyBBIG5ldyBMaW5lIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIGNvbW1vbiBwYXJ0cyBvZiB0aGUgdHdvIGlucHV0IGxpbmVzLCBvciBudWxsIGlmIHRoZXkgYXJlIG5vdCBwYXJ0cyBvZiBvbmUgbGluZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kQ29tbW9uTGluZShsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBMaW5lIHwgbnVsbCB7XHJcbiAgaWYgKCFhcmVMaW5lc1BhcmFsbGVsKGxpbmUxLCBsaW5lMikpIHJldHVybiBudWxsO1xyXG5cclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuc3RhcnQsIGxpbmUyLnN0YXJ0KSlcclxuICAgIHJldHVybiBuZXcgTGluZShsaW5lMS5lbmQsIGxpbmUyLmVuZCk7XHJcblxyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5lbmQsIGxpbmUyLmVuZCkpXHJcbiAgICByZXR1cm4gbmV3IExpbmUobGluZTEuc3RhcnQsIGxpbmUyLnN0YXJ0KTtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLnN0YXJ0LCBsaW5lMi5lbmQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLmVuZCwgbGluZTIuc3RhcnQpO1xyXG5cclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuZW5kLCBsaW5lMi5zdGFydCkpXHJcbiAgICByZXR1cm4gbmV3IExpbmUobGluZTEuc3RhcnQsIGxpbmUyLmVuZCk7XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZENvbW1vblBvaW50KGxpbmUxOiBMaW5lLCBsaW5lMjogTGluZSk6IFBvaW50IHwgbnVsbCB7XHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLnN0YXJ0LCBsaW5lMi5zdGFydCkpIHJldHVybiBsaW5lMS5zdGFydDtcclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuZW5kLCBsaW5lMi5lbmQpKSByZXR1cm4gbGluZTEuZW5kO1xyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5zdGFydCwgbGluZTIuZW5kKSkgcmV0dXJuIGxpbmUxLnN0YXJ0O1xyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0KSkgcmV0dXJuIGxpbmUxLmVuZDtcclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdHdvIGxpbmVzIGFyZSBwYXJhbGxlbC5cclxuICpcclxuICogQHBhcmFtIGxpbmUxIFRoZSBmaXJzdCBsaW5lLlxyXG4gKiBAcGFyYW0gbGluZTIgVGhlIHNlY29uZCBsaW5lLlxyXG4gKlxyXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBsaW5lcyBhcmUgcGFyYWxsZWwsIGZhbHNlIG90aGVyd2lzZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcmVMaW5lc1BhcmFsbGVsKGxpbmUxOiBMaW5lLCBsaW5lMjogTGluZSk6IGJvb2xlYW4ge1xyXG4gIGlmIChcclxuICAgIE1hdGguYWJzKGxpbmUxLnN0YXJ0LnkgLSBsaW5lMS5lbmQueSkgPD0gTnVtYmVyLkVQU0lMT04gJiZcclxuICAgIE1hdGguYWJzKGxpbmUyLnN0YXJ0LnkgLSBsaW5lMi5lbmQueSkgPD0gTnVtYmVyLkVQU0lMT05cclxuICApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKFxyXG4gICAgTWF0aC5hYnMobGluZTEuc3RhcnQueCAtIGxpbmUxLmVuZC54KSA8PSBOdW1iZXIuRVBTSUxPTiAmJlxyXG4gICAgTWF0aC5hYnMobGluZTIuc3RhcnQueCAtIGxpbmUyLmVuZC54KSA8PSBOdW1iZXIuRVBTSUxPTlxyXG4gICkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBsZXQgazEgPSBNYXRoLmF0YW4oXHJcbiAgICAobGluZTEuZW5kLnkgLSBsaW5lMS5zdGFydC55KSAvIChsaW5lMS5lbmQueCAtIGxpbmUxLnN0YXJ0LngpXHJcbiAgKTtcclxuICBsZXQgazIgPSBNYXRoLmF0YW4oXHJcbiAgICAobGluZTIuZW5kLnkgLSBsaW5lMi5zdGFydC55KSAvIChsaW5lMi5lbmQueCAtIGxpbmUyLnN0YXJ0LngpXHJcbiAgKTtcclxuICByZXR1cm4gTWF0aC5hYnMoazEgLSBrMikgPD0gTnVtYmVyLkVQU0lMT047XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBwb2ludCBpcyBsb2NhdGVkIG9uIGEgZ2l2ZW4gbGluZSBzZWdtZW50LlxyXG4gKiBAcGFyYW0gbGluZSAtIFRoZSBsaW5lIHNlZ21lbnQgdG8gdGVzdC5cclxuICogQHBhcmFtIHBvaW50IC0gVGhlIHBvaW50IHRvIGNoZWNrLlxyXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBwb2ludCBpcyBvbiB0aGUgbGluZSBzZWdtZW50LCBmYWxzZSBvdGhlcndpc2UuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNQb2ludE9uTGluZShsaW5lOiBMaW5lLCBwb2ludDogUG9pbnQpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgTWF0aC5hYnMoXHJcbiAgICAgIGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lLnN0YXJ0LCBwb2ludCkgK1xyXG4gICAgICAgIGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lLmVuZCwgcG9pbnQpIC1cclxuICAgICAgICBkaXN0YW5jZUJldHdlZW5Qb2ludHMobGluZS5lbmQsIGxpbmUuc3RhcnQpXHJcbiAgICApIDw9IEVQU0lMT05cclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgcG9pbnQgb2YgaW50ZXJzZWN0aW9uIG9yIGNvbm5lY3Rpb24gYmV0d2VlbiB0d28gbGluZSBzZWdtZW50cy5cclxuICogQHBhcmFtIGxpbmUxIC0gVGhlIGZpcnN0IGxpbmUgc2VnbWVudC5cclxuICogQHBhcmFtIGxpbmUyIC0gVGhlIHNlY29uZCBsaW5lIHNlZ21lbnQuXHJcbiAqIEByZXR1cm5zIFRoZSBwb2ludCBvZiBpbnRlcnNlY3Rpb24gb3IgY29ubmVjdGlvbiBiZXR3ZWVuIHRoZSB0d28gbGluZSBzZWdtZW50cywgb3IgbnVsbC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9uUG9pbnQobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogUG9pbnQgfCBudWxsIHtcclxuICAvLyBDaGVjayBpZiB0aGUgdHdvIGxpbmUgc2VnbWVudHMgYXJlIHBhcmFsbGVsXHJcbiAgaWYgKGFyZUxpbmVzUGFyYWxsZWwobGluZTEsIGxpbmUyKSkge1xyXG4gICAgLy8gSWYgdGhleSBhcmUgcGFyYWxsZWwsIGNoZWNrIGlmIHRoZXkgbGllIG9uIHRoZSBzYW1lIGxpbmVcclxuICAgIHJldHVybiBmaW5kQ29tbW9uUG9pbnQobGluZTEsIGxpbmUyKTtcclxuICB9XHJcblxyXG4gIC8vIENhbGN1bGF0ZSB0aGUgc2xvcGVzIG9mIHRoZSBsaW5lc1xyXG4gIGNvbnN0IHNsb3BlMSA9IChsaW5lMS5lbmQueSAtIGxpbmUxLnN0YXJ0LnkpIC8gKGxpbmUxLmVuZC54IC0gbGluZTEuc3RhcnQueCk7XHJcbiAgY29uc3Qgc2xvcGUyID0gKGxpbmUyLmVuZC55IC0gbGluZTIuc3RhcnQueSkgLyAobGluZTIuZW5kLnggLSBsaW5lMi5zdGFydC54KTtcclxuXHJcbiAgLy8gQ2FsY3VsYXRlIHRoZSB5LWludGVyY2VwdHMgb2YgdGhlIGxpbmVzXHJcbiAgY29uc3QgeUludGVyY2VwdDEgPSBsaW5lMS5zdGFydC55IC0gc2xvcGUxICogbGluZTEuc3RhcnQueDtcclxuICBjb25zdCB5SW50ZXJjZXB0MiA9IGxpbmUyLnN0YXJ0LnkgLSBzbG9wZTIgKiBsaW5lMi5zdGFydC54O1xyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50XHJcbiAgbGV0IHggPSAoeUludGVyY2VwdDIgLSB5SW50ZXJjZXB0MSkgLyAoc2xvcGUxIC0gc2xvcGUyKTtcclxuICAvLyBDYWxjdWxhdGUgdGhlIHktY29vcmRpbmF0ZSBvZiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50XHJcbiAgbGV0IHkgPSBzbG9wZTEgKiB4ICsgeUludGVyY2VwdDE7XHJcblxyXG4gIC8vIENoZWNrIGlmIGVpdGhlciBzbG9wZSBpcyB2ZXJ0aWNhbCAoaS5lLiBpbmZpbml0ZSlcclxuICBpZiAoIWlzRmluaXRlKHNsb3BlMSkpIHtcclxuICAgIHggPSBsaW5lMS5zdGFydC54O1xyXG4gICAgeSA9IHNsb3BlMiAqIGxpbmUxLnN0YXJ0LnggKyB5SW50ZXJjZXB0MjtcclxuICB9XHJcbiAgaWYgKCFpc0Zpbml0ZShzbG9wZTIpKSB7XHJcbiAgICB4ID0gbGluZTIuc3RhcnQueDtcclxuICAgIHkgPSBzbG9wZTEgKiBsaW5lMi5zdGFydC54ICsgeUludGVyY2VwdDE7XHJcbiAgfVxyXG5cclxuICBjb25zdCBwb2ludCA9IG5ldyBQb2ludCh4LCB5KTtcclxuICBpZiAoIWlzUG9pbnRPbkxpbmUobGluZTEsIHBvaW50KSB8fCAhaXNQb2ludE9uTGluZShsaW5lMiwgcG9pbnQpKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIC8vIFJldHVybiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50XHJcbiAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTtcclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcbmltcG9ydCB7IFRyaWFuZ2xlQ2FudmFzLCBUcmlhbmdsZUNhbnZhc0NvbmZpZyB9IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcbmltcG9ydCB7XHJcbiAgZmluZEludGVyc2VjdGlvblBvaW50LFxyXG4gIGRpc3RhbmNlQmV0d2VlblBvaW50cyxcclxuICBkaXN0YW5jZUZyb21Qb2ludFRvTGluZSxcclxuICBtZXJnZVBvaW50V2l0aExpbmUsXHJcbiAgbWVyZ2VQb2ludFdpdGhMaW5lUG9pbnRzLFxyXG4gIG1lcmdlUG9pbnRXaXRoUG9pbnQsXHJcbn0gZnJvbSBcIi4vY29yZW1hdGhcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnIGV4dGVuZHMgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBtZXJnZVJhZGl1czogbnVtYmVyID0gNTA7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgc3VwZXIoaW5pdCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGluaXQpO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgRHJhd0FjdGlvbiB7XHJcbiAgbGluZTogTGluZTtcclxuICBpcG9pbnRzOiBQb2ludFtdO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBJbnB1dFRyaWFuZ2xlQ2FudmFzIGV4dGVuZHMgVHJpYW5nbGVDYW52YXMge1xyXG4gIGxpbmVzOiBMaW5lW10gPSBbXTtcclxuICBpbnRlcnNlY3Rpb25Qb2ludHM6IFtQb2ludFtdXSA9IFtbXV07XHJcbiAgY2FuY2VsbGVkQWN0aW9uczogRHJhd0FjdGlvbltdID0gW107XHJcblxyXG4gIG1vdXNlUG9zOiBQb2ludCA9IG5ldyBQb2ludCgwLCAwKTtcclxuICBzZWxlY3RlZFBvaW50OiBQb2ludCB8IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25maWc6IElucHV0VHJpYW5nbGVDYW52YXNDb25maWcpIHtcclxuICAgIHN1cGVyKGNvbmZpZyBhcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyk7XHJcbiAgICB0aGlzLnJ1blVzZXJFdmVudHMoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbGVhckFsbCgpIHtcclxuICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgIHRoaXMubGluZXMgPSBbXTtcclxuICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzID0gW1tdXTtcclxuICAgIHRoaXMuY2FuY2VsbGVkQWN0aW9ucyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVuZG8oKSB7XHJcbiAgICBpZiAodGhpcy5saW5lcy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgdGhpcy5jYW5jZWxsZWRBY3Rpb25zLnB1c2goe1xyXG4gICAgICBsaW5lOiB0aGlzLmxpbmVzLnBvcCgpLFxyXG4gICAgICBpcG9pbnRzOlxyXG4gICAgICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLmxlbmd0aCA+IDAgPyB0aGlzLmludGVyc2VjdGlvblBvaW50cy5wb3AoKSA6IFtdLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZG8oKSB7XHJcbiAgICBpZiAodGhpcy5jYW5jZWxsZWRBY3Rpb25zLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICBsZXQgc2F2ZWRBY3Rpb24gPSB0aGlzLmNhbmNlbGxlZEFjdGlvbnMucG9wKCk7XHJcbiAgICB0aGlzLmxpbmVzLnB1c2goc2F2ZWRBY3Rpb24ubGluZSk7XHJcbiAgICBpZiAoc2F2ZWRBY3Rpb24uaXBvaW50cy5sZW5ndGggPiAwKVxyXG4gICAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cy5wdXNoKHNhdmVkQWN0aW9uLmlwb2ludHMpO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlTW91c2VQb3MoZTogUG9pbnRlckV2ZW50KSB7XHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy5jYW52YXNFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgdGhpcy5tb3VzZVBvcy54ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xyXG4gICAgdGhpcy5tb3VzZVBvcy55ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1lcmdlUG9pbnRXaXRoSW50ZXJzZWN0aW9uUG9pbnRzKHBvaW50OiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKFxyXG4gICAgICBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gICAgICAgIHBvaW50LFxyXG4gICAgICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLnJlZHVjZSgoYWNjdW0sIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGFjY3VtLnB1c2goLi4uaXRlbSk7XHJcbiAgICAgICAgICByZXR1cm4gYWNjdW07XHJcbiAgICAgICAgfSwgW10pLFxyXG4gICAgICAgIHRoaXMuY29uZmlnLm1lcmdlUmFkaXVzXHJcbiAgICAgIClcclxuICAgIClcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1lcmdlUG9pbnRXaXRoR3JpZChwb2ludDogUG9pbnQpOiBib29sZWFuIHtcclxuICAgIGxldCBzaXplID0gdGhpcy5jb25maWcuZ3JpZENlbGxTaXplO1xyXG4gICAgbGV0IGN4ID0gTWF0aC5mbG9vcihwb2ludC54IC8gc2l6ZSk7XHJcbiAgICBsZXQgY3kgPSBNYXRoLmZsb29yKHBvaW50LnkgLyBzaXplKTtcclxuICAgIGxldCBzdGFydFBvaW50ID0gbmV3IFBvaW50KGN4ICogc2l6ZSwgY3kgKiBzaXplKTtcclxuICAgIGxldCBncmlkUG9pbnRzID0gW1xyXG4gICAgICBzdGFydFBvaW50LFxyXG4gICAgICBuZXcgUG9pbnQoc3RhcnRQb2ludC54ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplLCBzdGFydFBvaW50LnkpLFxyXG4gICAgICBuZXcgUG9pbnQoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnkgKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUpLFxyXG4gICAgICBuZXcgUG9pbnQoXHJcbiAgICAgICAgc3RhcnRQb2ludC54ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplLFxyXG4gICAgICAgIHN0YXJ0UG9pbnQueSArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZVxyXG4gICAgICApLFxyXG4gICAgXTtcclxuICAgIGlmIChtZXJnZVBvaW50V2l0aFBvaW50KHBvaW50LCBncmlkUG9pbnRzLCB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUpKVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkSW50ZXJzZWN0aW9uUG9pbnQobGluZTogTGluZSkge1xyXG4gICAgbGV0IHBvaW50czogUG9pbnRbXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgd2l0aExpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICBsZXQgcG9pbnQgPSBmaW5kSW50ZXJzZWN0aW9uUG9pbnQobGluZSwgd2l0aExpbmUpO1xyXG4gICAgICBpZiAocG9pbnQgIT0gbnVsbCkgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgfVxyXG4gICAgaWYgKHBvaW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLnB1c2gocG9pbnRzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29ycmVjdFBvaW50UG9zKHBvaW50OiBQb2ludCkge1xyXG4gICAgbGV0IHJlcyA9IGZhbHNlO1xyXG4gICAgaWYgKCFyZXMpIHtcclxuICAgICAgcmVzID0gdGhpcy5tZXJnZVBvaW50V2l0aEludGVyc2VjdGlvblBvaW50cyhwb2ludCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlcykge1xyXG4gICAgICByZXMgPSBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMoXHJcbiAgICAgICAgcG9pbnQsXHJcbiAgICAgICAgdGhpcy5saW5lcyxcclxuICAgICAgICB0aGlzLmNvbmZpZy5tZXJnZVJhZGl1cyAqIDJcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICghcmVzKSB7XHJcbiAgICAgIHJlcyA9IG1lcmdlUG9pbnRXaXRoTGluZShwb2ludCwgdGhpcy5saW5lcywgdGhpcy5jb25maWcubWVyZ2VSYWRpdXMgKiAyKTtcclxuICAgIH1cclxuICAgIGlmICghcmVzICYmIHRoaXMuY29uZmlnLnVzZUdyaWQpIHtcclxuICAgICAgcmVzID0gdGhpcy5tZXJnZVBvaW50V2l0aEdyaWQocG9pbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0TW91c2VQb2ludCgpIHtcclxuICAgIHRoaXMuY29ycmVjdFBvaW50UG9zKHRoaXMubW91c2VQb3MpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0U2VsZWN0ZWRQb2ludCgpIHtcclxuICAgIGxldCBwb2ludCA9IG5ldyBQb2ludCh0aGlzLm1vdXNlUG9zLngsIHRoaXMubW91c2VQb3MueSk7XHJcbiAgICB0aGlzLmNvcnJlY3RQb2ludFBvcyhwb2ludCk7XHJcbiAgICB0aGlzLnNlbGVjdGVkUG9pbnQgPSBwb2ludC5jbG9uZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWRyYXcoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZShsaW5lLnN0YXJ0LCBsaW5lLmVuZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQobGluZS5zdGFydCk7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KGxpbmUuZW5kKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGlwb2ludHMgb2YgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgZm9yIChsZXQgcG9pbnQgb2YgaXBvaW50cykge1xyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50KHBvaW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBydW5Vc2VyRXZlbnRzKCkge1xyXG4gICAgbGV0IGNhbnZhcyA9IHRoaXMuY2FudmFzRWxlbWVudDtcclxuXHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMucG9pbnRlcmRvd25FdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMucG9pbnRlcnVwRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgKCkgPT4ge30sIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5wb2ludGVybW92ZUV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVybW92ZUV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG5cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUG9pbnQgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludCwgdGhpcy5tb3VzZVBvcyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVyZG93bkV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNvcnJlY3RTZWxlY3RlZFBvaW50KCk7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVydXBFdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZFBvaW50ID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RNb3VzZVBvaW50KCk7XHJcbiAgICBsZXQgbGluZSA9IG5ldyBMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludC5jbG9uZSgpLCB0aGlzLm1vdXNlUG9zLmNsb25lKCkpO1xyXG4gICAgdGhpcy5hZGRJbnRlcnNlY3Rpb25Qb2ludChsaW5lKTtcclxuICAgIHRoaXMubGluZXMucHVzaChsaW5lKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRQb2ludCA9IG51bGw7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQge1xyXG4gIENvbG9yR2VuZXJhdG9yLFxyXG4gIFRyaWFuZ2xlQ2FudmFzLFxyXG4gIFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyB7XHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGluaXQ/OiBQYXJ0aWFsPE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgc3VwZXIoaW5pdCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGluaXQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE91dHB1dFRyaWFuZ2xlQ2FudmFzIGV4dGVuZHMgVHJpYW5nbGVDYW52YXMge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25maWc6IE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcgYXMgVHJpYW5nbGVDYW52YXNDb25maWcpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdMaW5lcyhcclxuICAgIGxpbmVzOiBMaW5lW10sXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKGxpbmUuc3RhcnQsIGxpbmUuZW5kLCBjb2xvciwgbGluZVdpZHRoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3UG9pbnRzKFxyXG4gICAgcG9pbnRzOiBQb2ludFtdLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgcG9pbnRTaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5wb2ludFNpemVcclxuICApIHtcclxuICAgIGZvciAobGV0IHBvaW50IG9mIHBvaW50cykge1xyXG4gICAgICB0aGlzLmRyYXdQb2ludChwb2ludCwgY29sb3IsIHBvaW50U2l6ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1RyaWFuZ2xlcyhcclxuICAgIHRyaWFuZ2xlczogVHJpYW5nbGVbXSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICBmb3IgKGxldCB0cmlhbmdsZSBvZiB0cmlhbmdsZXMpIHtcclxuICAgICAgdGhpcy5kcmF3VHJpYW5nbGUodHJpYW5nbGUsIGNvbG9yLCBsaW5lV2lkdGgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JHZW5lcmF0b3Ige1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBnZW5lcmF0ZTogKCkgPT4gc3RyaW5nKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPVxyXG4gICAgXCIjMDAwMDAwXCI7XHJcbiAgcHVibGljIGxpbmVXaWR0aDogbnVtYmVyID0gMztcclxuICBwdWJsaWMgcG9pbnRTaXplOiBudW1iZXIgPSA1O1xyXG4gIHB1YmxpYyBjYW52YXNJZDogc3RyaW5nID0gXCJjYW52YXNcIjtcclxuXHJcbiAgcHVibGljIHVzZUdyaWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgZ3JpZENvbG9yOiBzdHJpbmcgPSBcIiM1MDUwNTBcIjtcclxuICBwdWJsaWMgZ3JpZExpbmVXaWR0aDogbnVtYmVyID0gMTtcclxuICBwdWJsaWMgZ3JpZENlbGxTaXplOiBudW1iZXIgPSA0MDtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGluaXQ/OiBQYXJ0aWFsPFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZUNhbnZhcyB7XHJcbiAgY2FudmFzRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG4gIG9uUmVzaXplID0gKGU6IFVJRXZlbnQpID0+IHtcclxuICAgIGxldCB0ZW1wID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHRcclxuICAgICk7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIHRoaXMuY3R4LnB1dEltYWdlRGF0YSh0ZW1wLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIGNvbmZpZy5jYW52YXNJZFxyXG4gICAgKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCA9IHRoaXMuY2FudmFzRWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQgPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5vblJlc2l6ZSwgZmFsc2UpO1xyXG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIsIHtcclxuICAgICAgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlLFxyXG4gICAgfSkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgdGhpcy5jdHgubGluZUNhcCA9IFwicm91bmRcIjtcclxuXHJcbiAgICBpZiAodGhpcy5jb25maWcudXNlR3JpZCkge1xyXG4gICAgICB0aGlzLmRyYXdHcmlkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0dyaWQoXHJcbiAgICBjb2xvcjogc3RyaW5nID0gdGhpcy5jb25maWcuZ3JpZENvbG9yLFxyXG4gICAgc2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcuZ3JpZENlbGxTaXplXHJcbiAgKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAxO1xyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDw9IHRoaXMuY2FudmFzRWxlbWVudC53aWR0aDsgeCArPSBzaXplKSB7XHJcbiAgICAgIHRoaXMuY3R4Lm1vdmVUbyh4ICsgMC41LCAwKTtcclxuICAgICAgdGhpcy5jdHgubGluZVRvKHggKyAwLjUsIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDw9IHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQ7IHkgKz0gc2l6ZSkge1xyXG4gICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgeSArIDAuNSk7XHJcbiAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsIHkgKyAwLjUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdMaW5lKFxyXG4gICAgZnJvbTogUG9pbnQsXHJcbiAgICB0bzogUG9pbnQsXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgaWYgKCFmcm9tIHx8ICF0bykgcmV0dXJuO1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvckdlbmVyYXRvcilcclxuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xyXG4gICAgdGhpcy5jdHgubW92ZVRvKGZyb20ueCwgZnJvbS55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0by54LCB0by55KTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdQb2ludChcclxuICAgIHBvaW50OiBQb2ludCxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIHBvaW50U2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcucG9pbnRTaXplXHJcbiAgKSB7XHJcbiAgICBpZiAoIXBvaW50KSByZXR1cm47XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yR2VuZXJhdG9yKSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgIGxldCBzaXplID0gcG9pbnRTaXplO1xyXG4gICAgdGhpcy5jdHguZmlsbFJlY3QocG9pbnQueCAtIHNpemUgLyAyLCBwb2ludC55IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1RyaWFuZ2xlKFxyXG4gICAgdHJpYW5nbGU6IFRyaWFuZ2xlLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIGlmICghdHJpYW5nbGUpIHJldHVybjtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JHZW5lcmF0b3IpIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICB0aGlzLmN0eC5tb3ZlVG8odHJpYW5nbGUucDEueCwgdHJpYW5nbGUucDEueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDIueCwgdHJpYW5nbGUucDIueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDMueCwgdHJpYW5nbGUucDMueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDEueCwgdHJpYW5nbGUucDEueSk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbGVhckNhbnZhcygpIHtcclxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdChcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0XHJcbiAgICApO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLnVzZUdyaWQpIHtcclxuICAgICAgdGhpcy5kcmF3R3JpZCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmFwcC1idW5kbGUuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJpbXBvcnQge1xyXG4gIElucHV0VHJpYW5nbGVDYW52YXMsXHJcbiAgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi9pbnB1dHRyaWFuZ2xlY2FudmFzXCI7XHJcbmltcG9ydCB7XHJcbiAgT3V0cHV0VHJpYW5nbGVDYW52YXMsXHJcbiAgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcsXHJcbn0gZnJvbSBcIi4vb3V0cHV0dHJpYW5nbGVjYW52YXNcIjtcclxuXHJcbmxldCBjYWxjdWxhdG9yOiBhbnk7XHJcbmNvbnN0IGNhbGN1bGF0b3JMb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgXCJsb2FkaW5nXCJcclxuKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XHJcbmNvbnN0IGNhbGN1bGF0ZXdvcmtlciA9IG5ldyBXb3JrZXIoXHJcbiAgbmV3IFVSTChcIi4vd29ya2Vycy9jYWxjLndvcmtlci50c1wiLCBpbXBvcnQubWV0YS51cmwpXHJcbik7XHJcbmNhbGN1bGF0ZXdvcmtlci5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xyXG4gIGNhbGN1bGF0b3IgPSBtZXNzYWdlLmRhdGE7XHJcbiAgY29uc29sZS5sb2coY2FsY3VsYXRvcik7XHJcbiAgaWYgKHRyaWFuZ2xlc0NvdW50ZXIpIHtcclxuICAgIHRyaWFuZ2xlc0NvdW50ZXIudGV4dENvbnRlbnQgPSBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGg7XHJcbiAgfVxyXG4gIGRyYXdPdXRwdXRDYW52YXMoKTtcclxuICBkcmF3VHJpYW5nbGVzU2VsZWN0b3IoKTtcclxuICBvdXRwdXRDYW52YXMuY2FudmFzRWxlbWVudC5zY3JvbGxJbnRvVmlldyh7XHJcbiAgICBiZWhhdmlvcjogXCJzbW9vdGhcIixcclxuICAgIGJsb2NrOiBcImVuZFwiLFxyXG4gIH0pO1xyXG4gIGNhbGN1bGF0b3JMb2FkaW5nLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG59O1xyXG5cclxuY29uc3QgY2FudmFzID0gbmV3IElucHV0VHJpYW5nbGVDYW52YXMoXHJcbiAgbmV3IElucHV0VHJpYW5nbGVDYW52YXNDb25maWcoe1xyXG4gICAgY29sb3I6IFwid2hpdGVcIixcclxuICAgIGxpbmVXaWR0aDogMixcclxuICAgIHBvaW50U2l6ZTogOCxcclxuICAgIGNhbnZhc0lkOiBcImNhbnZhc1wiLFxyXG4gICAgbWVyZ2VSYWRpdXM6IDIwLFxyXG4gICAgdXNlR3JpZDogdHJ1ZSxcclxuICAgIGdyaWRDZWxsU2l6ZTogNDAsXHJcbiAgICBncmlkTGluZVdpZHRoOiAyMCxcclxuICB9KVxyXG4pO1xyXG5cclxubGV0IHNob3dUcmlhbmdsZUluZGV4ID0gMDtcclxuY29uc3QgdHJpYW5nbGVzU2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICBcInRyaWFuZ2xlcy1zZWxlY3RvclwiXHJcbikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xyXG5jb25zdCB0cmlhbmdsZXNDb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgXCJ0cmlhbmdsZXMtY291bnRcIlxyXG4pIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcclxuY29uc3Qgb3V0cHV0Q2FudmFzID0gbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyh7XHJcbiAgICBjb2xvcjogXCJibGFja1wiLFxyXG4gICAgbGluZVdpZHRoOiAyLFxyXG4gICAgcG9pbnRTaXplOiA0LFxyXG4gICAgY2FudmFzSWQ6IFwidHJpYW5nbGVzXCIsXHJcbiAgfSlcclxuKTtcclxuXHJcbmZ1bmN0aW9uIGRyYXdPdXRwdXRDYW52YXMoKSB7XHJcbiAgb3V0cHV0Q2FudmFzLmNsZWFyQ2FudmFzKCk7XHJcbiAgaWYoIWNhbGN1bGF0b3IpXHJcbiAgICByZXR1cm47XHJcbiAgb3V0cHV0Q2FudmFzLmRyYXdMaW5lcyhjYWxjdWxhdG9yLmxpbmVzLCBcImdyZXlcIiwgMSk7XHJcbiAgb3V0cHV0Q2FudmFzLmRyYXdQb2ludHMoY2FsY3VsYXRvci5wb2ludHMsIFwiZ3JheVwiLCA1KTtcclxuICBvdXRwdXRDYW52YXMuZHJhd1RyaWFuZ2xlKGNhbGN1bGF0b3IudHJpYW5nbGVzW3Nob3dUcmlhbmdsZUluZGV4XSwgXCIjRUI2MThGXCIsIDQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3VHJpYW5nbGVzU2VsZWN0b3IoKSB7XHJcbiAgaWYgKHRyaWFuZ2xlc1NlbGVjdG9yICYmIGNhbGN1bGF0b3IgJiYgY2FsY3VsYXRvci50cmlhbmdsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgdHJpYW5nbGVzU2VsZWN0b3IudGV4dENvbnRlbnQgPSBgJHtzaG93VHJpYW5nbGVJbmRleCArIDF9IC8gJHtcclxuICAgICAgY2FsY3VsYXRvci50cmlhbmdsZXMubGVuZ3RoXHJcbiAgICB9YDtcclxuICB9XHJcbn1cclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xlYXJcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgc2hvd1RyaWFuZ2xlSW5kZXggPSAwO1xyXG4gIGNhbGN1bGF0b3IgPSBudWxsO1xyXG4gIGNhbnZhcy5jbGVhckFsbCgpO1xyXG4gIG91dHB1dENhbnZhcy5jbGVhckNhbnZhcygpO1xyXG4gIGlmICh0cmlhbmdsZXNTZWxlY3Rvcikge1xyXG4gICAgdHJpYW5nbGVzU2VsZWN0b3IudGV4dENvbnRlbnQgPSBcIjAgLyAwXCI7XHJcbiAgfVxyXG4gIGlmICh0cmlhbmdsZXNDb3VudGVyKSB7XHJcbiAgICB0cmlhbmdsZXNDb3VudGVyLnRleHRDb250ZW50ID0gXCIwXCI7XHJcbiAgfVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLXByZXZcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYgKGNhbGN1bGF0b3IgJiYgc2hvd1RyaWFuZ2xlSW5kZXggPiAwKSBzaG93VHJpYW5nbGVJbmRleC0tO1xyXG4gIGRyYXdPdXRwdXRDYW52YXMoKTtcclxuICBkcmF3VHJpYW5nbGVzU2VsZWN0b3IoKTtcclxufSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLW5leHRcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYgKGNhbGN1bGF0b3IgJiYgc2hvd1RyaWFuZ2xlSW5kZXggPCBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGggLSAxKSBzaG93VHJpYW5nbGVJbmRleCsrO1xyXG4gIGRyYXdPdXRwdXRDYW52YXMoKTtcclxuICBkcmF3VHJpYW5nbGVzU2VsZWN0b3IoKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbGNcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FsY3VsYXRvckxvYWRpbmcuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG4gIGNhbGN1bGF0ZXdvcmtlci5wb3N0TWVzc2FnZShjYW52YXMubGluZXMpO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVkb1wiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjYW52YXMucmVkbygpO1xyXG59KTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmRvXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGNhbnZhcy51bmRvKCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=