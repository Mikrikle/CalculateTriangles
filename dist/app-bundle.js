/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calculation.ts":
/*!****************************!*\
  !*** ./src/calculation.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkIntersection": () => (/* binding */ checkIntersection),
/* harmony export */   "distanceBetweenPoints": () => (/* binding */ distanceBetweenPoints),
/* harmony export */   "distanceFromPointToLine": () => (/* binding */ distanceFromPointToLine),
/* harmony export */   "linesToTriangle": () => (/* binding */ linesToTriangle),
/* harmony export */   "mergePointWithLine": () => (/* binding */ mergePointWithLine),
/* harmony export */   "mergePointWithLinePoints": () => (/* binding */ mergePointWithLinePoints),
/* harmony export */   "mergePointWithPoint": () => (/* binding */ mergePointWithPoint)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/core.ts");

function linesToTriangle(l1, l2, l3) {
    let hpoints = [l1.start, l1.end, l2.start, l2.end, l3.start, l3.end];
    hpoints = hpoints.filter((value, index, self) => index === self.findIndex((p) => (0,_core__WEBPACK_IMPORTED_MODULE_0__.isPointsEqual)(p, value)));
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
function distanceBetweenPoints(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
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
    return { point: new _core__WEBPACK_IMPORTED_MODULE_0__.Point(xx, yy), distace: Math.sqrt(dx * dx + dy * dy) };
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
            return new _core__WEBPACK_IMPORTED_MODULE_0__.Point(pointxx, pointyy);
        }
        else {
            return null;
        }
    }
}


