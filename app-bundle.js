/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calculation.ts":
/*!****************************!*\
  !*** ./src/calculation.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkIntersection = exports.distanceFromPointToLine = exports.distanceBetweenPoints = exports.mergePointWithLine = exports.mergePointWithLinePoints = exports.mergePointWithPoint = exports.TrianglesCalculator = exports.TrianglesCalculatorConfig = void 0;
const core_1 = __webpack_require__(/*! ./core */ "./src/core.ts");
class TrianglesCalculatorConfig {
    constructor() { }
}
exports.TrianglesCalculatorConfig = TrianglesCalculatorConfig;
class TrianglesCalculator {
    constructor() {
        this.points = [];
        this.lines = [];
        this.connections = [];
        this.triangles = [];
        this.segmentsMap = new Map();
    }
    calc(lines) {
        this.lines = lines;
        this.recalcIntersections();
        this.recalcConnections();
        this.recalcTriangles();
    }
    recalcIntersections() {
        this.segmentsMap = new Map();
        for (let i = 0; i < this.lines.length; i++) {
            this.segmentsMap.set(i, []);
        }
        this.points = [];
        for (let line1 of this.lines) {
            this.points.push(line1.start);
            this.points.push(line1.end);
            this.segmentsMap.get(this.lines.indexOf(line1))?.push(line1.start);
            this.segmentsMap.get(this.lines.indexOf(line1))?.push(line1.end);
            for (let line2 of this.lines) {
                let intersectionPoint = checkIntersection(line1, line2);
                if (intersectionPoint != null) {
                    this.segmentsMap
                        .get(this.lines.indexOf(line1))
                        ?.push(intersectionPoint);
                    this.segmentsMap
                        .get(this.lines.indexOf(line2))
                        ?.push(intersectionPoint);
                    this.points.push(intersectionPoint);
                }
            }
        }
        this.points = this.points.filter((value, index, self) => index === self.findIndex((p) => (0, core_1.isPointsEqual)(p, value)));
    }
    recalcConnections() {
        this.connections = [];
        for (let intersectionPoints of this.segmentsMap.values()) {
            for (let p1 of intersectionPoints) {
                for (let p2 of intersectionPoints) {
                    if (!(0, core_1.isPointsEqual)(p1, p2)) {
                        this.connections.push(new core_1.Line(p1, p2));
                    }
                }
            }
        }
        this.connections = this.connections.filter((value, index, self) => index === self.findIndex((l) => (0, core_1.isLinesEqual)(l, value)));
    }
    recalcTriangles() {
        this.triangles = [];
        for (let l1 of this.connections) {
            for (let l2 of this.connections) {
                for (let l3 of this.connections) {
                    if (l1 == l2 || l1 == l3 || l2 == l3)
                        continue;
                    let triangle = linesToTriangle(l1, l2, l3);
                    if (triangle != null) {
                        this.triangles.push(triangle);
                    }
                }
            }
        }
        this.triangles = this.triangles.filter((value, index, self) => index === self.findIndex((t) => (0, core_1.isTrianglesEqual)(t, value)));
    }
}
exports.TrianglesCalculator = TrianglesCalculator;
function linesToTriangle(l1, l2, l3) {
    let hpoints = [l1.start, l1.end, l2.start, l2.end, l3.start, l3.end];
    hpoints = hpoints.filter((value, index, self) => index === self.findIndex((p) => (0, core_1.isPointsEqual)(p, value)));
    if (hpoints.length != 3)
        return null;
    var a = distanceBetweenPoints(l1.start, l1.end);
    var b = distanceBetweenPoints(l2.start, l2.end);
    var c = distanceBetweenPoints(l3.start, l3.end);
    if (a > b + c || b > a + c || c > a + b)
        return null;
    const p = (a + b + c) / 2;
    let S = (p * (p - a) * (p - b) * (p - c)) ** 0.5;
    if (isNaN(S) || Math.abs(S) <= 1)
        return null;
    return new core_1.Triangle(hpoints[0], hpoints[1], hpoints[2]);
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
exports.mergePointWithPoint = mergePointWithPoint;
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
exports.mergePointWithLinePoints = mergePointWithLinePoints;
function mergePointWithLine(point, lines, raduis) {
    let minPoint = null;
    let minDist = Number.MAX_SAFE_INTEGER;
    for (let line of lines) {
        let pd = distanceFromPointToLine(point, line);
        if (pd.distace < minDist) {
            minDist = pd.distace;
            minPoint = pd.point;
        }
    }
    if (minPoint != null && minDist <= raduis) {
        point.x = minPoint.x;
        point.y = minPoint.y;
        return true;
    }
    return false;
}
exports.mergePointWithLine = mergePointWithLine;
function distanceBetweenPoints(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
exports.distanceBetweenPoints = distanceBetweenPoints;
function distanceFromPointToLine(point, line) {
    const A = point.x - line.start.x;
    const B = point.y - line.start.y;
    const C = line.end.x - line.start.x;
    const D = line.end.y - line.start.y;
    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) {
        param = dot / len_sq;
    }
    let xx = 0;
    let yy = 0;
    if (param < 0) {
        xx = line.start.x;
        yy = line.start.y;
    }
    else if (param > 1) {
        xx = line.end.x;
        yy = line.end.y;
    }
    else {
        xx = line.start.x + param * C;
        yy = line.start.y + param * D;
    }
    let dx = point.x - xx;
    let dy = point.y - yy;
    return { point: new core_1.Point(xx, yy), distace: Math.sqrt(dx * dx + dy * dy) };
}
exports.distanceFromPointToLine = distanceFromPointToLine;
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
    function isPointOnLine(l, c) {
        let p1 = l.start;
        let p2 = l.end;
        let dx1 = p2.x - p1.x;
        let dy1 = p2.y - p1.y;
        let dx = c.x - p1.x;
        let dy = c.y - p1.y;
        let S = dx1 * dy - dx * dy1;
        let ab = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        let h = S / ab;
        return Math.abs(h) < 0.1;
    }
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
            return new core_1.Point(pointxx, pointyy);
        }
        else {
            return null;
        }
    }
}
exports.checkIntersection = checkIntersection;


/***/ }),

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isTrianglesEqual = exports.isLinesEqual = exports.isPointsEqual = exports.Triangle = exports.Line = exports.Point = void 0;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
}
exports.Point = Point;
class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
exports.Line = Line;
class Triangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}
exports.Triangle = Triangle;
function isPointsEqual(a, b, alpha = 1) {
    return Math.abs(a.x - b.x) <= alpha && Math.abs(a.y - b.y) <= alpha;
}
exports.isPointsEqual = isPointsEqual;
function isLinesEqual(a, b, alpha = 1) {
    return ((isPointsEqual(a.start, b.start, alpha) && isPointsEqual(a.end, b.end, alpha)) ||
        (isPointsEqual(a.end, b.start, alpha) && isPointsEqual(a.start, b.end, alpha)));
}
exports.isLinesEqual = isLinesEqual;
function isTrianglesEqual(a, b, alpha = 1) {
    let equals = 0;
    equals +=
        isPointsEqual(a.p1, b.p1, alpha) ||
            isPointsEqual(a.p1, b.p2, alpha) ||
            isPointsEqual(a.p1, b.p3, alpha)
            ? 1
            : 0;
    equals +=
        isPointsEqual(a.p2, b.p1, alpha) ||
            isPointsEqual(a.p2, b.p2, alpha) ||
            isPointsEqual(a.p2, b.p3, alpha)
            ? 1
            : 0;
    equals +=
        isPointsEqual(a.p3, b.p1, alpha) ||
            isPointsEqual(a.p3, b.p2, alpha) ||
            isPointsEqual(a.p3, b.p3, alpha)
            ? 1
            : 0;
    return equals === 3;
}
exports.isTrianglesEqual = isTrianglesEqual;


