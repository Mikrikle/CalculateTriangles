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
        this.mergeRadius = 50;
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
        if ((0, calculation_1.mergePointWithPoint)(point, this.intersectionPoints, this.config.mergeRadius))
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
        if ((0, calculation_1.mergePointWithPoint)(point, gridPoints, this.config.gridCellSize))
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
    correctPointPos(point) {
        let res = false;
        if (!res) {
            res = this.mergePointWithIntersectionPoints(point);
        }
        if (!res) {
            res = (0, calculation_1.mergePointWithLinePoints)(point, this.lines, this.config.mergeRadius * 2);
        }
        if (!res) {
            res = (0, calculation_1.mergePointWithLine)(point, this.lines, this.config.mergeRadius * 2);
        }
        if (!res && this.config.useGrid) {
            res = this.mergePointWithGrid(point);
        }
    }
    correctMousePoint() {
        this.correctPointPos(this.mousePos);
    }
    correctSelectedPoint() {
        let point = new core_1.Point(this.mousePos.x, this.mousePos.y);
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
    mergeRadius: 25,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDOUIsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7S0FDL0I7SUFFRCxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN0QixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUV0QixPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksWUFBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQzdFLENBQUM7QUFqQ0QsMERBaUNDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsS0FBVyxFQUFFLEtBQVc7SUFDeEQsSUFBSSxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckUsSUFBSSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsQ0FBQztJQUNwQyxJQUFJLE9BQWUsRUFBRSxPQUFlLENBQUM7SUFFckMsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDMUQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFFdEQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDMUQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUss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QUFDO0lBQzlCLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEQsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFdkQsY0FBYyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNELGNBQWMsQ0FBQyxZQUFZLENBQ3pCLFVBQVUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsRUFDdkMsS0FBSyxFQUNMLENBQUMsQ0FDRixDQUFDO0lBR0EsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FDMUMsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFHbEQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQ3ZDLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NhbGN1bGF0aW9uLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jb3JlLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9pbnB1dHRyaWFuZ2xlY2FudmFzLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9vdXRwdXR0cmlhbmdsZWNhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvdHJpYW5nbGVjYW52YXMudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBQb2ludCxcclxuICBMaW5lLFxyXG4gIFRyaWFuZ2xlLFxyXG4gIGlzUG9pbnRzRXF1YWwsXHJcbiAgaXNMaW5lc0VxdWFsLFxyXG4gIGlzVHJpYW5nbGVzRXF1YWwsXHJcbn0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlc0NhbGN1bGF0b3JDb25maWcge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlc0NhbGN1bGF0b3Ige1xyXG4gIHBvaW50czogUG9pbnRbXSA9IFtdO1xyXG4gIGxpbmVzOiBMaW5lW10gPSBbXTtcclxuICBjb25uZWN0aW9uczogTGluZVtdID0gW107XHJcbiAgdHJpYW5nbGVzOiBUcmlhbmdsZVtdID0gW107XHJcbiAgc2VnbWVudHNNYXA6IE1hcDxudW1iZXIsIFBvaW50W10+ID0gbmV3IE1hcDxudW1iZXIsIFBvaW50W10+KCk7XHJcblxyXG4gIHB1YmxpYyBjYWxjKGxpbmVzOiBMaW5lW10pIHtcclxuICAgIHRoaXMubGluZXMgPSBsaW5lcztcclxuICAgIHRoaXMucmVjYWxjSW50ZXJzZWN0aW9ucygpO1xyXG4gICAgdGhpcy5yZWNhbGNDb25uZWN0aW9ucygpO1xyXG4gICAgdGhpcy5yZWNhbGNUcmlhbmdsZXMoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVjYWxjSW50ZXJzZWN0aW9ucygpIHtcclxuICAgIHRoaXMuc2VnbWVudHNNYXAgPSBuZXcgTWFwPG51bWJlciwgUG9pbnRbXT4oKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLnNlZ21lbnRzTWFwLnNldChpLCBbXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG4gICAgZm9yIChsZXQgbGluZTEgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICB0aGlzLnBvaW50cy5wdXNoKGxpbmUxLnN0YXJ0KTtcclxuICAgICAgdGhpcy5wb2ludHMucHVzaChsaW5lMS5lbmQpO1xyXG4gICAgICB0aGlzLnNlZ21lbnRzTWFwLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTEpKT8ucHVzaChsaW5lMS5zdGFydCk7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMSkpPy5wdXNoKGxpbmUxLmVuZCk7XHJcbiAgICAgIGZvciAobGV0IGxpbmUyIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgICBsZXQgaW50ZXJzZWN0aW9uUG9pbnQgPSBjaGVja0ludGVyc2VjdGlvbihsaW5lMSwgbGluZTIpO1xyXG4gICAgICAgIGlmIChpbnRlcnNlY3Rpb25Qb2ludCAhPSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLnNlZ21lbnRzTWFwXHJcbiAgICAgICAgICAgIC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUxKSlcclxuICAgICAgICAgICAgPy5wdXNoKGludGVyc2VjdGlvblBvaW50KTtcclxuICAgICAgICAgIHRoaXMuc2VnbWVudHNNYXBcclxuICAgICAgICAgICAgLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTIpKVxyXG4gICAgICAgICAgICA/LnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgdGhpcy5wb2ludHMucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wb2ludHMgPSB0aGlzLnBvaW50cy5maWx0ZXIoXHJcbiAgICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChwKSA9PiBpc1BvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlY2FsY0Nvbm5lY3Rpb25zKCkge1xyXG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaW50ZXJzZWN0aW9uUG9pbnRzIG9mIHRoaXMuc2VnbWVudHNNYXAudmFsdWVzKCkpIHtcclxuICAgICAgZm9yIChsZXQgcDEgb2YgaW50ZXJzZWN0aW9uUG9pbnRzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcDIgb2YgaW50ZXJzZWN0aW9uUG9pbnRzKSB7XHJcbiAgICAgICAgICBpZiAoIWlzUG9pbnRzRXF1YWwocDEsIHAyKSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLnB1c2gobmV3IExpbmUocDEsIHAyKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IHRoaXMuY29ubmVjdGlvbnMuZmlsdGVyKFxyXG4gICAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgobCkgPT4gaXNMaW5lc0VxdWFsKGwsIHZhbHVlKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlY2FsY1RyaWFuZ2xlcygpIHtcclxuICAgIHRoaXMudHJpYW5nbGVzID0gW107XHJcbiAgICBmb3IgKGxldCBsMSBvZiB0aGlzLmNvbm5lY3Rpb25zKSB7XHJcbiAgICAgIGZvciAobGV0IGwyIG9mIHRoaXMuY29ubmVjdGlvbnMpIHtcclxuICAgICAgICBmb3IgKGxldCBsMyBvZiB0aGlzLmNvbm5lY3Rpb25zKSB7XHJcbiAgICAgICAgICBpZiAobDEgPT0gbDIgfHwgbDEgPT0gbDMgfHwgbDIgPT0gbDMpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgbGV0IHRyaWFuZ2xlID0gbGluZXNUb1RyaWFuZ2xlKGwxLCBsMiwgbDMpO1xyXG4gICAgICAgICAgaWYgKHRyaWFuZ2xlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50cmlhbmdsZXMucHVzaCh0cmlhbmdsZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnRyaWFuZ2xlcyA9IHRoaXMudHJpYW5nbGVzLmZpbHRlcihcclxuICAgICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHQpID0+IGlzVHJpYW5nbGVzRXF1YWwodCwgdmFsdWUpKVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpbmVzVG9UcmlhbmdsZShsMTogTGluZSwgbDI6IExpbmUsIGwzOiBMaW5lKTogVHJpYW5nbGUgfCBudWxsIHtcclxuICBsZXQgaHBvaW50cyA9IFtsMS5zdGFydCwgbDEuZW5kLCBsMi5zdGFydCwgbDIuZW5kLCBsMy5zdGFydCwgbDMuZW5kXTtcclxuICBocG9pbnRzID0gaHBvaW50cy5maWx0ZXIoXHJcbiAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHApID0+IGlzUG9pbnRzRXF1YWwocCwgdmFsdWUpKVxyXG4gICk7XHJcbiAgaWYgKGhwb2ludHMubGVuZ3RoICE9IDMpIHJldHVybiBudWxsO1xyXG5cclxuICB2YXIgYSA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsMS5zdGFydCwgbDEuZW5kKTtcclxuICB2YXIgYiA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsMi5zdGFydCwgbDIuZW5kKTtcclxuICB2YXIgYyA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsMy5zdGFydCwgbDMuZW5kKTtcclxuXHJcbiAgaWYgKGEgPiBiICsgYyB8fCBiID4gYSArIGMgfHwgYyA+IGEgKyBiKSByZXR1cm4gbnVsbDtcclxuICBjb25zdCBwID0gKGEgKyBiICsgYykgLyAyO1xyXG4gIGxldCBTID0gKHAgKiAocCAtIGEpICogKHAgLSBiKSAqIChwIC0gYykpICoqIDAuNTtcclxuICBpZiAoaXNOYU4oUykgfHwgTWF0aC5hYnMoUykgPD0gMSkgcmV0dXJuIG51bGw7XHJcbiAgcmV0dXJuIG5ldyBUcmlhbmdsZShocG9pbnRzWzBdLCBocG9pbnRzWzFdLCBocG9pbnRzWzJdKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoUG9pbnQoXHJcbiAgcG9pbnQ6IFBvaW50LFxyXG4gIHBvaW50czogUG9pbnRbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IHRvUG9pbnQgb2YgcG9pbnRzKSB7XHJcbiAgICBsZXQgZGlzdGFjZSA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgdG9Qb2ludCk7XHJcbiAgICBpZiAoZGlzdGFjZSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluRGlzdCA9IGRpc3RhY2U7XHJcbiAgICAgIG1pblBvaW50ID0gdG9Qb2ludDtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lUG9pbnRzKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IGRpc3RTdGFydCA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgbGluZS5zdGFydCk7XHJcbiAgICBsZXQgZGlzdEVuZCA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgbGluZS5lbmQpO1xyXG5cclxuICAgIGlmIChNYXRoLm1pbihkaXN0U3RhcnQsIGRpc3RFbmQpIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5Qb2ludCA9IGRpc3RTdGFydCA8IGRpc3RFbmQgPyBsaW5lLnN0YXJ0IDogbGluZS5lbmQ7XHJcbiAgICAgIG1pbkRpc3QgPSBNYXRoLm1pbihkaXN0U3RhcnQsIGRpc3RFbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aExpbmUoXHJcbiAgcG9pbnQ6IFBvaW50LFxyXG4gIGxpbmVzOiBMaW5lW10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICBsZXQgcGQgPSBkaXN0YW5jZUZyb21Qb2ludFRvTGluZShwb2ludCwgbGluZSk7XHJcbiAgICBpZiAocGQuZGlzdGFjZSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluRGlzdCA9IHBkLmRpc3RhY2U7XHJcbiAgICAgIG1pblBvaW50ID0gcGQucG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlQmV0d2VlblBvaW50cyhwMTogUG9pbnQsIHAyOiBQb2ludCk6IG51bWJlciB7XHJcbiAgcmV0dXJuIE1hdGguc3FydCgocDEueCAtIHAyLngpICoqIDIgKyAocDEueSAtIHAyLnkpICoqIDIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUoXHJcbiAgcG9pbnQ6IFBvaW50LFxyXG4gIGxpbmU6IExpbmVcclxuKTogeyBwb2ludDogUG9pbnQ7IGRpc3RhY2U6IG51bWJlciB9IHtcclxuICBjb25zdCBBID0gcG9pbnQueCAtIGxpbmUuc3RhcnQueDtcclxuICBjb25zdCBCID0gcG9pbnQueSAtIGxpbmUuc3RhcnQueTtcclxuICBjb25zdCBDID0gbGluZS5lbmQueCAtIGxpbmUuc3RhcnQueDtcclxuICBjb25zdCBEID0gbGluZS5lbmQueSAtIGxpbmUuc3RhcnQueTtcclxuXHJcbiAgbGV0IGRvdCA9IEEgKiBDICsgQiAqIEQ7XHJcbiAgbGV0IGxlbl9zcSA9IEMgKiBDICsgRCAqIEQ7XHJcbiAgbGV0IHBhcmFtID0gLTE7XHJcbiAgaWYgKGxlbl9zcSAhPSAwKSB7XHJcbiAgICBwYXJhbSA9IGRvdCAvIGxlbl9zcTtcclxuICB9XHJcbiAgbGV0IHh4ID0gMDtcclxuICBsZXQgeXkgPSAwO1xyXG5cclxuICBpZiAocGFyYW0gPCAwKSB7XHJcbiAgICB4eCA9IGxpbmUuc3RhcnQueDtcclxuICAgIHl5ID0gbGluZS5zdGFydC55O1xyXG4gIH0gZWxzZSBpZiAocGFyYW0gPiAxKSB7XHJcbiAgICB4eCA9IGxpbmUuZW5kLng7XHJcbiAgICB5eSA9IGxpbmUuZW5kLnk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHh4ID0gbGluZS5zdGFydC54ICsgcGFyYW0gKiBDO1xyXG4gICAgeXkgPSBsaW5lLnN0YXJ0LnkgKyBwYXJhbSAqIEQ7XHJcbiAgfVxyXG5cclxuICBsZXQgZHggPSBwb2ludC54IC0geHg7XHJcbiAgbGV0IGR5ID0gcG9pbnQueSAtIHl5O1xyXG5cclxuICByZXR1cm4geyBwb2ludDogbmV3IFBvaW50KHh4LCB5eSksIGRpc3RhY2U6IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSkgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSW50ZXJzZWN0aW9uKGxpbmUxOiBMaW5lLCBsaW5lMjogTGluZSk6IFBvaW50IHwgbnVsbCB7XHJcbiAgbGV0IGNoZWNrZWRQb2ludHMgPSBbbGluZTEuc3RhcnQsIGxpbmUxLmVuZCwgbGluZTIuc3RhcnQsIGxpbmUyLmVuZF07XHJcbiAgbGV0IEE6IG51bWJlciwgQjogbnVtYmVyLCBDOiBudW1iZXI7XHJcbiAgbGV0IHBvaW50eHg6IG51bWJlciwgcG9pbnR5eTogbnVtYmVyO1xyXG5cclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMiwgbGluZTEuc3RhcnQpKSByZXR1cm4gbGluZTEuc3RhcnQ7XHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTIsIGxpbmUxLmVuZCkpIHJldHVybiBsaW5lMS5lbmQ7XHJcblxyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUxLCBsaW5lMi5zdGFydCkpIHJldHVybiBsaW5lMi5zdGFydDtcclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMSwgbGluZTIuZW5kKSkgcmV0dXJuIGxpbmUyLmVuZDtcclxuXHJcbiAgcmV0dXJuIFRlbXBDaGVjaygpO1xyXG5cclxuICBmdW5jdGlvbiBpc1BvaW50T25MaW5lKGw6IExpbmUsIGM6IFBvaW50KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgcDEgPSBsLnN0YXJ0O1xyXG4gICAgbGV0IHAyID0gbC5lbmQ7XHJcblxyXG4gICAgbGV0IGR4MSA9IHAyLnggLSBwMS54O1xyXG4gICAgbGV0IGR5MSA9IHAyLnkgLSBwMS55O1xyXG5cclxuICAgIGxldCBkeCA9IGMueCAtIHAxLng7XHJcbiAgICBsZXQgZHkgPSBjLnkgLSBwMS55O1xyXG5cclxuICAgIGxldCBTID0gZHgxICogZHkgLSBkeCAqIGR5MTtcclxuICAgIGxldCBhYiA9IE1hdGguc3FydChkeDEgKiBkeDEgKyBkeTEgKiBkeTEpO1xyXG4gICAgbGV0IGggPSBTIC8gYWI7XHJcbiAgICByZXR1cm4gTWF0aC5hYnMoaCkgPCAwLjE7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBWRUsoYXg6IG51bWJlciwgYXk6IG51bWJlciwgYng6IG51bWJlciwgYnk6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIGF4ICogYnkgLSBieCAqIGF5O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gQ3Jvc3NpbmdDaGVjayhwMTogUG9pbnQsIHAyOiBQb2ludCwgcDM6IFBvaW50LCBwNDogUG9pbnQpIHtcclxuICAgIGxldCB2MSwgdjIsIHYzLCB2NDtcclxuXHJcbiAgICB2MSA9IFZFSyhwNC54IC0gcDMueCwgcDQueSAtIHAzLnksIHAxLnggLSBwMy54LCBwMS55IC0gcDMueSk7XHJcbiAgICB2MiA9IFZFSyhwNC54IC0gcDMueCwgcDQueSAtIHAzLnksIHAyLnggLSBwMy54LCBwMi55IC0gcDMueSk7XHJcbiAgICB2MyA9IFZFSyhwMi54IC0gcDEueCwgcDIueSAtIHAxLnksIHAzLnggLSBwMS54LCBwMy55IC0gcDEueSk7XHJcbiAgICB2NCA9IFZFSyhwMi54IC0gcDEueCwgcDIueSAtIHAxLnksIHA0LnggLSBwMS54LCBwNC55IC0gcDEueSk7XHJcbiAgICBpZiAodjEgKiB2MiA8IDAgJiYgdjMgKiB2NCA8IDApIHJldHVybiB0cnVlO1xyXG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBFcXVhdGlvbk9mVGhlTGluZShwMTogUG9pbnQsIHAyOiBQb2ludCkge1xyXG4gICAgQSA9IHAyLnkgLSBwMS55O1xyXG4gICAgQiA9IHAxLnggLSBwMi54O1xyXG4gICAgQyA9IC1wMS54ICogKHAyLnkgLSBwMS55KSArIHAxLnkgKiAocDIueCAtIHAxLngpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gSW50ZXJzZWN0aW9uWChcclxuICAgIGExOiBudW1iZXIsXHJcbiAgICBiMTogbnVtYmVyLFxyXG4gICAgYzE6IG51bWJlcixcclxuICAgIGEyOiBudW1iZXIsXHJcbiAgICBiMjogbnVtYmVyLFxyXG4gICAgYzI6IG51bWJlclxyXG4gICkge1xyXG4gICAgbGV0IGQsIGR4LCBwb2ludHg7XHJcbiAgICBkID0gYTEgKiBiMiAtIGIxICogYTI7XHJcbiAgICBkeCA9IC1jMSAqIGIyICsgYjEgKiBjMjtcclxuICAgIHBvaW50eCA9IGR4IC8gZDtcclxuICAgIHJldHVybiBwb2ludHg7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBJbnRlcnNlY3Rpb25ZKFxyXG4gICAgYTE6IG51bWJlcixcclxuICAgIGIxOiBudW1iZXIsXHJcbiAgICBjMTogbnVtYmVyLFxyXG4gICAgYTI6IG51bWJlcixcclxuICAgIGIyOiBudW1iZXIsXHJcbiAgICBjMjogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICBsZXQgZCwgZHksIHBvaW50eTtcclxuICAgIGQgPSBhMSAqIGIyIC0gYjEgKiBhMjtcclxuICAgIGR5ID0gLWExICogYzIgKyBjMSAqIGEyO1xyXG4gICAgcG9pbnR5ID0gZHkgLyBkO1xyXG4gICAgcmV0dXJuIHBvaW50eTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFRlbXBDaGVjaygpOiBQb2ludCB8IG51bGwge1xyXG4gICAgaWYgKFxyXG4gICAgICBDcm9zc2luZ0NoZWNrKFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMF0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1sxXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzJdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbM11cclxuICAgICAgKVxyXG4gICAgKSB7XHJcbiAgICAgIGxldCBhMSwgYjEsIGMxLCBhMiwgYjIsIGMyO1xyXG4gICAgICBFcXVhdGlvbk9mVGhlTGluZShjaGVja2VkUG9pbnRzWzBdLCBjaGVja2VkUG9pbnRzWzFdKTtcclxuICAgICAgYTEgPSBBO1xyXG4gICAgICBiMSA9IEI7XHJcbiAgICAgIGMxID0gQztcclxuICAgICAgRXF1YXRpb25PZlRoZUxpbmUoY2hlY2tlZFBvaW50c1syXSwgY2hlY2tlZFBvaW50c1szXSk7XHJcbiAgICAgIGEyID0gQTtcclxuICAgICAgYjIgPSBCO1xyXG4gICAgICBjMiA9IEM7XHJcbiAgICAgIHBvaW50eHggPSBJbnRlcnNlY3Rpb25YKGExLCBiMSwgYzEsIGEyLCBiMiwgYzIpO1xyXG4gICAgICBwb2ludHl5ID0gSW50ZXJzZWN0aW9uWShhMSwgYjEsIGMxLCBhMiwgYjIsIGMyKTtcclxuICAgICAgcmV0dXJuIG5ldyBQb2ludChwb2ludHh4LCBwb2ludHl5KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgUG9pbnQge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB4OiBudW1iZXIsIHB1YmxpYyB5OiBudW1iZXIpIHt9XHJcblxyXG4gIHB1YmxpYyBjbG9uZSgpOiBQb2ludCB7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhcnQ6IFBvaW50LCBwdWJsaWMgZW5kOiBQb2ludCkge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcDE6IFBvaW50LCBwdWJsaWMgcDI6IFBvaW50LCBwdWJsaWMgcDM6IFBvaW50KSB7fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNQb2ludHNFcXVhbChhOiBQb2ludCwgYjogUG9pbnQsIGFscGhhOiBudW1iZXIgPSAxKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIE1hdGguYWJzKGEueCAtIGIueCkgPD0gYWxwaGEgJiYgTWF0aC5hYnMoYS55IC0gYi55KSA8PSBhbHBoYTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzTGluZXNFcXVhbChhOiBMaW5lLCBiOiBMaW5lLCBhbHBoYTogbnVtYmVyID0gMSk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICAoaXNQb2ludHNFcXVhbChhLnN0YXJ0LCBiLnN0YXJ0LCBhbHBoYSkgJiYgaXNQb2ludHNFcXVhbChhLmVuZCwgYi5lbmQsIGFscGhhKSkgfHxcclxuICAgIChpc1BvaW50c0VxdWFsKGEuZW5kLCBiLnN0YXJ0LCBhbHBoYSkgJiYgaXNQb2ludHNFcXVhbChhLnN0YXJ0LCBiLmVuZCwgYWxwaGEpKVxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyaWFuZ2xlc0VxdWFsKGE6IFRyaWFuZ2xlLCBiOiBUcmlhbmdsZSwgYWxwaGE6IG51bWJlciA9IDEpOiBib29sZWFuIHtcclxuICBsZXQgZXF1YWxzID0gMDtcclxuICBlcXVhbHMgKz1cclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMSwgYi5wMSwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDEsIGIucDIsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAxLCBiLnAzLCBhbHBoYSlcclxuICAgICAgPyAxXHJcbiAgICAgIDogMDtcclxuICBlcXVhbHMgKz1cclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMiwgYi5wMSwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDIsIGIucDIsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAyLCBiLnAzLCBhbHBoYSlcclxuICAgICAgPyAxXHJcbiAgICAgIDogMDtcclxuICBlcXVhbHMgKz1cclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMywgYi5wMSwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDMsIGIucDIsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAzLCBiLnAzLCBhbHBoYSlcclxuICAgICAgPyAxXHJcbiAgICAgIDogMDtcclxuICByZXR1cm4gZXF1YWxzID09PSAzO1xyXG59IiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQgeyBUcmlhbmdsZUNhbnZhcywgVHJpYW5nbGVDYW52YXNDb25maWcgfSBmcm9tIFwiLi90cmlhbmdsZWNhbnZhc1wiO1xyXG5pbXBvcnQge1xyXG4gIGNoZWNrSW50ZXJzZWN0aW9uLFxyXG4gIGRpc3RhbmNlQmV0d2VlblBvaW50cyxcclxuICBkaXN0YW5jZUZyb21Qb2ludFRvTGluZSxcclxuICBtZXJnZVBvaW50V2l0aExpbmUsXHJcbiAgbWVyZ2VQb2ludFdpdGhMaW5lUG9pbnRzLFxyXG4gIG1lcmdlUG9pbnRXaXRoUG9pbnQsXHJcbn0gZnJvbSBcIi4vY2FsY3VsYXRpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnIGV4dGVuZHMgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBtZXJnZVJhZGl1czogbnVtYmVyID0gNTA7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgc3VwZXIoaW5pdCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGluaXQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0VHJpYW5nbGVDYW52YXMgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhcyB7XHJcbiAgbGluZXM6IExpbmVbXSA9IFtdO1xyXG4gIGludGVyc2VjdGlvblBvaW50czogUG9pbnRbXSA9IFtdO1xyXG5cclxuICBtb3VzZVBvczogUG9pbnQgPSBuZXcgUG9pbnQoMCwgMCk7XHJcbiAgc2VsZWN0ZWRQb2ludDogUG9pbnQgfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcgYXMgVHJpYW5nbGVDYW52YXNDb25maWcpO1xyXG4gICAgdGhpcy5ydW5Vc2VyRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xlYXJBbGwoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLmxpbmVzID0gW107XHJcbiAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVNb3VzZVBvcyhlOiBQb2ludGVyRXZlbnQpIHtcclxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB0aGlzLm1vdXNlUG9zLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICB0aGlzLm1vdXNlUG9zLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWVyZ2VQb2ludFdpdGhJbnRlcnNlY3Rpb25Qb2ludHMocG9pbnQ6IFBvaW50KTogYm9vbGVhbiB7XHJcbiAgICBpZiAoXHJcbiAgICAgIG1lcmdlUG9pbnRXaXRoUG9pbnQoXHJcbiAgICAgICAgcG9pbnQsXHJcbiAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMsXHJcbiAgICAgICAgdGhpcy5jb25maWcubWVyZ2VSYWRpdXNcclxuICAgICAgKVxyXG4gICAgKVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWVyZ2VQb2ludFdpdGhHcmlkKHBvaW50OiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHNpemUgPSB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemU7XHJcbiAgICBsZXQgY3ggPSBNYXRoLmZsb29yKHBvaW50LnggLyBzaXplKTtcclxuICAgIGxldCBjeSA9IE1hdGguZmxvb3IocG9pbnQueSAvIHNpemUpO1xyXG4gICAgbGV0IHN0YXJ0UG9pbnQgPSBuZXcgUG9pbnQoY3ggKiBzaXplLCBjeSAqIHNpemUpO1xyXG4gICAgbGV0IGdyaWRQb2ludHMgPSBbXHJcbiAgICAgIHN0YXJ0UG9pbnQsXHJcbiAgICAgIG5ldyBQb2ludChzdGFydFBvaW50LnggKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUsIHN0YXJ0UG9pbnQueSksXHJcbiAgICAgIG5ldyBQb2ludChzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZSksXHJcbiAgICAgIG5ldyBQb2ludChcclxuICAgICAgICBzdGFydFBvaW50LnggKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUsXHJcbiAgICAgICAgc3RhcnRQb2ludC55ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplXHJcbiAgICAgICksXHJcbiAgICBdO1xyXG4gICAgaWYgKG1lcmdlUG9pbnRXaXRoUG9pbnQocG9pbnQsIGdyaWRQb2ludHMsIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZSkpXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRJbnRlcnNlY3Rpb25Qb2ludChsaW5lOiBMaW5lKSB7XHJcbiAgICBmb3IgKGxldCB3aXRoTGluZSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgIGxldCBwb2ludCA9IGNoZWNrSW50ZXJzZWN0aW9uKGxpbmUsIHdpdGhMaW5lKTtcclxuICAgICAgaWYgKHBvaW50ICE9IG51bGwpIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0UG9pbnRQb3MocG9pbnQ6IFBvaW50KSB7XHJcbiAgICBsZXQgcmVzID0gZmFsc2U7XHJcbiAgICBpZiAoIXJlcykge1xyXG4gICAgICByZXMgPSB0aGlzLm1lcmdlUG9pbnRXaXRoSW50ZXJzZWN0aW9uUG9pbnRzKHBvaW50KTtcclxuICAgIH1cclxuICAgIGlmICghcmVzKSB7XHJcbiAgICAgIHJlcyA9IG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICAgICAgICBwb2ludCxcclxuICAgICAgICB0aGlzLmxpbmVzLFxyXG4gICAgICAgIHRoaXMuY29uZmlnLm1lcmdlUmFkaXVzICogMlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKCFyZXMpIHtcclxuICAgICAgcmVzID0gbWVyZ2VQb2ludFdpdGhMaW5lKHBvaW50LCB0aGlzLmxpbmVzLCB0aGlzLmNvbmZpZy5tZXJnZVJhZGl1cyAqIDIpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFyZXMgJiYgdGhpcy5jb25maWcudXNlR3JpZCkge1xyXG4gICAgICByZXMgPSB0aGlzLm1lcmdlUG9pbnRXaXRoR3JpZChwb2ludCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvcnJlY3RNb3VzZVBvaW50KCkge1xyXG4gICAgdGhpcy5jb3JyZWN0UG9pbnRQb3ModGhpcy5tb3VzZVBvcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvcnJlY3RTZWxlY3RlZFBvaW50KCkge1xyXG4gICAgbGV0IHBvaW50ID0gbmV3IFBvaW50KHRoaXMubW91c2VQb3MueCwgdGhpcy5tb3VzZVBvcy55KTtcclxuICAgIHRoaXMuY29ycmVjdFBvaW50UG9zKHBvaW50KTtcclxuICAgIHRoaXMuc2VsZWN0ZWRQb2ludCA9IHBvaW50LmNsb25lKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZHJhdygpIHtcclxuICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgIGZvciAobGV0IGxpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKGxpbmUuc3RhcnQsIGxpbmUuZW5kKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGxpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdQb2ludChsaW5lLnN0YXJ0KTtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQobGluZS5lbmQpO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgcG9pbnQgb2YgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQocG9pbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBydW5Vc2VyRXZlbnRzKCkge1xyXG4gICAgbGV0IGNhbnZhcyA9IHRoaXMuY2FudmFzRWxlbWVudDtcclxuXHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMucG9pbnRlcmRvd25FdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMucG9pbnRlcnVwRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgKCkgPT4ge30sIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5wb2ludGVybW92ZUV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVybW92ZUV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG5cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUG9pbnQgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludCwgdGhpcy5tb3VzZVBvcyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVyZG93bkV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNvcnJlY3RTZWxlY3RlZFBvaW50KCk7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVydXBFdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZFBvaW50ID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RNb3VzZVBvaW50KCk7XHJcbiAgICBsZXQgbGluZSA9IG5ldyBMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludC5jbG9uZSgpLCB0aGlzLm1vdXNlUG9zLmNsb25lKCkpO1xyXG4gICAgdGhpcy5hZGRJbnRlcnNlY3Rpb25Qb2ludChsaW5lKTtcclxuICAgIHRoaXMubGluZXMucHVzaChsaW5lKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRQb2ludCA9IG51bGw7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQge1xyXG4gIENvbG9yR2VuZXJhdG9yLFxyXG4gIFRyaWFuZ2xlQ2FudmFzLFxyXG4gIFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyB7XHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGluaXQ/OiBQYXJ0aWFsPE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgc3VwZXIoaW5pdCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGluaXQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE91dHB1dFRyaWFuZ2xlQ2FudmFzIGV4dGVuZHMgVHJpYW5nbGVDYW52YXMge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25maWc6IE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcgYXMgVHJpYW5nbGVDYW52YXNDb25maWcpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdMaW5lcyhcclxuICAgIGxpbmVzOiBMaW5lW10sXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKGxpbmUuc3RhcnQsIGxpbmUuZW5kLCBjb2xvciwgbGluZVdpZHRoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3UG9pbnRzKFxyXG4gICAgcG9pbnRzOiBQb2ludFtdLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgcG9pbnRTaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5wb2ludFNpemVcclxuICApIHtcclxuICAgIGZvciAobGV0IHBvaW50IG9mIHBvaW50cykge1xyXG4gICAgICB0aGlzLmRyYXdQb2ludChwb2ludCwgY29sb3IsIHBvaW50U2l6ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1RyaWFuZ2xlcyhcclxuICAgIHRyaWFuZ2xlczogVHJpYW5nbGVbXSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICBmb3IgKGxldCB0cmlhbmdsZSBvZiB0cmlhbmdsZXMpIHtcclxuICAgICAgdGhpcy5kcmF3VHJpYW5nbGUodHJpYW5nbGUsIGNvbG9yLCBsaW5lV2lkdGgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JHZW5lcmF0b3Ige1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBnZW5lcmF0ZTogKCkgPT4gc3RyaW5nKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPVxyXG4gICAgXCIjMDAwMDAwXCI7XHJcbiAgcHVibGljIGxpbmVXaWR0aDogbnVtYmVyID0gMztcclxuICBwdWJsaWMgcG9pbnRTaXplOiBudW1iZXIgPSA1O1xyXG4gIHB1YmxpYyBjYW52YXNJZDogc3RyaW5nID0gXCJjYW52YXNcIjtcclxuXHJcbiAgcHVibGljIHVzZUdyaWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgZ3JpZENvbG9yOiBzdHJpbmcgPSBcIiM1MDUwNTBcIjtcclxuICBwdWJsaWMgZ3JpZExpbmVXaWR0aDogbnVtYmVyID0gMTtcclxuICBwdWJsaWMgZ3JpZENlbGxTaXplOiBudW1iZXIgPSA0MDtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGluaXQ/OiBQYXJ0aWFsPFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZUNhbnZhcyB7XHJcbiAgY2FudmFzRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG4gIG9uUmVzaXplID0gKGU6IFVJRXZlbnQpID0+IHtcclxuICAgIGxldCB0ZW1wID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHRcclxuICAgICk7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIHRoaXMuY3R4LnB1dEltYWdlRGF0YSh0ZW1wLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIGNvbmZpZy5jYW52YXNJZFxyXG4gICAgKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCA9IHRoaXMuY2FudmFzRWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQgPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5vblJlc2l6ZSwgZmFsc2UpO1xyXG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIsIHtcclxuICAgICAgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlLFxyXG4gICAgfSkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICAgIGlmICh0aGlzLmNvbmZpZy51c2VHcmlkKSB7XHJcbiAgICAgIHRoaXMuZHJhd0dyaWQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3R3JpZChcclxuICAgIGNvbG9yOiBzdHJpbmcgPSB0aGlzLmNvbmZpZy5ncmlkQ29sb3IsXHJcbiAgICBzaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemVcclxuICApIHtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDE7XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPD0gdGhpcy5jYW52YXNFbGVtZW50LndpZHRoOyB4ICs9IHNpemUpIHtcclxuICAgICAgdGhpcy5jdHgubW92ZVRvKHggKyAwLjUsIDApO1xyXG4gICAgICB0aGlzLmN0eC5saW5lVG8oeCArIDAuNSwgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPD0gdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodDsgeSArPSBzaXplKSB7XHJcbiAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB5ICsgMC41KTtcclxuICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCwgeSArIDAuNSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0xpbmUoXHJcbiAgICBmcm9tOiBQb2ludCxcclxuICAgIHRvOiBQb2ludCxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yR2VuZXJhdG9yKVxyXG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICB0aGlzLmN0eC5tb3ZlVG8oZnJvbS54LCBmcm9tLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRvLngsIHRvLnkpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1BvaW50KFxyXG4gICAgcG9pbnQ6IFBvaW50LFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgcG9pbnRTaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5wb2ludFNpemVcclxuICApIHtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JHZW5lcmF0b3IpIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgbGV0IHNpemUgPSBwb2ludFNpemU7XHJcbiAgICB0aGlzLmN0eC5maWxsUmVjdChwb2ludC54IC0gc2l6ZSAvIDIsIHBvaW50LnkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3VHJpYW5nbGUoXHJcbiAgICB0cmlhbmdsZTogVHJpYW5nbGUsXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvckdlbmVyYXRvcikgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3IuZ2VuZXJhdGUoKTtcclxuICAgIGVsc2UgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcclxuICAgIHRoaXMuY3R4Lm1vdmVUbyh0cmlhbmdsZS5wMS54LCB0cmlhbmdsZS5wMS55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0cmlhbmdsZS5wMi54LCB0cmlhbmdsZS5wMi55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0cmlhbmdsZS5wMy54LCB0cmlhbmdsZS5wMy55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0cmlhbmdsZS5wMS54LCB0cmlhbmdsZS5wMS55KTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsZWFyQ2FudmFzKCkge1xyXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHRcclxuICAgICk7XHJcbiAgICBpZiAodGhpcy5jb25maWcudXNlR3JpZCkge1xyXG4gICAgICB0aGlzLmRyYXdHcmlkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcbmltcG9ydCB7XHJcbiAgQ29sb3JHZW5lcmF0b3IsXHJcbiAgVHJpYW5nbGVDYW52YXMsXHJcbiAgVHJpYW5nbGVDYW52YXNDb25maWcsXHJcbn0gZnJvbSBcIi4vdHJpYW5nbGVjYW52YXNcIjtcclxuaW1wb3J0IHsgVHJpYW5nbGVzQ2FsY3VsYXRvciB9IGZyb20gXCIuL2NhbGN1bGF0aW9uXCI7XHJcbmltcG9ydCB7XHJcbiAgSW5wdXRUcmlhbmdsZUNhbnZhcyxcclxuICBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL2lucHV0dHJpYW5nbGVjYW52YXNcIjtcclxuaW1wb3J0IHtcclxuICBPdXRwdXRUcmlhbmdsZUNhbnZhcyxcclxuICBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi9vdXRwdXR0cmlhbmdsZWNhbnZhc1wiO1xyXG5cclxubGV0IGNhbnZhcyA9IG5ldyBJbnB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKHtcclxuICAgIGNvbG9yOiBcIndoaXRlXCIsXHJcbiAgICBsaW5lV2lkdGg6IDIsXHJcbiAgICBwb2ludFNpemU6IDgsXHJcbiAgICBjYW52YXNJZDogXCJjYW52YXNcIixcclxuICAgIG1lcmdlUmFkaXVzOiAyNSxcclxuICAgIHVzZUdyaWQ6IHRydWUsXHJcbiAgICBncmlkQ2VsbFNpemU6IDQwLFxyXG4gICAgZ3JpZExpbmVXaWR0aDogMjBcclxuICB9KVxyXG4pO1xyXG5cclxubGV0IGNvbm5lY3Rpb25zQ2FudmFzID0gbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyh7XHJcbiAgICBjb2xvcjogbmV3IENvbG9yR2VuZXJhdG9yKFxyXG4gICAgICAoKSA9PlxyXG4gICAgICAgIFwiI1wiICtcclxuICAgICAgICAoXHJcbiAgICAgICAgICBcIjAwMDAwXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygxNiwgNikpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICkuc2xpY2UoLTYpICtcclxuICAgICAgICBcIjUwXCJcclxuICAgICksXHJcbiAgICBsaW5lV2lkdGg6IDMsXHJcbiAgICBwb2ludFNpemU6IDgsXHJcbiAgICBjYW52YXNJZDogXCJjb25uZWN0aW9uc1wiXHJcbiAgfSlcclxuKTtcclxuXHJcbmxldCBzaG93VHJpYW5nbGVJbmRleCA9IDA7XHJcbmxldCB0cmlhbmdsZWNhbnZhcyA9IG5ldyBPdXRwdXRUcmlhbmdsZUNhbnZhcyhcclxuICBuZXcgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcoe1xyXG4gICAgY29sb3I6IFwiYmxhY2tcIixcclxuICAgIGxpbmVXaWR0aDogMixcclxuICAgIHBvaW50U2l6ZTogNCxcclxuICAgIGNhbnZhc0lkOiBcInRyaWFuZ2xlc1wiLFxyXG4gIH0pXHJcbik7XHJcblxyXG5sZXQgY2FsY3VsYXRvciA9IG5ldyBUcmlhbmdsZXNDYWxjdWxhdG9yKCk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGNhbnZhcy5jbGVhckFsbCgpO1xyXG4gIGNvbm5lY3Rpb25zQ2FudmFzLmNsZWFyQ2FudmFzKCk7XHJcbiAgdHJpYW5nbGVjYW52YXMuY2xlYXJDYW52YXMoKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1wcmV2XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmIChzaG93VHJpYW5nbGVJbmRleCA+IDApIHNob3dUcmlhbmdsZUluZGV4LS07XHJcbiAgdHJpYW5nbGVjYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGVzKGNhbGN1bGF0b3IudHJpYW5nbGVzLCBcImdyZXlcIik7XHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlKFxyXG4gICAgY2FsY3VsYXRvci50cmlhbmdsZXNbc2hvd1RyaWFuZ2xlSW5kZXhdLFxyXG4gICAgXCJyZWRcIixcclxuICAgIDRcclxuICApO1xyXG59KTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbmV4dFwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBpZiAoc2hvd1RyaWFuZ2xlSW5kZXggPCBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGggLSAxKSBzaG93VHJpYW5nbGVJbmRleCsrO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmNsZWFyQ2FudmFzKCk7XHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlcyhjYWxjdWxhdG9yLnRyaWFuZ2xlcywgXCJncmV5XCIpO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmRyYXdUcmlhbmdsZShcclxuICAgIGNhbGN1bGF0b3IudHJpYW5nbGVzW3Nob3dUcmlhbmdsZUluZGV4XSxcclxuICAgIFwicmVkXCIsXHJcbiAgICA0XHJcbiAgKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbGNcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FsY3VsYXRvci5jYWxjKGNhbnZhcy5saW5lcyk7XHJcbiAgY29ubmVjdGlvbnNDYW52YXMuZHJhd0xpbmVzKGNhbGN1bGF0b3IuY29ubmVjdGlvbnMpO1xyXG4gIGNvbm5lY3Rpb25zQ2FudmFzLmRyYXdQb2ludHMoY2FsY3VsYXRvci5wb2ludHMsIFwicmVkXCIpO1xyXG5cclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGVzKGNhbGN1bGF0b3IudHJpYW5nbGVzLCBcImdyZXlcIik7XHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlKFxyXG4gICAgY2FsY3VsYXRvci50cmlhbmdsZXNbc2hvd1RyaWFuZ2xlSW5kZXhdLFxyXG4gICAgXCJyZWRcIixcclxuICAgIDRcclxuICApO1xyXG5cclxuICAoXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWFuZ2xlcy1jb3VudFwiKSBhcyBIVE1MU3BhbkVsZW1lbnQgfCBudWxsXHJcbiAgKS50ZXh0Q29udGVudCA9IFN0cmluZyhjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGgpO1xyXG5cclxuICAoXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvaW50cy1jb3VudFwiKSBhcyBIVE1MU3BhbkVsZW1lbnQgfCBudWxsXHJcbiAgKS50ZXh0Q29udGVudCA9IFN0cmluZyhjYWxjdWxhdG9yLnBvaW50cy5sZW5ndGgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9