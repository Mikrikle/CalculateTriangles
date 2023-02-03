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
        this.ctx.lineCap = 'round';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDOUIsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7S0FDL0I7SUFFRCxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN0QixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUV0QixPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksWUFBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQzdFLENBQUM7QUFqQ0QsMERBaUNDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsS0FBVyxFQUFFLEtBQVc7SUFDeEQsSUFBSSxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckUsSUFBSSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsQ0FBQztJQUNwQyxJQUFJLE9BQWUsRUFBRSxPQUFlLENBQUM7SUFFckMsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDMUQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFFdEQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDMUQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUss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QUM5RCxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixpQkFBaUIsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BELGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRXZELGNBQWMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzRCxjQUFjLENBQUMsWUFBWSxDQUN6QixVQUFVLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEVBQ3ZDLEtBQUssRUFDTCxDQUFDLENBQ0YsQ0FBQztJQUdBLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQzFDLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBR2xELFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUN2QyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuRCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jYWxjdWxhdGlvbi50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvaW5wdXR0cmlhbmdsZWNhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvb3V0cHV0dHJpYW5nbGVjYW52YXMudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL3RyaWFuZ2xlY2FudmFzLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvYXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgUG9pbnQsXHJcbiAgTGluZSxcclxuICBUcmlhbmdsZSxcclxuICBpc1BvaW50c0VxdWFsLFxyXG4gIGlzTGluZXNFcXVhbCxcclxuICBpc1RyaWFuZ2xlc0VxdWFsLFxyXG59IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZXNDYWxjdWxhdG9yQ29uZmlnIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZXNDYWxjdWxhdG9yIHtcclxuICBwb2ludHM6IFBvaW50W10gPSBbXTtcclxuICBsaW5lczogTGluZVtdID0gW107XHJcbiAgY29ubmVjdGlvbnM6IExpbmVbXSA9IFtdO1xyXG4gIHRyaWFuZ2xlczogVHJpYW5nbGVbXSA9IFtdO1xyXG4gIHNlZ21lbnRzTWFwOiBNYXA8bnVtYmVyLCBQb2ludFtdPiA9IG5ldyBNYXA8bnVtYmVyLCBQb2ludFtdPigpO1xyXG5cclxuICBwdWJsaWMgY2FsYyhsaW5lczogTGluZVtdKSB7XHJcbiAgICB0aGlzLmxpbmVzID0gbGluZXM7XHJcbiAgICB0aGlzLnJlY2FsY0ludGVyc2VjdGlvbnMoKTtcclxuICAgIHRoaXMucmVjYWxjQ29ubmVjdGlvbnMoKTtcclxuICAgIHRoaXMucmVjYWxjVHJpYW5nbGVzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlY2FsY0ludGVyc2VjdGlvbnMoKSB7XHJcbiAgICB0aGlzLnNlZ21lbnRzTWFwID0gbmV3IE1hcDxudW1iZXIsIFBvaW50W10+KCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5zZXQoaSwgW10pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wb2ludHMgPSBbXTtcclxuICAgIGZvciAobGV0IGxpbmUxIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5wb2ludHMucHVzaChsaW5lMS5zdGFydCk7XHJcbiAgICAgIHRoaXMucG9pbnRzLnB1c2gobGluZTEuZW5kKTtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUxKSk/LnB1c2gobGluZTEuc3RhcnQpO1xyXG4gICAgICB0aGlzLnNlZ21lbnRzTWFwLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTEpKT8ucHVzaChsaW5lMS5lbmQpO1xyXG4gICAgICBmb3IgKGxldCBsaW5lMiBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgICAgbGV0IGludGVyc2VjdGlvblBvaW50ID0gY2hlY2tJbnRlcnNlY3Rpb24obGluZTEsIGxpbmUyKTtcclxuICAgICAgICBpZiAoaW50ZXJzZWN0aW9uUG9pbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgdGhpcy5zZWdtZW50c01hcFxyXG4gICAgICAgICAgICAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMSkpXHJcbiAgICAgICAgICAgID8ucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgICB0aGlzLnNlZ21lbnRzTWFwXHJcbiAgICAgICAgICAgIC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUyKSlcclxuICAgICAgICAgICAgPy5wdXNoKGludGVyc2VjdGlvblBvaW50KTtcclxuICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucG9pbnRzID0gdGhpcy5wb2ludHMuZmlsdGVyKFxyXG4gICAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgocCkgPT4gaXNQb2ludHNFcXVhbChwLCB2YWx1ZSkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWNhbGNDb25uZWN0aW9ucygpIHtcclxuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBbXTtcclxuICAgIGZvciAobGV0IGludGVyc2VjdGlvblBvaW50cyBvZiB0aGlzLnNlZ21lbnRzTWFwLnZhbHVlcygpKSB7XHJcbiAgICAgIGZvciAobGV0IHAxIG9mIGludGVyc2VjdGlvblBvaW50cykge1xyXG4gICAgICAgIGZvciAobGV0IHAyIG9mIGludGVyc2VjdGlvblBvaW50cykge1xyXG4gICAgICAgICAgaWYgKCFpc1BvaW50c0VxdWFsKHAxLCBwMikpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5wdXNoKG5ldyBMaW5lKHAxLCBwMikpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29ubmVjdGlvbnMgPSB0aGlzLmNvbm5lY3Rpb25zLmZpbHRlcihcclxuICAgICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKGwpID0+IGlzTGluZXNFcXVhbChsLCB2YWx1ZSkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWNhbGNUcmlhbmdsZXMoKSB7XHJcbiAgICB0aGlzLnRyaWFuZ2xlcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgbDEgb2YgdGhpcy5jb25uZWN0aW9ucykge1xyXG4gICAgICBmb3IgKGxldCBsMiBvZiB0aGlzLmNvbm5lY3Rpb25zKSB7XHJcbiAgICAgICAgZm9yIChsZXQgbDMgb2YgdGhpcy5jb25uZWN0aW9ucykge1xyXG4gICAgICAgICAgaWYgKGwxID09IGwyIHx8IGwxID09IGwzIHx8IGwyID09IGwzKSBjb250aW51ZTtcclxuICAgICAgICAgIGxldCB0cmlhbmdsZSA9IGxpbmVzVG9UcmlhbmdsZShsMSwgbDIsIGwzKTtcclxuICAgICAgICAgIGlmICh0cmlhbmdsZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpYW5nbGVzLnB1c2godHJpYW5nbGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy50cmlhbmdsZXMgPSB0aGlzLnRyaWFuZ2xlcy5maWx0ZXIoXHJcbiAgICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KCh0KSA9PiBpc1RyaWFuZ2xlc0VxdWFsKHQsIHZhbHVlKSlcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsaW5lc1RvVHJpYW5nbGUobDE6IExpbmUsIGwyOiBMaW5lLCBsMzogTGluZSk6IFRyaWFuZ2xlIHwgbnVsbCB7XHJcbiAgbGV0IGhwb2ludHMgPSBbbDEuc3RhcnQsIGwxLmVuZCwgbDIuc3RhcnQsIGwyLmVuZCwgbDMuc3RhcnQsIGwzLmVuZF07XHJcbiAgaHBvaW50cyA9IGhwb2ludHMuZmlsdGVyKFxyXG4gICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChwKSA9PiBpc1BvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICApO1xyXG4gIGlmIChocG9pbnRzLmxlbmd0aCAhPSAzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgdmFyIGEgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDEuc3RhcnQsIGwxLmVuZCk7XHJcbiAgdmFyIGIgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDIuc3RhcnQsIGwyLmVuZCk7XHJcbiAgdmFyIGMgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDMuc3RhcnQsIGwzLmVuZCk7XHJcblxyXG4gIGlmIChhID4gYiArIGMgfHwgYiA+IGEgKyBjIHx8IGMgPiBhICsgYikgcmV0dXJuIG51bGw7XHJcbiAgY29uc3QgcCA9IChhICsgYiArIGMpIC8gMjtcclxuICBsZXQgUyA9IChwICogKHAgLSBhKSAqIChwIC0gYikgKiAocCAtIGMpKSAqKiAwLjU7XHJcbiAgaWYgKGlzTmFOKFMpIHx8IE1hdGguYWJzKFMpIDw9IDEpIHJldHVybiBudWxsO1xyXG4gIHJldHVybiBuZXcgVHJpYW5nbGUoaHBvaW50c1swXSwgaHBvaW50c1sxXSwgaHBvaW50c1syXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBwb2ludHM6IFBvaW50W10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCB0b1BvaW50IG9mIHBvaW50cykge1xyXG4gICAgbGV0IGRpc3RhY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHRvUG9pbnQpO1xyXG4gICAgaWYgKGRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBkaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHRvUG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBkaXN0U3RhcnQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuc3RhcnQpO1xyXG4gICAgbGV0IGRpc3RFbmQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuZW5kKTtcclxuXHJcbiAgICBpZiAoTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluUG9pbnQgPSBkaXN0U3RhcnQgPCBkaXN0RW5kID8gbGluZS5zdGFydCA6IGxpbmUuZW5kO1xyXG4gICAgICBtaW5EaXN0ID0gTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IHBkID0gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUocG9pbnQsIGxpbmUpO1xyXG4gICAgaWYgKHBkLmRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBwZC5kaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHBkLnBvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocDE6IFBvaW50LCBwMjogUG9pbnQpOiBudW1iZXIge1xyXG4gIHJldHVybiBNYXRoLnNxcnQoKHAxLnggLSBwMi54KSAqKiAyICsgKHAxLnkgLSBwMi55KSAqKiAyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lOiBMaW5lXHJcbik6IHsgcG9pbnQ6IFBvaW50OyBkaXN0YWNlOiBudW1iZXIgfSB7XHJcbiAgY29uc3QgQSA9IHBvaW50LnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgQiA9IHBvaW50LnkgLSBsaW5lLnN0YXJ0Lnk7XHJcbiAgY29uc3QgQyA9IGxpbmUuZW5kLnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgRCA9IGxpbmUuZW5kLnkgLSBsaW5lLnN0YXJ0Lnk7XHJcblxyXG4gIGxldCBkb3QgPSBBICogQyArIEIgKiBEO1xyXG4gIGxldCBsZW5fc3EgPSBDICogQyArIEQgKiBEO1xyXG4gIGxldCBwYXJhbSA9IC0xO1xyXG4gIGlmIChsZW5fc3EgIT0gMCkge1xyXG4gICAgcGFyYW0gPSBkb3QgLyBsZW5fc3E7XHJcbiAgfVxyXG4gIGxldCB4eCA9IDA7XHJcbiAgbGV0IHl5ID0gMDtcclxuXHJcbiAgaWYgKHBhcmFtIDwgMCkge1xyXG4gICAgeHggPSBsaW5lLnN0YXJ0Lng7XHJcbiAgICB5eSA9IGxpbmUuc3RhcnQueTtcclxuICB9IGVsc2UgaWYgKHBhcmFtID4gMSkge1xyXG4gICAgeHggPSBsaW5lLmVuZC54O1xyXG4gICAgeXkgPSBsaW5lLmVuZC55O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB4eCA9IGxpbmUuc3RhcnQueCArIHBhcmFtICogQztcclxuICAgIHl5ID0gbGluZS5zdGFydC55ICsgcGFyYW0gKiBEO1xyXG4gIH1cclxuXHJcbiAgbGV0IGR4ID0gcG9pbnQueCAtIHh4O1xyXG4gIGxldCBkeSA9IHBvaW50LnkgLSB5eTtcclxuXHJcbiAgcmV0dXJuIHsgcG9pbnQ6IG5ldyBQb2ludCh4eCwgeXkpLCBkaXN0YWNlOiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ludGVyc2VjdGlvbihsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBQb2ludCB8IG51bGwge1xyXG4gIGxldCBjaGVja2VkUG9pbnRzID0gW2xpbmUxLnN0YXJ0LCBsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0LCBsaW5lMi5lbmRdO1xyXG4gIGxldCBBOiBudW1iZXIsIEI6IG51bWJlciwgQzogbnVtYmVyO1xyXG4gIGxldCBwb2ludHh4OiBudW1iZXIsIHBvaW50eXk6IG51bWJlcjtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTIsIGxpbmUxLnN0YXJ0KSkgcmV0dXJuIGxpbmUxLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5lbmQpKSByZXR1cm4gbGluZTEuZW5kO1xyXG5cclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMSwgbGluZTIuc3RhcnQpKSByZXR1cm4gbGluZTIuc3RhcnQ7XHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLmVuZCkpIHJldHVybiBsaW5lMi5lbmQ7XHJcblxyXG4gIHJldHVybiBUZW1wQ2hlY2soKTtcclxuXHJcbiAgZnVuY3Rpb24gaXNQb2ludE9uTGluZShsOiBMaW5lLCBjOiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHAxID0gbC5zdGFydDtcclxuICAgIGxldCBwMiA9IGwuZW5kO1xyXG5cclxuICAgIGxldCBkeDEgPSBwMi54IC0gcDEueDtcclxuICAgIGxldCBkeTEgPSBwMi55IC0gcDEueTtcclxuXHJcbiAgICBsZXQgZHggPSBjLnggLSBwMS54O1xyXG4gICAgbGV0IGR5ID0gYy55IC0gcDEueTtcclxuXHJcbiAgICBsZXQgUyA9IGR4MSAqIGR5IC0gZHggKiBkeTE7XHJcbiAgICBsZXQgYWIgPSBNYXRoLnNxcnQoZHgxICogZHgxICsgZHkxICogZHkxKTtcclxuICAgIGxldCBoID0gUyAvIGFiO1xyXG4gICAgcmV0dXJuIE1hdGguYWJzKGgpIDwgMC4xO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVkVLKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGJ4OiBudW1iZXIsIGJ5OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBheCAqIGJ5IC0gYnggKiBheTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIENyb3NzaW5nQ2hlY2socDE6IFBvaW50LCBwMjogUG9pbnQsIHAzOiBQb2ludCwgcDQ6IFBvaW50KSB7XHJcbiAgICBsZXQgdjEsIHYyLCB2MywgdjQ7XHJcblxyXG4gICAgdjEgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMS54IC0gcDMueCwgcDEueSAtIHAzLnkpO1xyXG4gICAgdjIgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMi54IC0gcDMueCwgcDIueSAtIHAzLnkpO1xyXG4gICAgdjMgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwMy54IC0gcDEueCwgcDMueSAtIHAxLnkpO1xyXG4gICAgdjQgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwNC54IC0gcDEueCwgcDQueSAtIHAxLnkpO1xyXG4gICAgaWYgKHYxICogdjIgPCAwICYmIHYzICogdjQgPCAwKSByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gRXF1YXRpb25PZlRoZUxpbmUocDE6IFBvaW50LCBwMjogUG9pbnQpIHtcclxuICAgIEEgPSBwMi55IC0gcDEueTtcclxuICAgIEIgPSBwMS54IC0gcDIueDtcclxuICAgIEMgPSAtcDEueCAqIChwMi55IC0gcDEueSkgKyBwMS55ICogKHAyLnggLSBwMS54KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblgoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeCwgcG9pbnR4O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHggPSAtYzEgKiBiMiArIGIxICogYzI7XHJcbiAgICBwb2ludHggPSBkeCAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gSW50ZXJzZWN0aW9uWShcclxuICAgIGExOiBudW1iZXIsXHJcbiAgICBiMTogbnVtYmVyLFxyXG4gICAgYzE6IG51bWJlcixcclxuICAgIGEyOiBudW1iZXIsXHJcbiAgICBiMjogbnVtYmVyLFxyXG4gICAgYzI6IG51bWJlclxyXG4gICkge1xyXG4gICAgbGV0IGQsIGR5LCBwb2ludHk7XHJcbiAgICBkID0gYTEgKiBiMiAtIGIxICogYTI7XHJcbiAgICBkeSA9IC1hMSAqIGMyICsgYzEgKiBhMjtcclxuICAgIHBvaW50eSA9IGR5IC8gZDtcclxuICAgIHJldHVybiBwb2ludHk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBUZW1wQ2hlY2soKTogUG9pbnQgfCBudWxsIHtcclxuICAgIGlmIChcclxuICAgICAgQ3Jvc3NpbmdDaGVjayhcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzBdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMV0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1syXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzNdXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICBsZXQgYTEsIGIxLCBjMSwgYTIsIGIyLCBjMjtcclxuICAgICAgRXF1YXRpb25PZlRoZUxpbmUoY2hlY2tlZFBvaW50c1swXSwgY2hlY2tlZFBvaW50c1sxXSk7XHJcbiAgICAgIGExID0gQTtcclxuICAgICAgYjEgPSBCO1xyXG4gICAgICBjMSA9IEM7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMl0sIGNoZWNrZWRQb2ludHNbM10pO1xyXG4gICAgICBhMiA9IEE7XHJcbiAgICAgIGIyID0gQjtcclxuICAgICAgYzIgPSBDO1xyXG4gICAgICBwb2ludHh4ID0gSW50ZXJzZWN0aW9uWChhMSwgYjEsIGMxLCBhMiwgYjIsIGMyKTtcclxuICAgICAgcG9pbnR5eSA9IEludGVyc2VjdGlvblkoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHJldHVybiBuZXcgUG9pbnQocG9pbnR4eCwgcG9pbnR5eSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFBvaW50IHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgeDogbnVtYmVyLCBwdWJsaWMgeTogbnVtYmVyKSB7fVxyXG5cclxuICBwdWJsaWMgY2xvbmUoKTogUG9pbnQge1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHN0YXJ0OiBQb2ludCwgcHVibGljIGVuZDogUG9pbnQpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHAxOiBQb2ludCwgcHVibGljIHAyOiBQb2ludCwgcHVibGljIHAzOiBQb2ludCkge31cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRzRXF1YWwoYTogUG9pbnQsIGI6IFBvaW50LCBhbHBoYTogbnVtYmVyID0gMSk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBNYXRoLmFicyhhLnggLSBiLngpIDw9IGFscGhhICYmIE1hdGguYWJzKGEueSAtIGIueSkgPD0gYWxwaGE7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xpbmVzRXF1YWwoYTogTGluZSwgYjogTGluZSwgYWxwaGE6IG51bWJlciA9IDEpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgKGlzUG9pbnRzRXF1YWwoYS5zdGFydCwgYi5zdGFydCwgYWxwaGEpICYmIGlzUG9pbnRzRXF1YWwoYS5lbmQsIGIuZW5kLCBhbHBoYSkpIHx8XHJcbiAgICAoaXNQb2ludHNFcXVhbChhLmVuZCwgYi5zdGFydCwgYWxwaGEpICYmIGlzUG9pbnRzRXF1YWwoYS5zdGFydCwgYi5lbmQsIGFscGhhKSlcclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmlhbmdsZXNFcXVhbChhOiBUcmlhbmdsZSwgYjogVHJpYW5nbGUsIGFscGhhOiBudW1iZXIgPSAxKTogYm9vbGVhbiB7XHJcbiAgbGV0IGVxdWFscyA9IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDEsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAxLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMSwgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDIsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAyLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMiwgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDMsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAzLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMywgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgcmV0dXJuIGVxdWFscyA9PT0gMztcclxufSIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSB9IGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IHsgVHJpYW5nbGVDYW52YXMsIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIH0gZnJvbSBcIi4vdHJpYW5nbGVjYW52YXNcIjtcclxuaW1wb3J0IHtcclxuICBjaGVja0ludGVyc2VjdGlvbixcclxuICBkaXN0YW5jZUJldHdlZW5Qb2ludHMsXHJcbiAgZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUsXHJcbiAgbWVyZ2VQb2ludFdpdGhMaW5lLFxyXG4gIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyxcclxuICBtZXJnZVBvaW50V2l0aFBvaW50LFxyXG59IGZyb20gXCIuL2NhbGN1bGF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyBleHRlbmRzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIHtcclxuICBwdWJsaWMgbWVyZ2VSYWRpdXM6IG51bWJlciA9IDUwO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoaW5pdD86IFBhcnRpYWw8SW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZz4pIHtcclxuICAgIHN1cGVyKGluaXQpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dFRyaWFuZ2xlQ2FudmFzIGV4dGVuZHMgVHJpYW5nbGVDYW52YXMge1xyXG4gIGxpbmVzOiBMaW5lW10gPSBbXTtcclxuICBpbnRlcnNlY3Rpb25Qb2ludHM6IFBvaW50W10gPSBbXTtcclxuXHJcbiAgbW91c2VQb3M6IFBvaW50ID0gbmV3IFBvaW50KDAsIDApO1xyXG4gIHNlbGVjdGVkUG9pbnQ6IFBvaW50IHwgbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgc3VwZXIoY29uZmlnIGFzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnKTtcclxuICAgIHRoaXMucnVuVXNlckV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsZWFyQWxsKCkge1xyXG4gICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgdGhpcy5saW5lcyA9IFtdO1xyXG4gICAgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMgPSBbXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlTW91c2VQb3MoZTogUG9pbnRlckV2ZW50KSB7XHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy5jYW52YXNFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgdGhpcy5tb3VzZVBvcy54ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xyXG4gICAgdGhpcy5tb3VzZVBvcy55ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1lcmdlUG9pbnRXaXRoSW50ZXJzZWN0aW9uUG9pbnRzKHBvaW50OiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKFxyXG4gICAgICBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gICAgICAgIHBvaW50LFxyXG4gICAgICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLFxyXG4gICAgICAgIHRoaXMuY29uZmlnLm1lcmdlUmFkaXVzXHJcbiAgICAgIClcclxuICAgIClcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1lcmdlUG9pbnRXaXRoR3JpZChwb2ludDogUG9pbnQpOiBib29sZWFuIHtcclxuICAgIGxldCBzaXplID0gdGhpcy5jb25maWcuZ3JpZENlbGxTaXplO1xyXG4gICAgbGV0IGN4ID0gTWF0aC5mbG9vcihwb2ludC54IC8gc2l6ZSk7XHJcbiAgICBsZXQgY3kgPSBNYXRoLmZsb29yKHBvaW50LnkgLyBzaXplKTtcclxuICAgIGxldCBzdGFydFBvaW50ID0gbmV3IFBvaW50KGN4ICogc2l6ZSwgY3kgKiBzaXplKTtcclxuICAgIGxldCBncmlkUG9pbnRzID0gW1xyXG4gICAgICBzdGFydFBvaW50LFxyXG4gICAgICBuZXcgUG9pbnQoc3RhcnRQb2ludC54ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplLCBzdGFydFBvaW50LnkpLFxyXG4gICAgICBuZXcgUG9pbnQoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnkgKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUpLFxyXG4gICAgICBuZXcgUG9pbnQoXHJcbiAgICAgICAgc3RhcnRQb2ludC54ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplLFxyXG4gICAgICAgIHN0YXJ0UG9pbnQueSArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZVxyXG4gICAgICApLFxyXG4gICAgXTtcclxuICAgIGlmIChtZXJnZVBvaW50V2l0aFBvaW50KHBvaW50LCBncmlkUG9pbnRzLCB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUpKVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkSW50ZXJzZWN0aW9uUG9pbnQobGluZTogTGluZSkge1xyXG4gICAgZm9yIChsZXQgd2l0aExpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICBsZXQgcG9pbnQgPSBjaGVja0ludGVyc2VjdGlvbihsaW5lLCB3aXRoTGluZSk7XHJcbiAgICAgIGlmIChwb2ludCAhPSBudWxsKSB0aGlzLmludGVyc2VjdGlvblBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29ycmVjdFBvaW50UG9zKHBvaW50OiBQb2ludCkge1xyXG4gICAgbGV0IHJlcyA9IGZhbHNlO1xyXG4gICAgaWYgKCFyZXMpIHtcclxuICAgICAgcmVzID0gdGhpcy5tZXJnZVBvaW50V2l0aEludGVyc2VjdGlvblBvaW50cyhwb2ludCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlcykge1xyXG4gICAgICByZXMgPSBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMoXHJcbiAgICAgICAgcG9pbnQsXHJcbiAgICAgICAgdGhpcy5saW5lcyxcclxuICAgICAgICB0aGlzLmNvbmZpZy5tZXJnZVJhZGl1cyAqIDJcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICghcmVzKSB7XHJcbiAgICAgIHJlcyA9IG1lcmdlUG9pbnRXaXRoTGluZShwb2ludCwgdGhpcy5saW5lcywgdGhpcy5jb25maWcubWVyZ2VSYWRpdXMgKiAyKTtcclxuICAgIH1cclxuICAgIGlmICghcmVzICYmIHRoaXMuY29uZmlnLnVzZUdyaWQpIHtcclxuICAgICAgcmVzID0gdGhpcy5tZXJnZVBvaW50V2l0aEdyaWQocG9pbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0TW91c2VQb2ludCgpIHtcclxuICAgIHRoaXMuY29ycmVjdFBvaW50UG9zKHRoaXMubW91c2VQb3MpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0U2VsZWN0ZWRQb2ludCgpIHtcclxuICAgIGxldCBwb2ludCA9IG5ldyBQb2ludCh0aGlzLm1vdXNlUG9zLngsIHRoaXMubW91c2VQb3MueSk7XHJcbiAgICB0aGlzLmNvcnJlY3RQb2ludFBvcyhwb2ludCk7XHJcbiAgICB0aGlzLnNlbGVjdGVkUG9pbnQgPSBwb2ludC5jbG9uZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWRyYXcoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZShsaW5lLnN0YXJ0LCBsaW5lLmVuZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQobGluZS5zdGFydCk7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KGxpbmUuZW5kKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IHBvaW50IG9mIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzKSB7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KHBvaW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcnVuVXNlckV2ZW50cygpIHtcclxuICAgIGxldCBjYW52YXMgPSB0aGlzLmNhbnZhc0VsZW1lbnQ7XHJcblxyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLnBvaW50ZXJkb3duRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCB0aGlzLnBvaW50ZXJ1cEV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsICgpID0+IHt9LCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMucG9pbnRlcm1vdmVFdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcm1vdmVFdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICB0aGlzLnVwZGF0ZU1vdXNlUG9zKGUpO1xyXG4gICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuXHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZFBvaW50ICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZSh0aGlzLnNlbGVjdGVkUG9pbnQsIHRoaXMubW91c2VQb3MpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcmRvd25FdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICB0aGlzLnVwZGF0ZU1vdXNlUG9zKGUpO1xyXG4gICAgdGhpcy5jb3JyZWN0U2VsZWN0ZWRQb2ludCgpO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcnVwRXZlbnRIYW5kbGVyID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRQb2ludCA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0TW91c2VQb2ludCgpO1xyXG4gICAgbGV0IGxpbmUgPSBuZXcgTGluZSh0aGlzLnNlbGVjdGVkUG9pbnQuY2xvbmUoKSwgdGhpcy5tb3VzZVBvcy5jbG9uZSgpKTtcclxuICAgIHRoaXMuYWRkSW50ZXJzZWN0aW9uUG9pbnQobGluZSk7XHJcbiAgICB0aGlzLmxpbmVzLnB1c2gobGluZSk7XHJcbiAgICB0aGlzLnNlbGVjdGVkUG9pbnQgPSBudWxsO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSB9IGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IHtcclxuICBDb2xvckdlbmVyYXRvcixcclxuICBUcmlhbmdsZUNhbnZhcyxcclxuICBUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi90cmlhbmdsZWNhbnZhc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnIGV4dGVuZHMgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZz4pIHtcclxuICAgIHN1cGVyKGluaXQpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBPdXRwdXRUcmlhbmdsZUNhbnZhcyBleHRlbmRzIFRyaWFuZ2xlQ2FudmFzIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgc3VwZXIoY29uZmlnIGFzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3TGluZXMoXHJcbiAgICBsaW5lczogTGluZVtdLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZShsaW5lLnN0YXJ0LCBsaW5lLmVuZCwgY29sb3IsIGxpbmVXaWR0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1BvaW50cyhcclxuICAgIHBvaW50czogUG9pbnRbXSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIHBvaW50U2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcucG9pbnRTaXplXHJcbiAgKSB7XHJcbiAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpIHtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQocG9pbnQsIGNvbG9yLCBwb2ludFNpemUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdUcmlhbmdsZXMoXHJcbiAgICB0cmlhbmdsZXM6IFRyaWFuZ2xlW10sXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgZm9yIChsZXQgdHJpYW5nbGUgb2YgdHJpYW5nbGVzKSB7XHJcbiAgICAgIHRoaXMuZHJhd1RyaWFuZ2xlKHRyaWFuZ2xlLCBjb2xvciwgbGluZVdpZHRoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yR2VuZXJhdG9yIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2VuZXJhdGU6ICgpID0+IHN0cmluZykge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIHtcclxuICBwdWJsaWMgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID1cclxuICAgIFwiIzAwMDAwMFwiO1xyXG4gIHB1YmxpYyBsaW5lV2lkdGg6IG51bWJlciA9IDM7XHJcbiAgcHVibGljIHBvaW50U2l6ZTogbnVtYmVyID0gNTtcclxuICBwdWJsaWMgY2FudmFzSWQ6IHN0cmluZyA9IFwiY2FudmFzXCI7XHJcblxyXG4gIHB1YmxpYyB1c2VHcmlkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGdyaWRDb2xvcjogc3RyaW5nID0gXCIjNTA1MDUwXCI7XHJcbiAgcHVibGljIGdyaWRMaW5lV2lkdGg6IG51bWJlciA9IDE7XHJcbiAgcHVibGljIGdyaWRDZWxsU2l6ZTogbnVtYmVyID0gNDA7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxUcmlhbmdsZUNhbnZhc0NvbmZpZz4pIHtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgaW5pdCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDYW52YXMge1xyXG4gIGNhbnZhc0VsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICBvblJlc2l6ZSA9IChlOiBVSUV2ZW50KSA9PiB7XHJcbiAgICBsZXQgdGVtcCA9IHRoaXMuY3R4LmdldEltYWdlRGF0YShcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0XHJcbiAgICApO1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodCA9IHRoaXMuY2FudmFzRWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICB0aGlzLmN0eC5wdXRJbWFnZURhdGEodGVtcCwgMCwgMCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogVHJpYW5nbGVDYW52YXNDb25maWcpIHtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBjb25maWcuY2FudmFzSWRcclxuICAgICkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMub25SZXNpemUsIGZhbHNlKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXNFbGVtZW50LmdldENvbnRleHQoXCIyZFwiLCB7XHJcbiAgICAgIHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSxcclxuICAgIH0pIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHRoaXMuY3R4LmxpbmVDYXAgPSAncm91bmQnO1xyXG5cclxuICAgIGlmICh0aGlzLmNvbmZpZy51c2VHcmlkKSB7XHJcbiAgICAgIHRoaXMuZHJhd0dyaWQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3R3JpZChcclxuICAgIGNvbG9yOiBzdHJpbmcgPSB0aGlzLmNvbmZpZy5ncmlkQ29sb3IsXHJcbiAgICBzaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemVcclxuICApIHtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDE7XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPD0gdGhpcy5jYW52YXNFbGVtZW50LndpZHRoOyB4ICs9IHNpemUpIHtcclxuICAgICAgdGhpcy5jdHgubW92ZVRvKHggKyAwLjUsIDApO1xyXG4gICAgICB0aGlzLmN0eC5saW5lVG8oeCArIDAuNSwgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPD0gdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodDsgeSArPSBzaXplKSB7XHJcbiAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB5ICsgMC41KTtcclxuICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCwgeSArIDAuNSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0xpbmUoXHJcbiAgICBmcm9tOiBQb2ludCxcclxuICAgIHRvOiBQb2ludCxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yR2VuZXJhdG9yKVxyXG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICB0aGlzLmN0eC5tb3ZlVG8oZnJvbS54LCBmcm9tLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRvLngsIHRvLnkpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1BvaW50KFxyXG4gICAgcG9pbnQ6IFBvaW50LFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgcG9pbnRTaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5wb2ludFNpemVcclxuICApIHtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JHZW5lcmF0b3IpIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgbGV0IHNpemUgPSBwb2ludFNpemU7XHJcbiAgICB0aGlzLmN0eC5maWxsUmVjdChwb2ludC54IC0gc2l6ZSAvIDIsIHBvaW50LnkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3VHJpYW5nbGUoXHJcbiAgICB0cmlhbmdsZTogVHJpYW5nbGUsXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvckdlbmVyYXRvcikgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3IuZ2VuZXJhdGUoKTtcclxuICAgIGVsc2UgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcclxuICAgIHRoaXMuY3R4Lm1vdmVUbyh0cmlhbmdsZS5wMS54LCB0cmlhbmdsZS5wMS55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0cmlhbmdsZS5wMi54LCB0cmlhbmdsZS5wMi55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0cmlhbmdsZS5wMy54LCB0cmlhbmdsZS5wMy55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0cmlhbmdsZS5wMS54LCB0cmlhbmdsZS5wMS55KTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsZWFyQ2FudmFzKCkge1xyXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHRcclxuICAgICk7XHJcbiAgICBpZiAodGhpcy5jb25maWcudXNlR3JpZCkge1xyXG4gICAgICB0aGlzLmRyYXdHcmlkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcbmltcG9ydCB7XHJcbiAgQ29sb3JHZW5lcmF0b3IsXHJcbiAgVHJpYW5nbGVDYW52YXMsXHJcbiAgVHJpYW5nbGVDYW52YXNDb25maWcsXHJcbn0gZnJvbSBcIi4vdHJpYW5nbGVjYW52YXNcIjtcclxuaW1wb3J0IHsgVHJpYW5nbGVzQ2FsY3VsYXRvciB9IGZyb20gXCIuL2NhbGN1bGF0aW9uXCI7XHJcbmltcG9ydCB7XHJcbiAgSW5wdXRUcmlhbmdsZUNhbnZhcyxcclxuICBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL2lucHV0dHJpYW5nbGVjYW52YXNcIjtcclxuaW1wb3J0IHtcclxuICBPdXRwdXRUcmlhbmdsZUNhbnZhcyxcclxuICBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi9vdXRwdXR0cmlhbmdsZWNhbnZhc1wiO1xyXG5cclxubGV0IGNhbnZhcyA9IG5ldyBJbnB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKHtcclxuICAgIGNvbG9yOiBcIndoaXRlXCIsXHJcbiAgICBsaW5lV2lkdGg6IDIsXHJcbiAgICBwb2ludFNpemU6IDgsXHJcbiAgICBjYW52YXNJZDogXCJjYW52YXNcIixcclxuICAgIG1lcmdlUmFkaXVzOiAyNSxcclxuICAgIHVzZUdyaWQ6IHRydWUsXHJcbiAgICBncmlkQ2VsbFNpemU6IDQwLFxyXG4gICAgZ3JpZExpbmVXaWR0aDogMjBcclxuICB9KVxyXG4pO1xyXG5cclxubGV0IGNvbm5lY3Rpb25zQ2FudmFzID0gbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyh7XHJcbiAgICBjb2xvcjogbmV3IENvbG9yR2VuZXJhdG9yKFxyXG4gICAgICAoKSA9PlxyXG4gICAgICAgIFwiI1wiICtcclxuICAgICAgICAoXHJcbiAgICAgICAgICBcIjAwMDAwXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygxNiwgNikpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICkuc2xpY2UoLTYpICtcclxuICAgICAgICBcIjUwXCJcclxuICAgICksXHJcbiAgICBsaW5lV2lkdGg6IDMsXHJcbiAgICBwb2ludFNpemU6IDgsXHJcbiAgICBjYW52YXNJZDogXCJjb25uZWN0aW9uc1wiXHJcbiAgfSlcclxuKTtcclxuXHJcbmxldCBzaG93VHJpYW5nbGVJbmRleCA9IDA7XHJcbmxldCB0cmlhbmdsZWNhbnZhcyA9IG5ldyBPdXRwdXRUcmlhbmdsZUNhbnZhcyhcclxuICBuZXcgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcoe1xyXG4gICAgY29sb3I6IFwiYmxhY2tcIixcclxuICAgIGxpbmVXaWR0aDogMixcclxuICAgIHBvaW50U2l6ZTogNCxcclxuICAgIGNhbnZhc0lkOiBcInRyaWFuZ2xlc1wiLFxyXG4gIH0pXHJcbik7XHJcblxyXG5sZXQgY2FsY3VsYXRvciA9IG5ldyBUcmlhbmdsZXNDYWxjdWxhdG9yKCk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGNhbnZhcy5jbGVhckFsbCgpO1xyXG4gIGNvbm5lY3Rpb25zQ2FudmFzLmNsZWFyQ2FudmFzKCk7XHJcbiAgdHJpYW5nbGVjYW52YXMuY2xlYXJDYW52YXMoKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1wcmV2XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmIChzaG93VHJpYW5nbGVJbmRleCA+IDApIHNob3dUcmlhbmdsZUluZGV4LS07XHJcbiAgdHJpYW5nbGVjYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGVzKGNhbGN1bGF0b3IudHJpYW5nbGVzLCBcImdyZXlcIik7XHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlKFxyXG4gICAgY2FsY3VsYXRvci50cmlhbmdsZXNbc2hvd1RyaWFuZ2xlSW5kZXhdLFxyXG4gICAgXCJyZWRcIixcclxuICAgIDRcclxuICApO1xyXG59KTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbmV4dFwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBpZiAoc2hvd1RyaWFuZ2xlSW5kZXggPCBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGggLSAxKSBzaG93VHJpYW5nbGVJbmRleCsrO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmNsZWFyQ2FudmFzKCk7XHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlcyhjYWxjdWxhdG9yLnRyaWFuZ2xlcywgXCJncmV5XCIpO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmRyYXdUcmlhbmdsZShcclxuICAgIGNhbGN1bGF0b3IudHJpYW5nbGVzW3Nob3dUcmlhbmdsZUluZGV4XSxcclxuICAgIFwicmVkXCIsXHJcbiAgICA0XHJcbiAgKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbGNcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FsY3VsYXRvci5jYWxjKGNhbnZhcy5saW5lcyk7XHJcbiAgY29ubmVjdGlvbnNDYW52YXMuZHJhd0xpbmVzKGNhbGN1bGF0b3IuY29ubmVjdGlvbnMpO1xyXG4gIGNvbm5lY3Rpb25zQ2FudmFzLmRyYXdQb2ludHMoY2FsY3VsYXRvci5wb2ludHMsIFwicmVkXCIpO1xyXG5cclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGVzKGNhbGN1bGF0b3IudHJpYW5nbGVzLCBcImdyZXlcIik7XHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlKFxyXG4gICAgY2FsY3VsYXRvci50cmlhbmdsZXNbc2hvd1RyaWFuZ2xlSW5kZXhdLFxyXG4gICAgXCJyZWRcIixcclxuICAgIDRcclxuICApO1xyXG5cclxuICAoXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWFuZ2xlcy1jb3VudFwiKSBhcyBIVE1MU3BhbkVsZW1lbnQgfCBudWxsXHJcbiAgKS50ZXh0Q29udGVudCA9IFN0cmluZyhjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGgpO1xyXG5cclxuICAoXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvaW50cy1jb3VudFwiKSBhcyBIVE1MU3BhbkVsZW1lbnQgfCBudWxsXHJcbiAgKS50ZXh0Q29udGVudCA9IFN0cmluZyhjYWxjdWxhdG9yLnBvaW50cy5sZW5ndGgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9