/***/ }),

/***/ "./src/inputtrianglecanvas.ts":
/*!************************************!*\
  !*** ./src/inputtrianglecanvas.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputTriangleCanvas = exports.InputTriangleCanvasConfig = void 0;
const core_1 = __webpack_require__(/*! ./core */ "./src/core.ts");
const trianglecanvas_1 = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");
const calculation_1 = __webpack_require__(/*! ./calculation */ "./src/calculation.ts");
class InputTriangleCanvasConfig extends trianglecanvas_1.TriangleCanvasConfig {
    constructor(init) {
        super(init);
        this.anchorRadius = 50;
        Object.assign(this, init);
    }
}
exports.InputTriangleCanvasConfig = InputTriangleCanvasConfig;
class InputTriangleCanvas extends trianglecanvas_1.TriangleCanvas {
    constructor(config) {
        super(config);
        this.config = config;
        this.lines = [];
        this.intersectionPoints = [];
        this.mousePos = new core_1.Point(0, 0);
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
            let line = new core_1.Line(this.selectedPoint.clone(), this.mousePos.clone());
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
        this.intersectionPoints = [];
    }
    updateMousePos(e) {
        const rect = this.canvasElement.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
    }
    mergePointWithIntersectionPoints(point) {
        if ((0, calculation_1.mergePointWithPoint)(point, this.intersectionPoints, this.config.anchorRadius))
            return true;
        return false;
    }
    mergePointWithGrid(point) {
        let size = this.config.gridCellSize;
        let cx = Math.floor(point.x / size);
        let cy = Math.floor(point.y / size);
        let startPoint = new core_1.Point(cx * size, cy * size);
        let gridPoints = [
            startPoint,
            new core_1.Point(startPoint.x + this.config.gridCellSize, startPoint.y),
            new core_1.Point(startPoint.x, startPoint.y + this.config.gridCellSize),
            new core_1.Point(startPoint.x + this.config.gridCellSize, startPoint.y + this.config.gridCellSize),
        ];
        if ((0, calculation_1.mergePointWithPoint)(point, gridPoints, this.config.anchorRadius))
            return true;
        return false;
    }
    addIntersectionPoint(line) {
        for (let withLine of this.lines) {
            let point = (0, calculation_1.checkIntersection)(line, withLine);
            if (point != null)
                this.intersectionPoints.push(point);
        }
    }
    correctMousePoint() {
        let res = false;
        if (!res)
            res = this.mergePointWithIntersectionPoints(this.mousePos);
        if (!res)
            res = (0, calculation_1.mergePointWithLinePoints)(this.mousePos, this.lines, this.config.anchorRadius);
        if (!res)
            res = (0, calculation_1.mergePointWithLine)(this.mousePos, this.lines, this.config.anchorRadius);
        if (!res && this.config.useGrid)
            res = this.mergePointWithGrid(this.mousePos);
    }
    correctSelectedPoint() {
        let point = new core_1.Point(this.mousePos.x, this.mousePos.y);
        let res = false;
        if (!res)
            res = this.mergePointWithIntersectionPoints(point);
        if (!res)
            res = (0, calculation_1.mergePointWithLinePoints)(point, this.lines, this.config.anchorRadius);
        if (!res)
            res = (0, calculation_1.mergePointWithLine)(point, this.lines, this.config.anchorRadius);
        if (!res && this.config.useGrid)
            res = this.mergePointWithGrid(point);
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
        for (let point of this.intersectionPoints) {
            this.drawPoint(point);
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
exports.InputTriangleCanvas = InputTriangleCanvas;


/***/ }),

/***/ "./src/outputtrianglecanvas.ts":
/*!*************************************!*\
  !*** ./src/outputtrianglecanvas.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OutputTriangleCanvas = exports.OutputTriangleCanvasConfig = void 0;
const trianglecanvas_1 = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");
class OutputTriangleCanvasConfig extends trianglecanvas_1.TriangleCanvasConfig {
    constructor(init) {
        super(init);
        Object.assign(this, init);
    }
}
exports.OutputTriangleCanvasConfig = OutputTriangleCanvasConfig;
class OutputTriangleCanvas extends trianglecanvas_1.TriangleCanvas {
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
exports.OutputTriangleCanvas = OutputTriangleCanvas;


/***/ }),