/***/ }),

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "Point": () => (/* binding */ Point),
/* harmony export */   "Triangle": () => (/* binding */ Triangle),
/* harmony export */   "isLinesEqual": () => (/* binding */ isLinesEqual),
/* harmony export */   "isPointsEqual": () => (/* binding */ isPointsEqual),
/* harmony export */   "isTrianglesEqual": () => (/* binding */ isTrianglesEqual)
/* harmony export */ });
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
}
class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
class Triangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}
function isPointsEqual(a, b, alpha = 1) {
    return Math.abs(a.x - b.x) <= alpha && Math.abs(a.y - b.y) <= alpha;
}
function isLinesEqual(a, b, alpha = 1) {
    return ((isPointsEqual(a.start, b.start, alpha) && isPointsEqual(a.end, b.end, alpha)) ||
        (isPointsEqual(a.end, b.start, alpha) && isPointsEqual(a.start, b.end, alpha)));
}
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
/* harmony import */ var _calculation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./calculation */ "./src/calculation.ts");



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
        if ((0,_calculation__WEBPACK_IMPORTED_MODULE_2__.mergePointWithPoint)(point, this.intersectionPoints.reduce((accum, item) => {
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
        if ((0,_calculation__WEBPACK_IMPORTED_MODULE_2__.mergePointWithPoint)(point, gridPoints, this.config.gridCellSize))
            return true;
        return false;
    }
    addIntersectionPoint(line) {
        let points = [];
        for (let withLine of this.lines) {
            let point = (0,_calculation__WEBPACK_IMPORTED_MODULE_2__.checkIntersection)(line, withLine);
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
            res = (0,_calculation__WEBPACK_IMPORTED_MODULE_2__.mergePointWithLinePoints)(point, this.lines, this.config.mergeRadius * 2);
        }
        if (!res) {
            res = (0,_calculation__WEBPACK_IMPORTED_MODULE_2__.mergePointWithLine)(point, this.lines, this.config.mergeRadius * 2);
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
    outputCanvas.drawLines(calculator.lines, "grey", 1);
    outputCanvas.drawPoints(calculator.points, "gray", 5);
    outputCanvas.drawTriangle(calculator.triangles[showTriangleIndex], "red", 4);
}
function drawTrianglesSelector() {
    if (trianglesSelector && calculator.triangles.length > 0) {
        trianglesSelector.textContent = `${showTriangleIndex + 1} / ${calculator.triangles.length}`;
    }
}
document.getElementById("clear")?.addEventListener("click", () => {
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
    if (showTriangleIndex > 0)
        showTriangleIndex--;
    drawOutputCanvas();
    drawTrianglesSelector();
});
document.getElementById("btn-next")?.addEventListener("click", () => {
    if (showTriangleIndex < calculator.triangles.length - 1)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLENBQUMsQ0FBQztBQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUM5RCxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY2FsY3VsYXRpb24udHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2lucHV0dHJpYW5nbGVjYW52YXMudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL291dHB1dHRyaWFuZ2xlY2FudmFzLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy90cmlhbmdsZWNhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIFBvaW50LFxyXG4gIExpbmUsXHJcbiAgVHJpYW5nbGUsXHJcbiAgaXNQb2ludHNFcXVhbFxyXG59IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsaW5lc1RvVHJpYW5nbGUobDE6IExpbmUsIGwyOiBMaW5lLCBsMzogTGluZSk6IFRyaWFuZ2xlIHwgbnVsbCB7XHJcbiAgbGV0IGhwb2ludHMgPSBbbDEuc3RhcnQsIGwxLmVuZCwgbDIuc3RhcnQsIGwyLmVuZCwgbDMuc3RhcnQsIGwzLmVuZF07XHJcbiAgaHBvaW50cyA9IGhwb2ludHMuZmlsdGVyKFxyXG4gICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChwKSA9PiBpc1BvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICApO1xyXG4gIGlmIChocG9pbnRzLmxlbmd0aCAhPSAzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgdmFyIGEgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDEuc3RhcnQsIGwxLmVuZCk7XHJcbiAgdmFyIGIgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDIuc3RhcnQsIGwyLmVuZCk7XHJcbiAgdmFyIGMgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDMuc3RhcnQsIGwzLmVuZCk7XHJcblxyXG4gIGlmIChhID4gYiArIGMgfHwgYiA+IGEgKyBjIHx8IGMgPiBhICsgYikgcmV0dXJuIG51bGw7XHJcbiAgY29uc3QgcCA9IChhICsgYiArIGMpIC8gMjtcclxuICBsZXQgUyA9IChwICogKHAgLSBhKSAqIChwIC0gYikgKiAocCAtIGMpKSAqKiAwLjU7XHJcbiAgaWYgKGlzTmFOKFMpIHx8IE1hdGguYWJzKFMpIDw9IDEpIHJldHVybiBudWxsO1xyXG4gIHJldHVybiBuZXcgVHJpYW5nbGUoaHBvaW50c1swXSwgaHBvaW50c1sxXSwgaHBvaW50c1syXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBwb2ludHM6IFBvaW50W10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCB0b1BvaW50IG9mIHBvaW50cykge1xyXG4gICAgbGV0IGRpc3RhY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHRvUG9pbnQpO1xyXG4gICAgaWYgKGRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBkaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHRvUG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBkaXN0U3RhcnQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuc3RhcnQpO1xyXG4gICAgbGV0IGRpc3RFbmQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuZW5kKTtcclxuXHJcbiAgICBpZiAoTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluUG9pbnQgPSBkaXN0U3RhcnQgPCBkaXN0RW5kID8gbGluZS5zdGFydCA6IGxpbmUuZW5kO1xyXG4gICAgICBtaW5EaXN0ID0gTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IHBkID0gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUocG9pbnQsIGxpbmUpO1xyXG4gICAgaWYgKHBkLmRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBwZC5kaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHBkLnBvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocDE6IFBvaW50LCBwMjogUG9pbnQpOiBudW1iZXIge1xyXG4gIHJldHVybiBNYXRoLnNxcnQoKHAxLnggLSBwMi54KSAqKiAyICsgKHAxLnkgLSBwMi55KSAqKiAyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lOiBMaW5lXHJcbik6IHsgcG9pbnQ6IFBvaW50OyBkaXN0YWNlOiBudW1iZXIgfSB7XHJcbiAgY29uc3QgQSA9IHBvaW50LnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgQiA9IHBvaW50LnkgLSBsaW5lLnN0YXJ0Lnk7XHJcbiAgY29uc3QgQyA9IGxpbmUuZW5kLnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgRCA9IGxpbmUuZW5kLnkgLSBsaW5lLnN0YXJ0Lnk7XHJcblxyXG4gIGxldCBkb3QgPSBBICogQyArIEIgKiBEO1xyXG4gIGxldCBsZW5fc3EgPSBDICogQyArIEQgKiBEO1xyXG4gIGxldCBwYXJhbSA9IC0xO1xyXG4gIGlmIChsZW5fc3EgIT0gMCkge1xyXG4gICAgcGFyYW0gPSBkb3QgLyBsZW5fc3E7XHJcbiAgfVxyXG4gIGxldCB4eCA9IDA7XHJcbiAgbGV0IHl5ID0gMDtcclxuXHJcbiAgaWYgKHBhcmFtIDwgMCkge1xyXG4gICAgeHggPSBsaW5lLnN0YXJ0Lng7XHJcbiAgICB5eSA9IGxpbmUuc3RhcnQueTtcclxuICB9IGVsc2UgaWYgKHBhcmFtID4gMSkge1xyXG4gICAgeHggPSBsaW5lLmVuZC54O1xyXG4gICAgeXkgPSBsaW5lLmVuZC55O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB4eCA9IGxpbmUuc3RhcnQueCArIHBhcmFtICogQztcclxuICAgIHl5ID0gbGluZS5zdGFydC55ICsgcGFyYW0gKiBEO1xyXG4gIH1cclxuXHJcbiAgbGV0IGR4ID0gcG9pbnQueCAtIHh4O1xyXG4gIGxldCBkeSA9IHBvaW50LnkgLSB5eTtcclxuXHJcbiAgcmV0dXJuIHsgcG9pbnQ6IG5ldyBQb2ludCh4eCwgeXkpLCBkaXN0YWNlOiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ludGVyc2VjdGlvbihsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBQb2ludCB8IG51bGwge1xyXG4gIGxldCBjaGVja2VkUG9pbnRzID0gW2xpbmUxLnN0YXJ0LCBsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0LCBsaW5lMi5lbmRdO1xyXG4gIGxldCBBOiBudW1iZXIsIEI6IG51bWJlciwgQzogbnVtYmVyO1xyXG4gIGxldCBwb2ludHh4OiBudW1iZXIsIHBvaW50eXk6IG51bWJlcjtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTIsIGxpbmUxLnN0YXJ0KSkgcmV0dXJuIGxpbmUxLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5lbmQpKSByZXR1cm4gbGluZTEuZW5kO1xyXG5cclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMSwgbGluZTIuc3RhcnQpKSByZXR1cm4gbGluZTIuc3RhcnQ7XHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLmVuZCkpIHJldHVybiBsaW5lMi5lbmQ7XHJcblxyXG4gIHJldHVybiBUZW1wQ2hlY2soKTtcclxuXHJcbiAgZnVuY3Rpb24gaXNQb2ludE9uTGluZShsOiBMaW5lLCBjOiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHAxID0gbC5zdGFydDtcclxuICAgIGxldCBwMiA9IGwuZW5kO1xyXG5cclxuICAgIGxldCBkeDEgPSBwMi54IC0gcDEueDtcclxuICAgIGxldCBkeTEgPSBwMi55IC0gcDEueTtcclxuXHJcbiAgICBsZXQgZHggPSBjLnggLSBwMS54O1xyXG4gICAgbGV0IGR5ID0gYy55IC0gcDEueTtcclxuXHJcbiAgICBsZXQgUyA9IGR4MSAqIGR5IC0gZHggKiBkeTE7XHJcbiAgICBsZXQgYWIgPSBNYXRoLnNxcnQoZHgxICogZHgxICsgZHkxICogZHkxKTtcclxuICAgIGxldCBoID0gUyAvIGFiO1xyXG4gICAgcmV0dXJuIE1hdGguYWJzKGgpIDwgMC4xO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVkVLKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGJ4OiBudW1iZXIsIGJ5OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBheCAqIGJ5IC0gYnggKiBheTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIENyb3NzaW5nQ2hlY2socDE6IFBvaW50LCBwMjogUG9pbnQsIHAzOiBQb2ludCwgcDQ6IFBvaW50KSB7XHJcbiAgICBsZXQgdjEsIHYyLCB2MywgdjQ7XHJcblxyXG4gICAgdjEgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMS54IC0gcDMueCwgcDEueSAtIHAzLnkpO1xyXG4gICAgdjIgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMi54IC0gcDMueCwgcDIueSAtIHAzLnkpO1xyXG4gICAgdjMgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwMy54IC0gcDEueCwgcDMueSAtIHAxLnkpO1xyXG4gICAgdjQgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwNC54IC0gcDEueCwgcDQueSAtIHAxLnkpO1xyXG4gICAgaWYgKHYxICogdjIgPCAwICYmIHYzICogdjQgPCAwKSByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gRXF1YXRpb25PZlRoZUxpbmUocDE6IFBvaW50LCBwMjogUG9pbnQpIHtcclxuICAgIEEgPSBwMi55IC0gcDEueTtcclxuICAgIEIgPSBwMS54IC0gcDIueDtcclxuICAgIEMgPSAtcDEueCAqIChwMi55IC0gcDEueSkgKyBwMS55ICogKHAyLnggLSBwMS54KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblgoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeCwgcG9pbnR4O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHggPSAtYzEgKiBiMiArIGIxICogYzI7XHJcbiAgICBwb2ludHggPSBkeCAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gSW50ZXJzZWN0aW9uWShcclxuICAgIGExOiBudW1iZXIsXHJcbiAgICBiMTogbnVtYmVyLFxyXG4gICAgYzE6IG51bWJlcixcclxuICAgIGEyOiBudW1iZXIsXHJcbiAgICBiMjogbnVtYmVyLFxyXG4gICAgYzI6IG51bWJlclxyXG4gICkge1xyXG4gICAgbGV0IGQsIGR5LCBwb2ludHk7XHJcbiAgICBkID0gYTEgKiBiMiAtIGIxICogYTI7XHJcbiAgICBkeSA9IC1hMSAqIGMyICsgYzEgKiBhMjtcclxuICAgIHBvaW50eSA9IGR5IC8gZDtcclxuICAgIHJldHVybiBwb2ludHk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBUZW1wQ2hlY2soKTogUG9pbnQgfCBudWxsIHtcclxuICAgIGlmIChcclxuICAgICAgQ3Jvc3NpbmdDaGVjayhcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzBdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMV0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1syXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzNdXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICBsZXQgYTEsIGIxLCBjMSwgYTIsIGIyLCBjMjtcclxuICAgICAgRXF1YXRpb25PZlRoZUxpbmUoY2hlY2tlZFBvaW50c1swXSwgY2hlY2tlZFBvaW50c1sxXSk7XHJcbiAgICAgIGExID0gQTtcclxuICAgICAgYjEgPSBCO1xyXG4gICAgICBjMSA9IEM7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMl0sIGNoZWNrZWRQb2ludHNbM10pO1xyXG4gICAgICBhMiA9IEE7XHJcbiAgICAgIGIyID0gQjtcclxuICAgICAgYzIgPSBDO1xyXG4gICAgICBwb2ludHh4ID0gSW50ZXJzZWN0aW9uWChhMSwgYjEsIGMxLCBhMiwgYjIsIGMyKTtcclxuICAgICAgcG9pbnR5eSA9IEludGVyc2VjdGlvblkoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHJldHVybiBuZXcgUG9pbnQocG9pbnR4eCwgcG9pbnR5eSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFBvaW50IHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgeDogbnVtYmVyLCBwdWJsaWMgeTogbnVtYmVyKSB7fVxyXG5cclxuICBwdWJsaWMgY2xvbmUoKTogUG9pbnQge1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHN0YXJ0OiBQb2ludCwgcHVibGljIGVuZDogUG9pbnQpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHAxOiBQb2ludCwgcHVibGljIHAyOiBQb2ludCwgcHVibGljIHAzOiBQb2ludCkge31cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRzRXF1YWwoYTogUG9pbnQsIGI6IFBvaW50LCBhbHBoYTogbnVtYmVyID0gMSk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBNYXRoLmFicyhhLnggLSBiLngpIDw9IGFscGhhICYmIE1hdGguYWJzKGEueSAtIGIueSkgPD0gYWxwaGE7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xpbmVzRXF1YWwoYTogTGluZSwgYjogTGluZSwgYWxwaGE6IG51bWJlciA9IDEpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgKGlzUG9pbnRzRXF1YWwoYS5zdGFydCwgYi5zdGFydCwgYWxwaGEpICYmIGlzUG9pbnRzRXF1YWwoYS5lbmQsIGIuZW5kLCBhbHBoYSkpIHx8XHJcbiAgICAoaXNQb2ludHNFcXVhbChhLmVuZCwgYi5zdGFydCwgYWxwaGEpICYmIGlzUG9pbnRzRXF1YWwoYS5zdGFydCwgYi5lbmQsIGFscGhhKSlcclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmlhbmdsZXNFcXVhbChhOiBUcmlhbmdsZSwgYjogVHJpYW5nbGUsIGFscGhhOiBudW1iZXIgPSAxKTogYm9vbGVhbiB7XHJcbiAgbGV0IGVxdWFscyA9IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDEsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAxLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMSwgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDIsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAyLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMiwgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDMsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAzLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMywgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgcmV0dXJuIGVxdWFscyA9PT0gMztcclxufSIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSB9IGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IHsgVHJpYW5nbGVDYW52YXMsIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIH0gZnJvbSBcIi4vdHJpYW5nbGVjYW52YXNcIjtcclxuaW1wb3J0IHtcclxuICBjaGVja0ludGVyc2VjdGlvbixcclxuICBkaXN0YW5jZUJldHdlZW5Qb2ludHMsXHJcbiAgZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUsXHJcbiAgbWVyZ2VQb2ludFdpdGhMaW5lLFxyXG4gIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyxcclxuICBtZXJnZVBvaW50V2l0aFBvaW50LFxyXG59IGZyb20gXCIuL2NhbGN1bGF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyBleHRlbmRzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIHtcclxuICBwdWJsaWMgbWVyZ2VSYWRpdXM6IG51bWJlciA9IDUwO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoaW5pdD86IFBhcnRpYWw8SW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZz4pIHtcclxuICAgIHN1cGVyKGluaXQpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIERyYXdBY3Rpb24ge1xyXG4gIGxpbmU6IExpbmU7XHJcbiAgaXBvaW50czogUG9pbnRbXTtcclxufVxyXG5leHBvcnQgY2xhc3MgSW5wdXRUcmlhbmdsZUNhbnZhcyBleHRlbmRzIFRyaWFuZ2xlQ2FudmFzIHtcclxuICBsaW5lczogTGluZVtdID0gW107XHJcbiAgaW50ZXJzZWN0aW9uUG9pbnRzOiBbUG9pbnRbXV0gPSBbW11dO1xyXG4gIGNhbmNlbGxlZEFjdGlvbnM6IERyYXdBY3Rpb25bXSA9IFtdO1xyXG5cclxuICBtb3VzZVBvczogUG9pbnQgPSBuZXcgUG9pbnQoMCwgMCk7XHJcbiAgc2VsZWN0ZWRQb2ludDogUG9pbnQgfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcgYXMgVHJpYW5nbGVDYW52YXNDb25maWcpO1xyXG4gICAgdGhpcy5ydW5Vc2VyRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xlYXJBbGwoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLmxpbmVzID0gW107XHJcbiAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cyA9IFtbXV07XHJcbiAgICB0aGlzLmNhbmNlbGxlZEFjdGlvbnMgPSBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB1bmRvKCkge1xyXG4gICAgaWYgKHRoaXMubGluZXMubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgIHRoaXMuY2FuY2VsbGVkQWN0aW9ucy5wdXNoKHtcclxuICAgICAgbGluZTogdGhpcy5saW5lcy5wb3AoKSxcclxuICAgICAgaXBvaW50czpcclxuICAgICAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cy5sZW5ndGggPiAwID8gdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMucG9wKCkgOiBbXSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWRvKCkge1xyXG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkQWN0aW9ucy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgbGV0IHNhdmVkQWN0aW9uID0gdGhpcy5jYW5jZWxsZWRBY3Rpb25zLnBvcCgpO1xyXG4gICAgdGhpcy5saW5lcy5wdXNoKHNhdmVkQWN0aW9uLmxpbmUpO1xyXG4gICAgaWYgKHNhdmVkQWN0aW9uLmlwb2ludHMubGVuZ3RoID4gMClcclxuICAgICAgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMucHVzaChzYXZlZEFjdGlvbi5pcG9pbnRzKTtcclxuICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZU1vdXNlUG9zKGU6IFBvaW50ZXJFdmVudCkge1xyXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuY2FudmFzRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMubW91c2VQb3MueCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgIHRoaXMubW91c2VQb3MueSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtZXJnZVBvaW50V2l0aEludGVyc2VjdGlvblBvaW50cyhwb2ludDogUG9pbnQpOiBib29sZWFuIHtcclxuICAgIGlmIChcclxuICAgICAgbWVyZ2VQb2ludFdpdGhQb2ludChcclxuICAgICAgICBwb2ludCxcclxuICAgICAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cy5yZWR1Y2UoKGFjY3VtLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBhY2N1bS5wdXNoKC4uLml0ZW0pO1xyXG4gICAgICAgICAgcmV0dXJuIGFjY3VtO1xyXG4gICAgICAgIH0sIFtdKSxcclxuICAgICAgICB0aGlzLmNvbmZpZy5tZXJnZVJhZGl1c1xyXG4gICAgICApXHJcbiAgICApXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtZXJnZVBvaW50V2l0aEdyaWQocG9pbnQ6IFBvaW50KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgc2l6ZSA9IHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZTtcclxuICAgIGxldCBjeCA9IE1hdGguZmxvb3IocG9pbnQueCAvIHNpemUpO1xyXG4gICAgbGV0IGN5ID0gTWF0aC5mbG9vcihwb2ludC55IC8gc2l6ZSk7XHJcbiAgICBsZXQgc3RhcnRQb2ludCA9IG5ldyBQb2ludChjeCAqIHNpemUsIGN5ICogc2l6ZSk7XHJcbiAgICBsZXQgZ3JpZFBvaW50cyA9IFtcclxuICAgICAgc3RhcnRQb2ludCxcclxuICAgICAgbmV3IFBvaW50KHN0YXJ0UG9pbnQueCArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZSwgc3RhcnRQb2ludC55KSxcclxuICAgICAgbmV3IFBvaW50KHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplKSxcclxuICAgICAgbmV3IFBvaW50KFxyXG4gICAgICAgIHN0YXJ0UG9pbnQueCArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZSxcclxuICAgICAgICBzdGFydFBvaW50LnkgKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemVcclxuICAgICAgKSxcclxuICAgIF07XHJcbiAgICBpZiAobWVyZ2VQb2ludFdpdGhQb2ludChwb2ludCwgZ3JpZFBvaW50cywgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplKSlcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZEludGVyc2VjdGlvblBvaW50KGxpbmU6IExpbmUpIHtcclxuICAgIGxldCBwb2ludHM6IFBvaW50W10gPSBbXTtcclxuICAgIGZvciAobGV0IHdpdGhMaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgbGV0IHBvaW50ID0gY2hlY2tJbnRlcnNlY3Rpb24obGluZSwgd2l0aExpbmUpO1xyXG4gICAgICBpZiAocG9pbnQgIT0gbnVsbCkgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgfVxyXG4gICAgaWYgKHBvaW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLnB1c2gocG9pbnRzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29ycmVjdFBvaW50UG9zKHBvaW50OiBQb2ludCkge1xyXG4gICAgbGV0IHJlcyA9IGZhbHNlO1xyXG4gICAgaWYgKCFyZXMpIHtcclxuICAgICAgcmVzID0gdGhpcy5tZXJnZVBvaW50V2l0aEludGVyc2VjdGlvblBvaW50cyhwb2ludCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlcykge1xyXG4gICAgICByZXMgPSBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMoXHJcbiAgICAgICAgcG9pbnQsXHJcbiAgICAgICAgdGhpcy5saW5lcyxcclxuICAgICAgICB0aGlzLmNvbmZpZy5tZXJnZVJhZGl1cyAqIDJcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICghcmVzKSB7XHJcbiAgICAgIHJlcyA9IG1lcmdlUG9pbnRXaXRoTGluZShwb2ludCwgdGhpcy5saW5lcywgdGhpcy5jb25maWcubWVyZ2VSYWRpdXMgKiAyKTtcclxuICAgIH1cclxuICAgIGlmICghcmVzICYmIHRoaXMuY29uZmlnLnVzZUdyaWQpIHtcclxuICAgICAgcmVzID0gdGhpcy5tZXJnZVBvaW50V2l0aEdyaWQocG9pbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0TW91c2VQb2ludCgpIHtcclxuICAgIHRoaXMuY29ycmVjdFBvaW50UG9zKHRoaXMubW91c2VQb3MpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0U2VsZWN0ZWRQb2ludCgpIHtcclxuICAgIGxldCBwb2ludCA9IG5ldyBQb2ludCh0aGlzLm1vdXNlUG9zLngsIHRoaXMubW91c2VQb3MueSk7XHJcbiAgICB0aGlzLmNvcnJlY3RQb2ludFBvcyhwb2ludCk7XHJcbiAgICB0aGlzLnNlbGVjdGVkUG9pbnQgPSBwb2ludC5jbG9uZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWRyYXcoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZShsaW5lLnN0YXJ0LCBsaW5lLmVuZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQobGluZS5zdGFydCk7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KGxpbmUuZW5kKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGlwb2ludHMgb2YgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgZm9yIChsZXQgcG9pbnQgb2YgaXBvaW50cykge1xyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50KHBvaW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBydW5Vc2VyRXZlbnRzKCkge1xyXG4gICAgbGV0IGNhbnZhcyA9IHRoaXMuY2FudmFzRWxlbWVudDtcclxuXHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMucG9pbnRlcmRvd25FdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMucG9pbnRlcnVwRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgKCkgPT4ge30sIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5wb2ludGVybW92ZUV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVybW92ZUV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG5cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUG9pbnQgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludCwgdGhpcy5tb3VzZVBvcyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVyZG93bkV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNvcnJlY3RTZWxlY3RlZFBvaW50KCk7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVydXBFdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZFBvaW50ID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RNb3VzZVBvaW50KCk7XHJcbiAgICBsZXQgbGluZSA9IG5ldyBMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludC5jbG9uZSgpLCB0aGlzLm1vdXNlUG9zLmNsb25lKCkpO1xyXG4gICAgdGhpcy5hZGRJbnRlcnNlY3Rpb25Qb2ludChsaW5lKTtcclxuICAgIHRoaXMubGluZXMucHVzaChsaW5lKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRQb2ludCA9IG51bGw7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQge1xyXG4gIENvbG9yR2VuZXJhdG9yLFxyXG4gIFRyaWFuZ2xlQ2FudmFzLFxyXG4gIFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyB7XHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGluaXQ/OiBQYXJ0aWFsPE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgc3VwZXIoaW5pdCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGluaXQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE91dHB1dFRyaWFuZ2xlQ2FudmFzIGV4dGVuZHMgVHJpYW5nbGVDYW52YXMge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25maWc6IE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcgYXMgVHJpYW5nbGVDYW52YXNDb25maWcpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdMaW5lcyhcclxuICAgIGxpbmVzOiBMaW5lW10sXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKGxpbmUuc3RhcnQsIGxpbmUuZW5kLCBjb2xvciwgbGluZVdpZHRoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3UG9pbnRzKFxyXG4gICAgcG9pbnRzOiBQb2ludFtdLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgcG9pbnRTaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5wb2ludFNpemVcclxuICApIHtcclxuICAgIGZvciAobGV0IHBvaW50IG9mIHBvaW50cykge1xyXG4gICAgICB0aGlzLmRyYXdQb2ludChwb2ludCwgY29sb3IsIHBvaW50U2l6ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1RyaWFuZ2xlcyhcclxuICAgIHRyaWFuZ2xlczogVHJpYW5nbGVbXSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICBmb3IgKGxldCB0cmlhbmdsZSBvZiB0cmlhbmdsZXMpIHtcclxuICAgICAgdGhpcy5kcmF3VHJpYW5nbGUodHJpYW5nbGUsIGNvbG9yLCBsaW5lV2lkdGgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JHZW5lcmF0b3Ige1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBnZW5lcmF0ZTogKCkgPT4gc3RyaW5nKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPVxyXG4gICAgXCIjMDAwMDAwXCI7XHJcbiAgcHVibGljIGxpbmVXaWR0aDogbnVtYmVyID0gMztcclxuICBwdWJsaWMgcG9pbnRTaXplOiBudW1iZXIgPSA1O1xyXG4gIHB1YmxpYyBjYW52YXNJZDogc3RyaW5nID0gXCJjYW52YXNcIjtcclxuXHJcbiAgcHVibGljIHVzZUdyaWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgZ3JpZENvbG9yOiBzdHJpbmcgPSBcIiM1MDUwNTBcIjtcclxuICBwdWJsaWMgZ3JpZExpbmVXaWR0aDogbnVtYmVyID0gMTtcclxuICBwdWJsaWMgZ3JpZENlbGxTaXplOiBudW1iZXIgPSA0MDtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGluaXQ/OiBQYXJ0aWFsPFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZUNhbnZhcyB7XHJcbiAgY2FudmFzRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG4gIG9uUmVzaXplID0gKGU6IFVJRXZlbnQpID0+IHtcclxuICAgIGxldCB0ZW1wID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHRcclxuICAgICk7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIHRoaXMuY3R4LnB1dEltYWdlRGF0YSh0ZW1wLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIGNvbmZpZy5jYW52YXNJZFxyXG4gICAgKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCA9IHRoaXMuY2FudmFzRWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQgPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5vblJlc2l6ZSwgZmFsc2UpO1xyXG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIsIHtcclxuICAgICAgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlLFxyXG4gICAgfSkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgdGhpcy5jdHgubGluZUNhcCA9IFwicm91bmRcIjtcclxuXHJcbiAgICBpZiAodGhpcy5jb25maWcudXNlR3JpZCkge1xyXG4gICAgICB0aGlzLmRyYXdHcmlkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0dyaWQoXHJcbiAgICBjb2xvcjogc3RyaW5nID0gdGhpcy5jb25maWcuZ3JpZENvbG9yLFxyXG4gICAgc2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcuZ3JpZENlbGxTaXplXHJcbiAgKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAxO1xyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDw9IHRoaXMuY2FudmFzRWxlbWVudC53aWR0aDsgeCArPSBzaXplKSB7XHJcbiAgICAgIHRoaXMuY3R4Lm1vdmVUbyh4ICsgMC41LCAwKTtcclxuICAgICAgdGhpcy5jdHgubGluZVRvKHggKyAwLjUsIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDw9IHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQ7IHkgKz0gc2l6ZSkge1xyXG4gICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgeSArIDAuNSk7XHJcbiAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsIHkgKyAwLjUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdMaW5lKFxyXG4gICAgZnJvbTogUG9pbnQsXHJcbiAgICB0bzogUG9pbnQsXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgaWYgKCFmcm9tIHx8ICF0bykgcmV0dXJuO1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvckdlbmVyYXRvcilcclxuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xyXG4gICAgdGhpcy5jdHgubW92ZVRvKGZyb20ueCwgZnJvbS55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0by54LCB0by55KTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdQb2ludChcclxuICAgIHBvaW50OiBQb2ludCxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIHBvaW50U2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcucG9pbnRTaXplXHJcbiAgKSB7XHJcbiAgICBpZiAoIXBvaW50KSByZXR1cm47XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yR2VuZXJhdG9yKSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgIGxldCBzaXplID0gcG9pbnRTaXplO1xyXG4gICAgdGhpcy5jdHguZmlsbFJlY3QocG9pbnQueCAtIHNpemUgLyAyLCBwb2ludC55IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1RyaWFuZ2xlKFxyXG4gICAgdHJpYW5nbGU6IFRyaWFuZ2xlLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIGlmICghdHJpYW5nbGUpIHJldHVybjtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JHZW5lcmF0b3IpIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICB0aGlzLmN0eC5tb3ZlVG8odHJpYW5nbGUucDEueCwgdHJpYW5nbGUucDEueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDIueCwgdHJpYW5nbGUucDIueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDMueCwgdHJpYW5nbGUucDMueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDEueCwgdHJpYW5nbGUucDEueSk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbGVhckNhbnZhcygpIHtcclxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdChcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0XHJcbiAgICApO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLnVzZUdyaWQpIHtcclxuICAgICAgdGhpcy5kcmF3R3JpZCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmFwcC1idW5kbGUuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsImltcG9ydCB7XHJcbiAgSW5wdXRUcmlhbmdsZUNhbnZhcyxcclxuICBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL2lucHV0dHJpYW5nbGVjYW52YXNcIjtcclxuaW1wb3J0IHtcclxuICBPdXRwdXRUcmlhbmdsZUNhbnZhcyxcclxuICBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi9vdXRwdXR0cmlhbmdsZWNhbnZhc1wiO1xyXG5cclxubGV0IGNhbGN1bGF0b3I6IGFueTtcclxuY29uc3QgY2FsY3VsYXRvckxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICBcImxvYWRpbmdcIlxyXG4pIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcclxuY29uc3QgY2FsY3VsYXRld29ya2VyID0gbmV3IFdvcmtlcihcclxuICBuZXcgVVJMKFwiLi93b3JrZXJzL2NhbGMud29ya2VyLnRzXCIsIGltcG9ydC5tZXRhLnVybClcclxuKTtcclxuY2FsY3VsYXRld29ya2VyLm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XHJcbiAgY2FsY3VsYXRvciA9IG1lc3NhZ2UuZGF0YTtcclxuICBpZiAodHJpYW5nbGVzQ291bnRlcikge1xyXG4gICAgdHJpYW5nbGVzQ291bnRlci50ZXh0Q29udGVudCA9IGNhbGN1bGF0b3IudHJpYW5nbGVzLmxlbmd0aDtcclxuICB9XHJcbiAgZHJhd091dHB1dENhbnZhcygpO1xyXG4gIGRyYXdUcmlhbmdsZXNTZWxlY3RvcigpO1xyXG4gIG91dHB1dENhbnZhcy5jYW52YXNFbGVtZW50LnNjcm9sbEludG9WaWV3KHtcclxuICAgIGJlaGF2aW9yOiBcInNtb290aFwiLFxyXG4gICAgYmxvY2s6IFwiZW5kXCIsXHJcbiAgfSk7XHJcbiAgY2FsY3VsYXRvckxvYWRpbmcuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcbn07XHJcblxyXG5jb25zdCBjYW52YXMgPSBuZXcgSW5wdXRUcmlhbmdsZUNhbnZhcyhcclxuICBuZXcgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyh7XHJcbiAgICBjb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgbGluZVdpZHRoOiAyLFxyXG4gICAgcG9pbnRTaXplOiA4LFxyXG4gICAgY2FudmFzSWQ6IFwiY2FudmFzXCIsXHJcbiAgICBtZXJnZVJhZGl1czogMjUsXHJcbiAgICB1c2VHcmlkOiB0cnVlLFxyXG4gICAgZ3JpZENlbGxTaXplOiA0MCxcclxuICAgIGdyaWRMaW5lV2lkdGg6IDIwLFxyXG4gIH0pXHJcbik7XHJcblxyXG5sZXQgc2hvd1RyaWFuZ2xlSW5kZXggPSAwO1xyXG5jb25zdCB0cmlhbmdsZXNTZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gIFwidHJpYW5nbGVzLXNlbGVjdG9yXCJcclxuKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XHJcbmNvbnN0IHRyaWFuZ2xlc0NvdW50ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICBcInRyaWFuZ2xlcy1jb3VudFwiXHJcbikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xyXG5jb25zdCBvdXRwdXRDYW52YXMgPSBuZXcgT3V0cHV0VHJpYW5nbGVDYW52YXMoXHJcbiAgbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKHtcclxuICAgIGNvbG9yOiBcImJsYWNrXCIsXHJcbiAgICBsaW5lV2lkdGg6IDIsXHJcbiAgICBwb2ludFNpemU6IDQsXHJcbiAgICBjYW52YXNJZDogXCJ0cmlhbmdsZXNcIixcclxuICB9KVxyXG4pO1xyXG5cclxuZnVuY3Rpb24gZHJhd091dHB1dENhbnZhcygpIHtcclxuICBvdXRwdXRDYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICBvdXRwdXRDYW52YXMuZHJhd0xpbmVzKGNhbGN1bGF0b3IubGluZXMsIFwiZ3JleVwiLCAxKTtcclxuICBvdXRwdXRDYW52YXMuZHJhd1BvaW50cyhjYWxjdWxhdG9yLnBvaW50cywgXCJncmF5XCIsIDUpO1xyXG4gIG91dHB1dENhbnZhcy5kcmF3VHJpYW5nbGUoY2FsY3VsYXRvci50cmlhbmdsZXNbc2hvd1RyaWFuZ2xlSW5kZXhdLCBcInJlZFwiLCA0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1RyaWFuZ2xlc1NlbGVjdG9yKCkge1xyXG4gIGlmICh0cmlhbmdsZXNTZWxlY3RvciAmJiBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGggPiAwKSB7XHJcbiAgICB0cmlhbmdsZXNTZWxlY3Rvci50ZXh0Q29udGVudCA9IGAke3Nob3dUcmlhbmdsZUluZGV4ICsgMX0gLyAke1xyXG4gICAgICBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGhcclxuICAgIH1gO1xyXG4gIH1cclxufVxyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbGVhclwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjYW52YXMuY2xlYXJBbGwoKTtcclxuICBvdXRwdXRDYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICBpZiAodHJpYW5nbGVzU2VsZWN0b3IpIHtcclxuICAgIHRyaWFuZ2xlc1NlbGVjdG9yLnRleHRDb250ZW50ID0gXCIwIC8gMFwiO1xyXG4gIH1cclxuICBpZiAodHJpYW5nbGVzQ291bnRlcikge1xyXG4gICAgdHJpYW5nbGVzQ291bnRlci50ZXh0Q29udGVudCA9IFwiMFwiO1xyXG4gIH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1wcmV2XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmIChzaG93VHJpYW5nbGVJbmRleCA+IDApIHNob3dUcmlhbmdsZUluZGV4LS07XHJcbiAgZHJhd091dHB1dENhbnZhcygpO1xyXG4gIGRyYXdUcmlhbmdsZXNTZWxlY3RvcigpO1xyXG59KTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbmV4dFwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBpZiAoc2hvd1RyaWFuZ2xlSW5kZXggPCBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGggLSAxKSBzaG93VHJpYW5nbGVJbmRleCsrO1xyXG4gIGRyYXdPdXRwdXRDYW52YXMoKTtcclxuICBkcmF3VHJpYW5nbGVzU2VsZWN0b3IoKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbGNcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FsY3VsYXRvckxvYWRpbmcuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG4gIGNhbGN1bGF0ZXdvcmtlci5wb3N0TWVzc2FnZShjYW52YXMubGluZXMpO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVkb1wiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjYW52YXMucmVkbygpO1xyXG59KTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmRvXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGNhbnZhcy51bmRvKCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=