/***/ "./src/trianglecanvas.ts":
/*!*******************************!*\
  !*** ./src/trianglecanvas.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TriangleCanvas = exports.TriangleCanvasConfig = exports.ColorGenerator = void 0;
class ColorGenerator {
    constructor(generate) {
        this.generate = generate;
    }
}
exports.ColorGenerator = ColorGenerator;
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
exports.TriangleCanvasConfig = TriangleCanvasConfig;
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
exports.TriangleCanvas = TriangleCanvas;


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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const trianglecanvas_1 = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");
const calculation_1 = __webpack_require__(/*! ./calculation */ "./src/calculation.ts");
const inputtrianglecanvas_1 = __webpack_require__(/*! ./inputtrianglecanvas */ "./src/inputtrianglecanvas.ts");
const outputtrianglecanvas_1 = __webpack_require__(/*! ./outputtrianglecanvas */ "./src/outputtrianglecanvas.ts");
let canvas = new inputtrianglecanvas_1.InputTriangleCanvas(new inputtrianglecanvas_1.InputTriangleCanvasConfig({
    color: "white",
    lineWidth: 2,
    pointSize: 8,
    canvasId: "canvas",
    anchorRadius: 50,
    useGrid: true,
    gridCellSize: 40,
    gridLineWidth: 20
}));
let connectionsCanvas = new outputtrianglecanvas_1.OutputTriangleCanvas(new outputtrianglecanvas_1.OutputTriangleCanvasConfig({
    color: new trianglecanvas_1.ColorGenerator(() => "#" +
        ("00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6) +
        "50"),
    lineWidth: 3,
    pointSize: 8,
    canvasId: "connections"
}));
let showTriangleIndex = 0;
let trianglecanvas = new outputtrianglecanvas_1.OutputTriangleCanvas(new outputtrianglecanvas_1.OutputTriangleCanvasConfig({
    color: "black",
    lineWidth: 2,
    pointSize: 4,
    canvasId: "triangles",
}));
let calculator = new calculation_1.TrianglesCalculator();
document.getElementById("clear")?.addEventListener("click", () => {
    canvas.clearAll();
    connectionsCanvas.clearCanvas();
    trianglecanvas.clearCanvas();
});
document.getElementById("btn-prev")?.addEventListener("click", () => {
    if (showTriangleIndex > 0)
        showTriangleIndex--;
    trianglecanvas.clearCanvas();
    trianglecanvas.drawTriangles(calculator.triangles, "grey");
    trianglecanvas.drawTriangle(calculator.triangles[showTriangleIndex], "red", 4);
});
document.getElementById("btn-next")?.addEventListener("click", () => {
    if (showTriangleIndex < calculator.triangles.length - 1)
        showTriangleIndex++;
    trianglecanvas.clearCanvas();
    trianglecanvas.drawTriangles(calculator.triangles, "grey");
    trianglecanvas.drawTriangle(calculator.triangles[showTriangleIndex], "red", 4);
});
document.getElementById("calc")?.addEventListener("click", () => {
    calculator.calc(canvas.lines);
    connectionsCanvas.drawLines(calculator.connections);
    connectionsCanvas.drawPoints(calculator.points, "red");
    trianglecanvas.drawTriangles(calculator.triangles, "grey");
    trianglecanvas.drawTriangle(calculator.triangles[showTriangleIndex], "red", 4);
    document.getElementById("triangles-count").textContent = String(calculator.triangles.length);
    document.getElementById("points-count").textContent = String(calculator.points.length);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDOUIsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7S0FDL0I7SUFFRCxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN0QixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUV0QixPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksWUFBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQzdFLENBQUM7QUFqQ0QsMERBaUNDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsS0FBVyxFQUFFLEtBQVc7SUFDeEQsSUFBSSxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckUsSUFBSSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsQ0FBQztJQUNwQyxJQUFJLE9BQWUsRUFBRSxPQUFlLENBQUM7SUFFckMsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDMUQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFFdEQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDMUQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUss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QUM7SUFDN0IsY0FBYyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNELGNBQWMsQ0FBQyxZQUFZLENBQ3pCLFVBQVUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsRUFDdkMsS0FBSyxFQUNMLENBQUMsQ0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDOUQsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwRCxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV2RCxjQUFjLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0QsY0FBYyxDQUFDLFlBQVksQ0FDekIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUN2QyxLQUFLLEVBQ0wsQ0FBQyxDQUNGLENBQUM7SUFHQSxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUMxQyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUdsRCxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FDdkMsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkQsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY2FsY3VsYXRpb24udHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2lucHV0dHJpYW5nbGVjYW52YXMudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL291dHB1dHRyaWFuZ2xlY2FudmFzLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy90cmlhbmdsZWNhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIFBvaW50LFxyXG4gIExpbmUsXHJcbiAgVHJpYW5nbGUsXHJcbiAgaXNQb2ludHNFcXVhbCxcclxuICBpc0xpbmVzRXF1YWwsXHJcbiAgaXNUcmlhbmdsZXNFcXVhbCxcclxufSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVzQ2FsY3VsYXRvckNvbmZpZyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVzQ2FsY3VsYXRvciB7XHJcbiAgcG9pbnRzOiBQb2ludFtdID0gW107XHJcbiAgbGluZXM6IExpbmVbXSA9IFtdO1xyXG4gIGNvbm5lY3Rpb25zOiBMaW5lW10gPSBbXTtcclxuICB0cmlhbmdsZXM6IFRyaWFuZ2xlW10gPSBbXTtcclxuICBzZWdtZW50c01hcDogTWFwPG51bWJlciwgUG9pbnRbXT4gPSBuZXcgTWFwPG51bWJlciwgUG9pbnRbXT4oKTtcclxuXHJcbiAgcHVibGljIGNhbGMobGluZXM6IExpbmVbXSkge1xyXG4gICAgdGhpcy5saW5lcyA9IGxpbmVzO1xyXG4gICAgdGhpcy5yZWNhbGNJbnRlcnNlY3Rpb25zKCk7XHJcbiAgICB0aGlzLnJlY2FsY0Nvbm5lY3Rpb25zKCk7XHJcbiAgICB0aGlzLnJlY2FsY1RyaWFuZ2xlcygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWNhbGNJbnRlcnNlY3Rpb25zKCkge1xyXG4gICAgdGhpcy5zZWdtZW50c01hcCA9IG5ldyBNYXA8bnVtYmVyLCBQb2ludFtdPigpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuc2V0KGksIFtdKTtcclxuICAgIH1cclxuICAgIHRoaXMucG9pbnRzID0gW107XHJcbiAgICBmb3IgKGxldCBsaW5lMSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgIHRoaXMucG9pbnRzLnB1c2gobGluZTEuc3RhcnQpO1xyXG4gICAgICB0aGlzLnBvaW50cy5wdXNoKGxpbmUxLmVuZCk7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMSkpPy5wdXNoKGxpbmUxLnN0YXJ0KTtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUxKSk/LnB1c2gobGluZTEuZW5kKTtcclxuICAgICAgZm9yIChsZXQgbGluZTIgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICAgIGxldCBpbnRlcnNlY3Rpb25Qb2ludCA9IGNoZWNrSW50ZXJzZWN0aW9uKGxpbmUxLCBsaW5lMik7XHJcbiAgICAgICAgaWYgKGludGVyc2VjdGlvblBvaW50ICE9IG51bGwpIHtcclxuICAgICAgICAgIHRoaXMuc2VnbWVudHNNYXBcclxuICAgICAgICAgICAgLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTEpKVxyXG4gICAgICAgICAgICA/LnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgdGhpcy5zZWdtZW50c01hcFxyXG4gICAgICAgICAgICAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMikpXHJcbiAgICAgICAgICAgID8ucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgICB0aGlzLnBvaW50cy5wdXNoKGludGVyc2VjdGlvblBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBvaW50cyA9IHRoaXMucG9pbnRzLmZpbHRlcihcclxuICAgICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHApID0+IGlzUG9pbnRzRXF1YWwocCwgdmFsdWUpKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVjYWxjQ29ubmVjdGlvbnMoKSB7XHJcbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gW107XHJcbiAgICBmb3IgKGxldCBpbnRlcnNlY3Rpb25Qb2ludHMgb2YgdGhpcy5zZWdtZW50c01hcC52YWx1ZXMoKSkge1xyXG4gICAgICBmb3IgKGxldCBwMSBvZiBpbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgICBmb3IgKGxldCBwMiBvZiBpbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgICAgIGlmICghaXNQb2ludHNFcXVhbChwMSwgcDIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChuZXcgTGluZShwMSwgcDIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gdGhpcy5jb25uZWN0aW9ucy5maWx0ZXIoXHJcbiAgICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChsKSA9PiBpc0xpbmVzRXF1YWwobCwgdmFsdWUpKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVjYWxjVHJpYW5nbGVzKCkge1xyXG4gICAgdGhpcy50cmlhbmdsZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGwxIG9mIHRoaXMuY29ubmVjdGlvbnMpIHtcclxuICAgICAgZm9yIChsZXQgbDIgb2YgdGhpcy5jb25uZWN0aW9ucykge1xyXG4gICAgICAgIGZvciAobGV0IGwzIG9mIHRoaXMuY29ubmVjdGlvbnMpIHtcclxuICAgICAgICAgIGlmIChsMSA9PSBsMiB8fCBsMSA9PSBsMyB8fCBsMiA9PSBsMykgY29udGludWU7XHJcbiAgICAgICAgICBsZXQgdHJpYW5nbGUgPSBsaW5lc1RvVHJpYW5nbGUobDEsIGwyLCBsMyk7XHJcbiAgICAgICAgICBpZiAodHJpYW5nbGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKHRyaWFuZ2xlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMudHJpYW5nbGVzID0gdGhpcy50cmlhbmdsZXMuZmlsdGVyKFxyXG4gICAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgodCkgPT4gaXNUcmlhbmdsZXNFcXVhbCh0LCB2YWx1ZSkpXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGluZXNUb1RyaWFuZ2xlKGwxOiBMaW5lLCBsMjogTGluZSwgbDM6IExpbmUpOiBUcmlhbmdsZSB8IG51bGwge1xyXG4gIGxldCBocG9pbnRzID0gW2wxLnN0YXJ0LCBsMS5lbmQsIGwyLnN0YXJ0LCBsMi5lbmQsIGwzLnN0YXJ0LCBsMy5lbmRdO1xyXG4gIGhwb2ludHMgPSBocG9pbnRzLmZpbHRlcihcclxuICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgocCkgPT4gaXNQb2ludHNFcXVhbChwLCB2YWx1ZSkpXHJcbiAgKTtcclxuICBpZiAoaHBvaW50cy5sZW5ndGggIT0gMykgcmV0dXJuIG51bGw7XHJcblxyXG4gIHZhciBhID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGwxLnN0YXJ0LCBsMS5lbmQpO1xyXG4gIHZhciBiID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGwyLnN0YXJ0LCBsMi5lbmQpO1xyXG4gIHZhciBjID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGwzLnN0YXJ0LCBsMy5lbmQpO1xyXG5cclxuICBpZiAoYSA+IGIgKyBjIHx8IGIgPiBhICsgYyB8fCBjID4gYSArIGIpIHJldHVybiBudWxsO1xyXG4gIGNvbnN0IHAgPSAoYSArIGIgKyBjKSAvIDI7XHJcbiAgbGV0IFMgPSAocCAqIChwIC0gYSkgKiAocCAtIGIpICogKHAgLSBjKSkgKiogMC41O1xyXG4gIGlmIChpc05hTihTKSB8fCBNYXRoLmFicyhTKSA8PSAxKSByZXR1cm4gbnVsbDtcclxuICByZXR1cm4gbmV3IFRyaWFuZ2xlKGhwb2ludHNbMF0sIGhwb2ludHNbMV0sIGhwb2ludHNbMl0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhQb2ludChcclxuICBwb2ludDogUG9pbnQsXHJcbiAgcG9pbnRzOiBQb2ludFtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgdG9Qb2ludCBvZiBwb2ludHMpIHtcclxuICAgIGxldCBkaXN0YWNlID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCB0b1BvaW50KTtcclxuICAgIGlmIChkaXN0YWNlIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5EaXN0ID0gZGlzdGFjZTtcclxuICAgICAgbWluUG9pbnQgPSB0b1BvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMoXHJcbiAgcG9pbnQ6IFBvaW50LFxyXG4gIGxpbmVzOiBMaW5lW10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICBsZXQgZGlzdFN0YXJ0ID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBsaW5lLnN0YXJ0KTtcclxuICAgIGxldCBkaXN0RW5kID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBsaW5lLmVuZCk7XHJcblxyXG4gICAgaWYgKE1hdGgubWluKGRpc3RTdGFydCwgZGlzdEVuZCkgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pblBvaW50ID0gZGlzdFN0YXJ0IDwgZGlzdEVuZCA/IGxpbmUuc3RhcnQgOiBsaW5lLmVuZDtcclxuICAgICAgbWluRGlzdCA9IE1hdGgubWluKGRpc3RTdGFydCwgZGlzdEVuZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZShcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBwZCA9IGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKHBvaW50LCBsaW5lKTtcclxuICAgIGlmIChwZC5kaXN0YWNlIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5EaXN0ID0gcGQuZGlzdGFjZTtcclxuICAgICAgbWluUG9pbnQgPSBwZC5wb2ludDtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHAxOiBQb2ludCwgcDI6IFBvaW50KTogbnVtYmVyIHtcclxuICByZXR1cm4gTWF0aC5zcXJ0KChwMS54IC0gcDIueCkgKiogMiArIChwMS55IC0gcDIueSkgKiogMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUZyb21Qb2ludFRvTGluZShcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZTogTGluZVxyXG4pOiB7IHBvaW50OiBQb2ludDsgZGlzdGFjZTogbnVtYmVyIH0ge1xyXG4gIGNvbnN0IEEgPSBwb2ludC54IC0gbGluZS5zdGFydC54O1xyXG4gIGNvbnN0IEIgPSBwb2ludC55IC0gbGluZS5zdGFydC55O1xyXG4gIGNvbnN0IEMgPSBsaW5lLmVuZC54IC0gbGluZS5zdGFydC54O1xyXG4gIGNvbnN0IEQgPSBsaW5lLmVuZC55IC0gbGluZS5zdGFydC55O1xyXG5cclxuICBsZXQgZG90ID0gQSAqIEMgKyBCICogRDtcclxuICBsZXQgbGVuX3NxID0gQyAqIEMgKyBEICogRDtcclxuICBsZXQgcGFyYW0gPSAtMTtcclxuICBpZiAobGVuX3NxICE9IDApIHtcclxuICAgIHBhcmFtID0gZG90IC8gbGVuX3NxO1xyXG4gIH1cclxuICBsZXQgeHggPSAwO1xyXG4gIGxldCB5eSA9IDA7XHJcblxyXG4gIGlmIChwYXJhbSA8IDApIHtcclxuICAgIHh4ID0gbGluZS5zdGFydC54O1xyXG4gICAgeXkgPSBsaW5lLnN0YXJ0Lnk7XHJcbiAgfSBlbHNlIGlmIChwYXJhbSA+IDEpIHtcclxuICAgIHh4ID0gbGluZS5lbmQueDtcclxuICAgIHl5ID0gbGluZS5lbmQueTtcclxuICB9IGVsc2Uge1xyXG4gICAgeHggPSBsaW5lLnN0YXJ0LnggKyBwYXJhbSAqIEM7XHJcbiAgICB5eSA9IGxpbmUuc3RhcnQueSArIHBhcmFtICogRDtcclxuICB9XHJcblxyXG4gIGxldCBkeCA9IHBvaW50LnggLSB4eDtcclxuICBsZXQgZHkgPSBwb2ludC55IC0geXk7XHJcblxyXG4gIHJldHVybiB7IHBvaW50OiBuZXcgUG9pbnQoeHgsIHl5KSwgZGlzdGFjZTogTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJbnRlcnNlY3Rpb24obGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogUG9pbnQgfCBudWxsIHtcclxuICBsZXQgY2hlY2tlZFBvaW50cyA9IFtsaW5lMS5zdGFydCwgbGluZTEuZW5kLCBsaW5lMi5zdGFydCwgbGluZTIuZW5kXTtcclxuICBsZXQgQTogbnVtYmVyLCBCOiBudW1iZXIsIEM6IG51bWJlcjtcclxuICBsZXQgcG9pbnR4eDogbnVtYmVyLCBwb2ludHl5OiBudW1iZXI7XHJcblxyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5zdGFydCkpIHJldHVybiBsaW5lMS5zdGFydDtcclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMiwgbGluZTEuZW5kKSkgcmV0dXJuIGxpbmUxLmVuZDtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLnN0YXJ0KSkgcmV0dXJuIGxpbmUyLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUxLCBsaW5lMi5lbmQpKSByZXR1cm4gbGluZTIuZW5kO1xyXG5cclxuICByZXR1cm4gVGVtcENoZWNrKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGlzUG9pbnRPbkxpbmUobDogTGluZSwgYzogUG9pbnQpOiBib29sZWFuIHtcclxuICAgIGxldCBwMSA9IGwuc3RhcnQ7XHJcbiAgICBsZXQgcDIgPSBsLmVuZDtcclxuXHJcbiAgICBsZXQgZHgxID0gcDIueCAtIHAxLng7XHJcbiAgICBsZXQgZHkxID0gcDIueSAtIHAxLnk7XHJcblxyXG4gICAgbGV0IGR4ID0gYy54IC0gcDEueDtcclxuICAgIGxldCBkeSA9IGMueSAtIHAxLnk7XHJcblxyXG4gICAgbGV0IFMgPSBkeDEgKiBkeSAtIGR4ICogZHkxO1xyXG4gICAgbGV0IGFiID0gTWF0aC5zcXJ0KGR4MSAqIGR4MSArIGR5MSAqIGR5MSk7XHJcbiAgICBsZXQgaCA9IFMgLyBhYjtcclxuICAgIHJldHVybiBNYXRoLmFicyhoKSA8IDAuMTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFZFSyhheDogbnVtYmVyLCBheTogbnVtYmVyLCBieDogbnVtYmVyLCBieTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gYXggKiBieSAtIGJ4ICogYXk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBDcm9zc2luZ0NoZWNrKHAxOiBQb2ludCwgcDI6IFBvaW50LCBwMzogUG9pbnQsIHA0OiBQb2ludCkge1xyXG4gICAgbGV0IHYxLCB2MiwgdjMsIHY0O1xyXG5cclxuICAgIHYxID0gVkVLKHA0LnggLSBwMy54LCBwNC55IC0gcDMueSwgcDEueCAtIHAzLngsIHAxLnkgLSBwMy55KTtcclxuICAgIHYyID0gVkVLKHA0LnggLSBwMy54LCBwNC55IC0gcDMueSwgcDIueCAtIHAzLngsIHAyLnkgLSBwMy55KTtcclxuICAgIHYzID0gVkVLKHAyLnggLSBwMS54LCBwMi55IC0gcDEueSwgcDMueCAtIHAxLngsIHAzLnkgLSBwMS55KTtcclxuICAgIHY0ID0gVkVLKHAyLnggLSBwMS54LCBwMi55IC0gcDEueSwgcDQueCAtIHAxLngsIHA0LnkgLSBwMS55KTtcclxuICAgIGlmICh2MSAqIHYyIDwgMCAmJiB2MyAqIHY0IDwgMCkgcmV0dXJuIHRydWU7XHJcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEVxdWF0aW9uT2ZUaGVMaW5lKHAxOiBQb2ludCwgcDI6IFBvaW50KSB7XHJcbiAgICBBID0gcDIueSAtIHAxLnk7XHJcbiAgICBCID0gcDEueCAtIHAyLng7XHJcbiAgICBDID0gLXAxLnggKiAocDIueSAtIHAxLnkpICsgcDEueSAqIChwMi54IC0gcDEueCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBJbnRlcnNlY3Rpb25YKFxyXG4gICAgYTE6IG51bWJlcixcclxuICAgIGIxOiBudW1iZXIsXHJcbiAgICBjMTogbnVtYmVyLFxyXG4gICAgYTI6IG51bWJlcixcclxuICAgIGIyOiBudW1iZXIsXHJcbiAgICBjMjogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICBsZXQgZCwgZHgsIHBvaW50eDtcclxuICAgIGQgPSBhMSAqIGIyIC0gYjEgKiBhMjtcclxuICAgIGR4ID0gLWMxICogYjIgKyBiMSAqIGMyO1xyXG4gICAgcG9pbnR4ID0gZHggLyBkO1xyXG4gICAgcmV0dXJuIHBvaW50eDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblkoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeSwgcG9pbnR5O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHkgPSAtYTEgKiBjMiArIGMxICogYTI7XHJcbiAgICBwb2ludHkgPSBkeSAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR5O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVGVtcENoZWNrKCk6IFBvaW50IHwgbnVsbCB7XHJcbiAgICBpZiAoXHJcbiAgICAgIENyb3NzaW5nQ2hlY2soXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1swXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzFdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMl0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1szXVxyXG4gICAgICApXHJcbiAgICApIHtcclxuICAgICAgbGV0IGExLCBiMSwgYzEsIGEyLCBiMiwgYzI7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMF0sIGNoZWNrZWRQb2ludHNbMV0pO1xyXG4gICAgICBhMSA9IEE7XHJcbiAgICAgIGIxID0gQjtcclxuICAgICAgYzEgPSBDO1xyXG4gICAgICBFcXVhdGlvbk9mVGhlTGluZShjaGVja2VkUG9pbnRzWzJdLCBjaGVja2VkUG9pbnRzWzNdKTtcclxuICAgICAgYTIgPSBBO1xyXG4gICAgICBiMiA9IEI7XHJcbiAgICAgIGMyID0gQztcclxuICAgICAgcG9pbnR4eCA9IEludGVyc2VjdGlvblgoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHBvaW50eXkgPSBJbnRlcnNlY3Rpb25ZKGExLCBiMSwgYzEsIGEyLCBiMiwgYzIpO1xyXG4gICAgICByZXR1cm4gbmV3IFBvaW50KHBvaW50eHgsIHBvaW50eXkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cclxuXHJcbiAgcHVibGljIGNsb25lKCk6IFBvaW50IHtcclxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogUG9pbnQsIHB1YmxpYyBlbmQ6IFBvaW50KSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwMTogUG9pbnQsIHB1YmxpYyBwMjogUG9pbnQsIHB1YmxpYyBwMzogUG9pbnQpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50c0VxdWFsKGE6IFBvaW50LCBiOiBQb2ludCwgYWxwaGE6IG51bWJlciA9IDEpOiBib29sZWFuIHtcclxuICByZXR1cm4gTWF0aC5hYnMoYS54IC0gYi54KSA8PSBhbHBoYSAmJiBNYXRoLmFicyhhLnkgLSBiLnkpIDw9IGFscGhhO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNMaW5lc0VxdWFsKGE6IExpbmUsIGI6IExpbmUsIGFscGhhOiBudW1iZXIgPSAxKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIChpc1BvaW50c0VxdWFsKGEuc3RhcnQsIGIuc3RhcnQsIGFscGhhKSAmJiBpc1BvaW50c0VxdWFsKGEuZW5kLCBiLmVuZCwgYWxwaGEpKSB8fFxyXG4gICAgKGlzUG9pbnRzRXF1YWwoYS5lbmQsIGIuc3RhcnQsIGFscGhhKSAmJiBpc1BvaW50c0VxdWFsKGEuc3RhcnQsIGIuZW5kLCBhbHBoYSkpXHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJpYW5nbGVzRXF1YWwoYTogVHJpYW5nbGUsIGI6IFRyaWFuZ2xlLCBhbHBoYTogbnVtYmVyID0gMSk6IGJvb2xlYW4ge1xyXG4gIGxldCBlcXVhbHMgPSAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAxLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMSwgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDEsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAyLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMiwgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDIsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAzLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMywgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDMsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIHJldHVybiBlcXVhbHMgPT09IDM7XHJcbn0iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcbmltcG9ydCB7IFRyaWFuZ2xlQ2FudmFzLCBUcmlhbmdsZUNhbnZhc0NvbmZpZyB9IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcbmltcG9ydCB7XHJcbiAgY2hlY2tJbnRlcnNlY3Rpb24sXHJcbiAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzLFxyXG4gIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lLFxyXG4gIG1lcmdlUG9pbnRXaXRoTGluZSxcclxuICBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMsXHJcbiAgbWVyZ2VQb2ludFdpdGhQb2ludCxcclxufSBmcm9tIFwiLi9jYWxjdWxhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0VHJpYW5nbGVDYW52YXNDb25maWcgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyB7XHJcbiAgcHVibGljIGFuY2hvclJhZGl1czogbnVtYmVyID0gNTA7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgc3VwZXIoaW5pdCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGluaXQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0VHJpYW5nbGVDYW52YXMgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhcyB7XHJcbiAgbGluZXM6IExpbmVbXSA9IFtdO1xyXG4gIGludGVyc2VjdGlvblBvaW50czogUG9pbnRbXSA9IFtdO1xyXG5cclxuICBtb3VzZVBvczogUG9pbnQgPSBuZXcgUG9pbnQoMCwgMCk7XHJcbiAgc2VsZWN0ZWRQb2ludDogUG9pbnQgfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcgYXMgVHJpYW5nbGVDYW52YXNDb25maWcpO1xyXG4gICAgdGhpcy5ydW5Vc2VyRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xlYXJBbGwoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLmxpbmVzID0gW107XHJcbiAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVNb3VzZVBvcyhlOiBQb2ludGVyRXZlbnQpIHtcclxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB0aGlzLm1vdXNlUG9zLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICB0aGlzLm1vdXNlUG9zLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWVyZ2VQb2ludFdpdGhJbnRlcnNlY3Rpb25Qb2ludHMocG9pbnQ6IFBvaW50KTogYm9vbGVhbiB7XHJcbiAgICBpZiAoXHJcbiAgICAgIG1lcmdlUG9pbnRXaXRoUG9pbnQoXHJcbiAgICAgICAgcG9pbnQsXHJcbiAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMsXHJcbiAgICAgICAgdGhpcy5jb25maWcuYW5jaG9yUmFkaXVzXHJcbiAgICAgIClcclxuICAgIClcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1lcmdlUG9pbnRXaXRoR3JpZChwb2ludDogUG9pbnQpOiBib29sZWFuIHtcclxuICAgIGxldCBzaXplID0gdGhpcy5jb25maWcuZ3JpZENlbGxTaXplO1xyXG4gICAgbGV0IGN4ID0gTWF0aC5mbG9vcihwb2ludC54IC8gc2l6ZSk7XHJcbiAgICBsZXQgY3kgPSBNYXRoLmZsb29yKHBvaW50LnkgLyBzaXplKTtcclxuICAgIGxldCBzdGFydFBvaW50ID0gbmV3IFBvaW50KGN4ICogc2l6ZSwgY3kgKiBzaXplKTtcclxuICAgIGxldCBncmlkUG9pbnRzID0gW1xyXG4gICAgICBzdGFydFBvaW50LFxyXG4gICAgICBuZXcgUG9pbnQoc3RhcnRQb2ludC54ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplLCBzdGFydFBvaW50LnkpLFxyXG4gICAgICBuZXcgUG9pbnQoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnkgKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUpLFxyXG4gICAgICBuZXcgUG9pbnQoXHJcbiAgICAgICAgc3RhcnRQb2ludC54ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplLFxyXG4gICAgICAgIHN0YXJ0UG9pbnQueSArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZVxyXG4gICAgICApLFxyXG4gICAgXTtcclxuICAgIGlmIChtZXJnZVBvaW50V2l0aFBvaW50KHBvaW50LCBncmlkUG9pbnRzLCB0aGlzLmNvbmZpZy5hbmNob3JSYWRpdXMpKVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkSW50ZXJzZWN0aW9uUG9pbnQobGluZTogTGluZSkge1xyXG4gICAgZm9yIChsZXQgd2l0aExpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICBsZXQgcG9pbnQgPSBjaGVja0ludGVyc2VjdGlvbihsaW5lLCB3aXRoTGluZSk7XHJcbiAgICAgIGlmIChwb2ludCAhPSBudWxsKSB0aGlzLmludGVyc2VjdGlvblBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29ycmVjdE1vdXNlUG9pbnQoKSB7XHJcbiAgICBsZXQgcmVzID0gZmFsc2U7XHJcbiAgICBpZiAoIXJlcykgcmVzID0gdGhpcy5tZXJnZVBvaW50V2l0aEludGVyc2VjdGlvblBvaW50cyh0aGlzLm1vdXNlUG9zKTtcclxuICAgIGlmICghcmVzKVxyXG4gICAgICByZXMgPSBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMoXHJcbiAgICAgICAgdGhpcy5tb3VzZVBvcyxcclxuICAgICAgICB0aGlzLmxpbmVzLFxyXG4gICAgICAgIHRoaXMuY29uZmlnLmFuY2hvclJhZGl1c1xyXG4gICAgICApO1xyXG4gICAgaWYgKCFyZXMpXHJcbiAgICAgIHJlcyA9IG1lcmdlUG9pbnRXaXRoTGluZShcclxuICAgICAgICB0aGlzLm1vdXNlUG9zLFxyXG4gICAgICAgIHRoaXMubGluZXMsXHJcbiAgICAgICAgdGhpcy5jb25maWcuYW5jaG9yUmFkaXVzXHJcbiAgICAgICk7XHJcbiAgICBpZiAoIXJlcyAmJiB0aGlzLmNvbmZpZy51c2VHcmlkKVxyXG4gICAgICByZXMgPSB0aGlzLm1lcmdlUG9pbnRXaXRoR3JpZCh0aGlzLm1vdXNlUG9zKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29ycmVjdFNlbGVjdGVkUG9pbnQoKSB7XHJcbiAgICBsZXQgcG9pbnQgPSBuZXcgUG9pbnQodGhpcy5tb3VzZVBvcy54LCB0aGlzLm1vdXNlUG9zLnkpO1xyXG4gICAgbGV0IHJlcyA9IGZhbHNlO1xyXG4gICAgaWYgKCFyZXMpIHJlcyA9IHRoaXMubWVyZ2VQb2ludFdpdGhJbnRlcnNlY3Rpb25Qb2ludHMocG9pbnQpO1xyXG4gICAgaWYgKCFyZXMpIHJlcyA9IG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICAgICAgcG9pbnQsXHJcbiAgICAgIHRoaXMubGluZXMsXHJcbiAgICAgIHRoaXMuY29uZmlnLmFuY2hvclJhZGl1c1xyXG4gICAgKTtcclxuICAgIGlmICghcmVzKVxyXG4gICAgICByZXMgPSBtZXJnZVBvaW50V2l0aExpbmUocG9pbnQsIHRoaXMubGluZXMsIHRoaXMuY29uZmlnLmFuY2hvclJhZGl1cyk7XHJcbiAgICBpZiAoIXJlcyAmJiB0aGlzLmNvbmZpZy51c2VHcmlkKSByZXMgPSB0aGlzLm1lcmdlUG9pbnRXaXRoR3JpZChwb2ludCk7XHJcbiAgICB0aGlzLnNlbGVjdGVkUG9pbnQgPSBwb2ludC5jbG9uZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWRyYXcoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZShsaW5lLnN0YXJ0LCBsaW5lLmVuZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQobGluZS5zdGFydCk7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KGxpbmUuZW5kKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IHBvaW50IG9mIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzKSB7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KHBvaW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcnVuVXNlckV2ZW50cygpIHtcclxuICAgIGxldCBjYW52YXMgPSB0aGlzLmNhbnZhc0VsZW1lbnQ7XHJcblxyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLnBvaW50ZXJkb3duRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCB0aGlzLnBvaW50ZXJ1cEV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsICgpID0+IHt9LCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMucG9pbnRlcm1vdmVFdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcm1vdmVFdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICB0aGlzLnVwZGF0ZU1vdXNlUG9zKGUpO1xyXG4gICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuXHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZFBvaW50ICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZSh0aGlzLnNlbGVjdGVkUG9pbnQsIHRoaXMubW91c2VQb3MpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcmRvd25FdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICB0aGlzLnVwZGF0ZU1vdXNlUG9zKGUpO1xyXG4gICAgdGhpcy5jb3JyZWN0U2VsZWN0ZWRQb2ludCgpO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcnVwRXZlbnRIYW5kbGVyID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRQb2ludCA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0TW91c2VQb2ludCgpO1xyXG4gICAgbGV0IGxpbmUgPSBuZXcgTGluZSh0aGlzLnNlbGVjdGVkUG9pbnQuY2xvbmUoKSwgdGhpcy5tb3VzZVBvcy5jbG9uZSgpKTtcclxuICAgIHRoaXMuYWRkSW50ZXJzZWN0aW9uUG9pbnQobGluZSk7XHJcbiAgICB0aGlzLmxpbmVzLnB1c2gobGluZSk7XHJcbiAgICB0aGlzLnNlbGVjdGVkUG9pbnQgPSBudWxsO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSB9IGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IHtcclxuICBDb2xvckdlbmVyYXRvcixcclxuICBUcmlhbmdsZUNhbnZhcyxcclxuICBUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi90cmlhbmdsZWNhbnZhc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnIGV4dGVuZHMgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZz4pIHtcclxuICAgIHN1cGVyKGluaXQpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBPdXRwdXRUcmlhbmdsZUNhbnZhcyBleHRlbmRzIFRyaWFuZ2xlQ2FudmFzIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgc3VwZXIoY29uZmlnIGFzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3TGluZXMoXHJcbiAgICBsaW5lczogTGluZVtdLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZShsaW5lLnN0YXJ0LCBsaW5lLmVuZCwgY29sb3IsIGxpbmVXaWR0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1BvaW50cyhcclxuICAgIHBvaW50czogUG9pbnRbXSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIHBvaW50U2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcucG9pbnRTaXplXHJcbiAgKSB7XHJcbiAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpIHtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQocG9pbnQsIGNvbG9yLCBwb2ludFNpemUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdUcmlhbmdsZXMoXHJcbiAgICB0cmlhbmdsZXM6IFRyaWFuZ2xlW10sXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgZm9yIChsZXQgdHJpYW5nbGUgb2YgdHJpYW5nbGVzKSB7XHJcbiAgICAgIHRoaXMuZHJhd1RyaWFuZ2xlKHRyaWFuZ2xlLCBjb2xvciwgbGluZVdpZHRoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yR2VuZXJhdG9yIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2VuZXJhdGU6ICgpID0+IHN0cmluZykge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIHtcclxuICBwdWJsaWMgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID1cclxuICAgIFwiIzAwMDAwMFwiO1xyXG4gIHB1YmxpYyBsaW5lV2lkdGg6IG51bWJlciA9IDM7XHJcbiAgcHVibGljIHBvaW50U2l6ZTogbnVtYmVyID0gNTtcclxuICBwdWJsaWMgY2FudmFzSWQ6IHN0cmluZyA9IFwiY2FudmFzXCI7XHJcblxyXG4gIHB1YmxpYyB1c2VHcmlkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGdyaWRDb2xvcjogc3RyaW5nID0gXCIjNTA1MDUwXCI7XHJcbiAgcHVibGljIGdyaWRMaW5lV2lkdGg6IG51bWJlciA9IDE7XHJcbiAgcHVibGljIGdyaWRDZWxsU2l6ZTogbnVtYmVyID0gNDA7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxUcmlhbmdsZUNhbnZhc0NvbmZpZz4pIHtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgaW5pdCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDYW52YXMge1xyXG4gIGNhbnZhc0VsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICBvblJlc2l6ZSA9IChlOiBVSUV2ZW50KSA9PiB7XHJcbiAgICBsZXQgdGVtcCA9IHRoaXMuY3R4LmdldEltYWdlRGF0YShcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0XHJcbiAgICApO1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodCA9IHRoaXMuY2FudmFzRWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICB0aGlzLmN0eC5wdXRJbWFnZURhdGEodGVtcCwgMCwgMCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogVHJpYW5nbGVDYW52YXNDb25maWcpIHtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBjb25maWcuY2FudmFzSWRcclxuICAgICkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMub25SZXNpemUsIGZhbHNlKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXNFbGVtZW50LmdldENvbnRleHQoXCIyZFwiLCB7XHJcbiAgICAgIHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSxcclxuICAgIH0pIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcbiAgICBpZiAodGhpcy5jb25maWcudXNlR3JpZCkge1xyXG4gICAgICB0aGlzLmRyYXdHcmlkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0dyaWQoXHJcbiAgICBjb2xvcjogc3RyaW5nID0gdGhpcy5jb25maWcuZ3JpZENvbG9yLFxyXG4gICAgc2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcuZ3JpZENlbGxTaXplXHJcbiAgKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAxO1xyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDw9IHRoaXMuY2FudmFzRWxlbWVudC53aWR0aDsgeCArPSBzaXplKSB7XHJcbiAgICAgIHRoaXMuY3R4Lm1vdmVUbyh4ICsgMC41LCAwKTtcclxuICAgICAgdGhpcy5jdHgubGluZVRvKHggKyAwLjUsIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDw9IHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQ7IHkgKz0gc2l6ZSkge1xyXG4gICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgeSArIDAuNSk7XHJcbiAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsIHkgKyAwLjUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdMaW5lKFxyXG4gICAgZnJvbTogUG9pbnQsXHJcbiAgICB0bzogUG9pbnQsXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvckdlbmVyYXRvcilcclxuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xyXG4gICAgdGhpcy5jdHgubW92ZVRvKGZyb20ueCwgZnJvbS55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0by54LCB0by55KTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdQb2ludChcclxuICAgIHBvaW50OiBQb2ludCxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIHBvaW50U2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcucG9pbnRTaXplXHJcbiAgKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yR2VuZXJhdG9yKSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgIGxldCBzaXplID0gcG9pbnRTaXplO1xyXG4gICAgdGhpcy5jdHguZmlsbFJlY3QocG9pbnQueCAtIHNpemUgLyAyLCBwb2ludC55IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1RyaWFuZ2xlKFxyXG4gICAgdHJpYW5nbGU6IFRyaWFuZ2xlLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JHZW5lcmF0b3IpIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICB0aGlzLmN0eC5tb3ZlVG8odHJpYW5nbGUucDEueCwgdHJpYW5nbGUucDEueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDIueCwgdHJpYW5nbGUucDIueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDMueCwgdHJpYW5nbGUucDMueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDEueCwgdHJpYW5nbGUucDEueSk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbGVhckNhbnZhcygpIHtcclxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdChcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0XHJcbiAgICApO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLnVzZUdyaWQpIHtcclxuICAgICAgdGhpcy5kcmF3R3JpZCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQge1xyXG4gIENvbG9yR2VuZXJhdG9yLFxyXG4gIFRyaWFuZ2xlQ2FudmFzLFxyXG4gIFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcbmltcG9ydCB7IFRyaWFuZ2xlc0NhbGN1bGF0b3IgfSBmcm9tIFwiLi9jYWxjdWxhdGlvblwiO1xyXG5pbXBvcnQge1xyXG4gIElucHV0VHJpYW5nbGVDYW52YXMsXHJcbiAgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi9pbnB1dHRyaWFuZ2xlY2FudmFzXCI7XHJcbmltcG9ydCB7XHJcbiAgT3V0cHV0VHJpYW5nbGVDYW52YXMsXHJcbiAgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcsXHJcbn0gZnJvbSBcIi4vb3V0cHV0dHJpYW5nbGVjYW52YXNcIjtcclxuXHJcbmxldCBjYW52YXMgPSBuZXcgSW5wdXRUcmlhbmdsZUNhbnZhcyhcclxuICBuZXcgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyh7XHJcbiAgICBjb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgbGluZVdpZHRoOiAyLFxyXG4gICAgcG9pbnRTaXplOiA4LFxyXG4gICAgY2FudmFzSWQ6IFwiY2FudmFzXCIsXHJcbiAgICBhbmNob3JSYWRpdXM6IDUwLFxyXG4gICAgdXNlR3JpZDogdHJ1ZSxcclxuICAgIGdyaWRDZWxsU2l6ZTogNDAsXHJcbiAgICBncmlkTGluZVdpZHRoOiAyMFxyXG4gIH0pXHJcbik7XHJcblxyXG5sZXQgY29ubmVjdGlvbnNDYW52YXMgPSBuZXcgT3V0cHV0VHJpYW5nbGVDYW52YXMoXHJcbiAgbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKHtcclxuICAgIGNvbG9yOiBuZXcgQ29sb3JHZW5lcmF0b3IoXHJcbiAgICAgICgpID0+XHJcbiAgICAgICAgXCIjXCIgK1xyXG4gICAgICAgIChcclxuICAgICAgICAgIFwiMDAwMDBcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIE1hdGgucG93KDE2LCA2KSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgKS5zbGljZSgtNikgK1xyXG4gICAgICAgIFwiNTBcIlxyXG4gICAgKSxcclxuICAgIGxpbmVXaWR0aDogMyxcclxuICAgIHBvaW50U2l6ZTogOCxcclxuICAgIGNhbnZhc0lkOiBcImNvbm5lY3Rpb25zXCJcclxuICB9KVxyXG4pO1xyXG5cclxubGV0IHNob3dUcmlhbmdsZUluZGV4ID0gMDtcclxubGV0IHRyaWFuZ2xlY2FudmFzID0gbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyh7XHJcbiAgICBjb2xvcjogXCJibGFja1wiLFxyXG4gICAgbGluZVdpZHRoOiAyLFxyXG4gICAgcG9pbnRTaXplOiA0LFxyXG4gICAgY2FudmFzSWQ6IFwidHJpYW5nbGVzXCIsXHJcbiAgfSlcclxuKTtcclxuXHJcbmxldCBjYWxjdWxhdG9yID0gbmV3IFRyaWFuZ2xlc0NhbGN1bGF0b3IoKTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xlYXJcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FudmFzLmNsZWFyQWxsKCk7XHJcbiAgY29ubmVjdGlvbnNDYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICB0cmlhbmdsZWNhbnZhcy5jbGVhckNhbnZhcygpO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLXByZXZcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYgKHNob3dUcmlhbmdsZUluZGV4ID4gMCkgc2hvd1RyaWFuZ2xlSW5kZXgtLTtcclxuICB0cmlhbmdsZWNhbnZhcy5jbGVhckNhbnZhcygpO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmRyYXdUcmlhbmdsZXMoY2FsY3VsYXRvci50cmlhbmdsZXMsIFwiZ3JleVwiKTtcclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGUoXHJcbiAgICBjYWxjdWxhdG9yLnRyaWFuZ2xlc1tzaG93VHJpYW5nbGVJbmRleF0sXHJcbiAgICBcInJlZFwiLFxyXG4gICAgNFxyXG4gICk7XHJcbn0pO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1uZXh0XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmIChzaG93VHJpYW5nbGVJbmRleCA8IGNhbGN1bGF0b3IudHJpYW5nbGVzLmxlbmd0aCAtIDEpIHNob3dUcmlhbmdsZUluZGV4Kys7XHJcbiAgdHJpYW5nbGVjYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGVzKGNhbGN1bGF0b3IudHJpYW5nbGVzLCBcImdyZXlcIik7XHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlKFxyXG4gICAgY2FsY3VsYXRvci50cmlhbmdsZXNbc2hvd1RyaWFuZ2xlSW5kZXhdLFxyXG4gICAgXCJyZWRcIixcclxuICAgIDRcclxuICApO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FsY1wiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjYWxjdWxhdG9yLmNhbGMoY2FudmFzLmxpbmVzKTtcclxuICBjb25uZWN0aW9uc0NhbnZhcy5kcmF3TGluZXMoY2FsY3VsYXRvci5jb25uZWN0aW9ucyk7XHJcbiAgY29ubmVjdGlvbnNDYW52YXMuZHJhd1BvaW50cyhjYWxjdWxhdG9yLnBvaW50cywgXCJyZWRcIik7XHJcblxyXG4gIHRyaWFuZ2xlY2FudmFzLmRyYXdUcmlhbmdsZXMoY2FsY3VsYXRvci50cmlhbmdsZXMsIFwiZ3JleVwiKTtcclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGUoXHJcbiAgICBjYWxjdWxhdG9yLnRyaWFuZ2xlc1tzaG93VHJpYW5nbGVJbmRleF0sXHJcbiAgICBcInJlZFwiLFxyXG4gICAgNFxyXG4gICk7XHJcblxyXG4gIChcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpYW5nbGVzLWNvdW50XCIpIGFzIEhUTUxTcGFuRWxlbWVudCB8IG51bGxcclxuICApLnRleHRDb250ZW50ID0gU3RyaW5nKGNhbGN1bGF0b3IudHJpYW5nbGVzLmxlbmd0aCk7XHJcblxyXG4gIChcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9pbnRzLWNvdW50XCIpIGFzIEhUTUxTcGFuRWxlbWVudCB8IG51bGxcclxuICApLnRleHRDb250ZW50ID0gU3RyaW5nKGNhbGN1bGF0b3IucG9pbnRzLmxlbmd0aCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=