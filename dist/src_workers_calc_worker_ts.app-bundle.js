/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calculator.ts":
/*!***************************!*\
  !*** ./src/calculator.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TrianglesCalculator": () => (/* binding */ TrianglesCalculator)
/* harmony export */ });
/* harmony import */ var _coremath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coremath */ "./src/coremath.ts");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core */ "./src/core.ts");


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
        this.recalcLines();
        this.recalcIntersections();
        this.recalcConnections();
        this.recalcTriangles();
    }
    recalcLines() {
        for (let line1 of this.lines) {
            for (let line2 of this.lines) {
                if (line1 == line2)
                    continue;
                let line = (0,_coremath__WEBPACK_IMPORTED_MODULE_0__.findCommonLine)(line1, line2);
                if (line && this.lines.findIndex((l) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.areLinesEqual)(l, line)) === -1)
                    this.lines.push(line);
            }
        }
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
                if (line1 == line2)
                    continue;
                let intersectionPoint = (0,_coremath__WEBPACK_IMPORTED_MODULE_0__.checkIntersection)(line1, line2);
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
        this.points = this.points.filter((value, index, self) => index === self.findIndex((p) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.arePointsEqual)(p, value)));
    }
    recalcConnections() {
        this.connections = [];
        for (let intersectionPoints of this.segmentsMap.values()) {
            for (let p1 of intersectionPoints) {
                for (let p2 of intersectionPoints) {
                    if (!(0,_core__WEBPACK_IMPORTED_MODULE_1__.arePointsEqual)(p1, p2)) {
                        this.connections.push(new _core__WEBPACK_IMPORTED_MODULE_1__.Line(p1, p2));
                    }
                }
            }
        }
        this.connections = this.connections.filter((value, index, self) => index === self.findIndex((l) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.areLinesEqual)(l, value)));
    }
    recalcTriangles() {
        this.triangles = [];
        for (let l1 of this.connections) {
            for (let l2 of this.connections) {
                for (let l3 of this.connections) {
                    if (l1 == l2 || l1 == l3 || l2 == l3)
                        continue;
                    let triangle = (0,_coremath__WEBPACK_IMPORTED_MODULE_0__.createTriangleFromLines)(l1, l2, l3);
                    if (triangle != null) {
                        this.triangles.push(triangle);
                    }
                }
            }
        }
        this.triangles = this.triangles.filter((value, index, self) => index === self.findIndex((t) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.isTrianglesEqual)(t, value)));
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************************!*\
  !*** ./src/workers/calc.worker.ts ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _calculator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../calculator */ "./src/calculator.ts");

const calculator = new _calculator__WEBPACK_IMPORTED_MODULE_0__.TrianglesCalculator();
self.onmessage = (message) => {
    calculator.calc(message.data);
    self.postMessage({
        result: calculator.triangles.length,
        lines: calculator.lines,
        points: calculator.points,
        connections: calculator.connections,
        triangles: calculator.triangles
    });
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcnNfY2FsY193b3JrZXJfdHMuYXBwLWJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQXdGO0FBUXhFO0FBRVQsTUFBTSxtQkFBbUI7SUFBaEM7UUFDRSxXQUFNLEdBQVksRUFBRSxDQUFDO1FBQ3JCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFDekIsY0FBUyxHQUFlLEVBQUUsQ0FBQztRQUMzQixnQkFBVyxHQUF5QixJQUFJLEdBQUcsRUFBbUIsQ0FBQztJQXlGakUsQ0FBQztJQXZGUSxJQUFJLENBQUMsS0FBYTtRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTyxXQUFXO1FBQ2pCLEtBQUksSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssRUFBQztZQUMxQixLQUFJLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUM7Z0JBQzFCLElBQUcsS0FBSyxJQUFJLEtBQUs7b0JBQUUsU0FBUztnQkFDNUIsSUFBSSxJQUFJLEdBQUcseURBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLElBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUscURBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2pFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pCO1NBQ0Y7SUFDSCxDQUFDO0lBRU8sbUJBQW1CO1FBQ3pCLElBQUksQ0FBQyxX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YXRvci50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY29yZW1hdGgudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL3dvcmtlcnMvY2FsYy53b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tJbnRlcnNlY3Rpb24sIGZpbmRDb21tb25MaW5lLCBjcmVhdGVUcmlhbmdsZUZyb21MaW5lcyB9IGZyb20gXCIuL2NvcmVtYXRoXCI7XHJcbmltcG9ydCB7XHJcbiAgTGluZSxcclxuICBQb2ludCxcclxuICBUcmlhbmdsZSxcclxuICBhcmVMaW5lc0VxdWFsLFxyXG4gIGFyZVBvaW50c0VxdWFsLFxyXG4gIGlzVHJpYW5nbGVzRXF1YWwsXHJcbn0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlc0NhbGN1bGF0b3Ige1xyXG4gIHBvaW50czogUG9pbnRbXSA9IFtdO1xyXG4gIGxpbmVzOiBMaW5lW10gPSBbXTtcclxuICBjb25uZWN0aW9uczogTGluZVtdID0gW107XHJcbiAgdHJpYW5nbGVzOiBUcmlhbmdsZVtdID0gW107XHJcbiAgc2VnbWVudHNNYXA6IE1hcDxudW1iZXIsIFBvaW50W10+ID0gbmV3IE1hcDxudW1iZXIsIFBvaW50W10+KCk7XHJcblxyXG4gIHB1YmxpYyBjYWxjKGxpbmVzOiBMaW5lW10pIHtcclxuICAgIHRoaXMubGluZXMgPSBsaW5lcztcclxuICAgIHRoaXMucmVjYWxjTGluZXMoKTtcclxuICAgIHRoaXMucmVjYWxjSW50ZXJzZWN0aW9ucygpO1xyXG4gICAgdGhpcy5yZWNhbGNDb25uZWN0aW9ucygpO1xyXG4gICAgdGhpcy5yZWNhbGNUcmlhbmdsZXMoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVjYWxjTGluZXMoKSB7XHJcbiAgICBmb3IobGV0IGxpbmUxIG9mIHRoaXMubGluZXMpe1xyXG4gICAgICBmb3IobGV0IGxpbmUyIG9mIHRoaXMubGluZXMpe1xyXG4gICAgICAgIGlmKGxpbmUxID09IGxpbmUyKSBjb250aW51ZTtcclxuICAgICAgICBsZXQgbGluZSA9IGZpbmRDb21tb25MaW5lKGxpbmUxLCBsaW5lMik7XHJcbiAgICAgICAgaWYobGluZSAmJiB0aGlzLmxpbmVzLmZpbmRJbmRleCgobCk9PmFyZUxpbmVzRXF1YWwobCwgbGluZSkpID09PSAtMSlcclxuICAgICAgICAgIHRoaXMubGluZXMucHVzaChsaW5lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWNhbGNJbnRlcnNlY3Rpb25zKCkge1xyXG4gICAgdGhpcy5zZWdtZW50c01hcCA9IG5ldyBNYXA8bnVtYmVyLCBQb2ludFtdPigpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuc2V0KGksIFtdKTtcclxuICAgIH1cclxuICAgIHRoaXMucG9pbnRzID0gW107XHJcbiAgICBmb3IgKGxldCBsaW5lMSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgIHRoaXMucG9pbnRzLnB1c2gobGluZTEuc3RhcnQpO1xyXG4gICAgICB0aGlzLnBvaW50cy5wdXNoKGxpbmUxLmVuZCk7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMSkpPy5wdXNoKGxpbmUxLnN0YXJ0KTtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUxKSk/LnB1c2gobGluZTEuZW5kKTtcclxuICAgICAgZm9yIChsZXQgbGluZTIgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICAgIGlmKGxpbmUxID09IGxpbmUyKSBjb250aW51ZTtcclxuICAgICAgICBsZXQgaW50ZXJzZWN0aW9uUG9pbnQgPSBjaGVja0ludGVyc2VjdGlvbihsaW5lMSwgbGluZTIpO1xyXG4gICAgICAgIGlmIChpbnRlcnNlY3Rpb25Qb2ludCAhPSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLnNlZ21lbnRzTWFwXHJcbiAgICAgICAgICAgIC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUxKSlcclxuICAgICAgICAgICAgPy5wdXNoKGludGVyc2VjdGlvblBvaW50KTtcclxuICAgICAgICAgIHRoaXMuc2VnbWVudHNNYXBcclxuICAgICAgICAgICAgLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTIpKVxyXG4gICAgICAgICAgICA/LnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgdGhpcy5wb2ludHMucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wb2ludHMgPSB0aGlzLnBvaW50cy5maWx0ZXIoXHJcbiAgICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChwKSA9PiBhcmVQb2ludHNFcXVhbChwLCB2YWx1ZSkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWNhbGNDb25uZWN0aW9ucygpIHtcclxuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBbXTtcclxuICAgIGZvciAobGV0IGludGVyc2VjdGlvblBvaW50cyBvZiB0aGlzLnNlZ21lbnRzTWFwLnZhbHVlcygpKSB7XHJcbiAgICAgIGZvciAobGV0IHAxIG9mIGludGVyc2VjdGlvblBvaW50cykge1xyXG4gICAgICAgIGZvciAobGV0IHAyIG9mIGludGVyc2VjdGlvblBvaW50cykge1xyXG4gICAgICAgICAgaWYgKCFhcmVQb2ludHNFcXVhbChwMSwgcDIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChuZXcgTGluZShwMSwgcDIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gdGhpcy5jb25uZWN0aW9ucy5maWx0ZXIoXHJcbiAgICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChsKSA9PiBhcmVMaW5lc0VxdWFsKGwsIHZhbHVlKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlY2FsY1RyaWFuZ2xlcygpIHtcclxuICAgIHRoaXMudHJpYW5nbGVzID0gW107XHJcbiAgICBmb3IgKGxldCBsMSBvZiB0aGlzLmNvbm5lY3Rpb25zKSB7XHJcbiAgICAgIGZvciAobGV0IGwyIG9mIHRoaXMuY29ubmVjdGlvbnMpIHtcclxuICAgICAgICBmb3IgKGxldCBsMyBvZiB0aGlzLmNvbm5lY3Rpb25zKSB7XHJcbiAgICAgICAgICBpZiAobDEgPT0gbDIgfHwgbDEgPT0gbDMgfHwgbDIgPT0gbDMpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgbGV0IHRyaWFuZ2xlID0gY3JlYXRlVHJpYW5nbGVGcm9tTGluZXMobDEsIGwyLCBsMyk7XHJcbiAgICAgICAgICBpZiAodHJpYW5nbGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKHRyaWFuZ2xlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMudHJpYW5nbGVzID0gdGhpcy50cmlhbmdsZXMuZmlsdGVyKFxyXG4gICAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgodCkgPT4gaXNUcmlhbmdsZXNFcXVhbCh0LCB2YWx1ZSkpXHJcbiAgICApO1xyXG4gIH1cclxufSIsImV4cG9ydCB2YXIgRVBTSUxPTjogbnVtYmVyID0gMC4xO1xyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgYSBwb2ludCBpbiAyRCBjb29yZGluYXRlIHN5c3RlbS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cclxuXHJcbiAgLyoqXHJcbiAgKiBDcmVhdGVzIGEgbmV3IGBQb2ludGAgb2JqZWN0IHdpdGggdGhlIHNhbWUgeCBhbmQgeSBjb29yZGluYXRlcyBhcyB0aGlzIG9uZS5cclxuICAqIEByZXR1cm5zIEEgbmV3IGBQb2ludGAgb2JqZWN0IHdpdGggdGhlIHNhbWUgeCBhbmQgeSBjb29yZGluYXRlcyBhcyB0aGlzIG9uZS5cclxuICAqL1xyXG4gIHB1YmxpYyBjbG9uZSgpOiBQb2ludCB7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXByZXNlbnRzIGEgbGluZSBieSB0d28gcG9pbnRzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExpbmUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogUG9pbnQsIHB1YmxpYyBlbmQ6IFBvaW50KSB7fVxyXG59XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIHRyaWFuZ2xlIGJ5IHRocmVlIHBvaW50cy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZSB7XHJcbiAgcHVibGljIHBvaW50czogUG9pbnRbXTtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcDE6IFBvaW50LCBwdWJsaWMgcDI6IFBvaW50LCBwdWJsaWMgcDM6IFBvaW50KSB7XHJcbiAgICB0aGlzLnBvaW50cyA9IFtwMSwgcDIsIHAzXTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gIERldGVybWluZXMgd2hldGhlciB0d28gcG9pbnRzIGFyZSBlcXVhbCB3aXRoaW4gYSBnaXZlbiB0b2xlcmFuY2UuXHJcbiAgQHBhcmFtIHBvaW50QSBUaGUgZmlyc3QgcG9pbnQgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gcG9pbnRCIFRoZSBzZWNvbmQgcG9pbnQgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gdG9sZXJhbmNlIFRoZSBtYXhpbXVtIGFsbG93YWJsZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSB0d28gcG9pbnRzLlxyXG4gIEByZXR1cm5zIFRydWUgaWYgdGhlIHR3byBwb2ludHMgYXJlIGVxdWFsIHdpdGhpbiB0aGUgZ2l2ZW4gdG9sZXJhbmNlLCBmYWxzZSBvdGhlcndpc2UuXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcmVQb2ludHNFcXVhbChcclxuICBwb2ludEE6IFBvaW50LFxyXG4gIHBvaW50QjogUG9pbnQsXHJcbiAgdG9sZXJhbmNlOiBudW1iZXIgPSAxXHJcbik6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBNYXRoLmFicyhwb2ludEEueCAtIHBvaW50Qi54KSA8PSB0b2xlcmFuY2UgJiYgTWF0aC5hYnMocG9pbnRBLnkgLSBwb2ludEIueSkgPD0gdG9sZXJhbmNlO1xyXG59XHJcblxyXG4vKipcclxuICBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIGxpbmVzIGFyZSBlcXVhbCB3aXRoaW4gYSBnaXZlbiB0b2xlcmFuY2UuXHJcbiAgQHBhcmFtIGxpbmVBIFRoZSBmaXJzdCBsaW5lIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIGxpbmVCIFRoZSBzZWNvbmQga2luZSB0byBjb21wYXJlLlxyXG4gIEBwYXJhbSB0b2xlcmFuY2UgVGhlIG1heGltdW0gYWxsb3dhYmxlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIGVuZHBvaW50cyBvZiB0aGUgdHdvIGxpbmVzLlxyXG4gIEByZXR1cm5zIFRydWUgaWYgdGhlIHR3byBsaW5lcyBhcmUgZXF1YWwgd2l0aGluIHRoZSBnaXZlbiB0b2xlcmFuY2UsIGZhbHNlIG90aGVyd2lzZS5cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZUxpbmVzRXF1YWwoXHJcbiAgbGluZUE6IExpbmUsXHJcbiAgbGluZUI6IExpbmUsXHJcbiAgdG9sZXJhbmNlOiBudW1iZXIgPSAxXHJcbik6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICAoYXJlUG9pbnRzRXF1YWwobGluZUEuc3RhcnQsIGxpbmVCLnN0YXJ0LCB0b2xlcmFuY2UpICYmXHJcbiAgICAgIGFyZVBvaW50c0VxdWFsKGxpbmVBLmVuZCwgbGluZUIuZW5kLCB0b2xlcmFuY2UpKSB8fFxyXG4gICAgKGFyZVBvaW50c0VxdWFsKGxpbmVBLmVuZCwgbGluZUIuc3RhcnQsIHRvbGVyYW5jZSkgJiZcclxuICAgICAgYXJlUG9pbnRzRXF1YWwobGluZUEuc3RhcnQsIGxpbmVCLmVuZCwgdG9sZXJhbmNlKSlcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIHRyaWFuZ2xlcyBhcmUgZXF1YWwgd2l0aGluIGEgZ2l2ZW4gdG9sZXJhbmNlLlxyXG4gIEBwYXJhbSB0cmlhbmdsZUEgVGhlIGZpcnN0IHRyaWFuZ2xlIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIHRyaWFuZ2xlQiBUaGUgc2Vjb25kIHRyaWFuZ2xlIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIHRvbGVyYW5jZSBUaGUgbWF4aW11bSBhbGxvd2FibGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgdmVydGljZXMgb2YgdGhlIHR3byB0cmlhbmdsZXMuXHJcbiAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgdHdvIHRyaWFuZ2xlcyBhcmUgZXF1YWwgd2l0aGluIHRoZSBnaXZlbiB0b2xlcmFuY2UsIGZhbHNlIG90aGVyd2lzZS5cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJpYW5nbGVzRXF1YWwoXHJcbiAgdHJpYW5nbGVBOiBUcmlhbmdsZSxcclxuICB0cmlhbmdsZUI6IFRyaWFuZ2xlLFxyXG4gIHRvbGVyYW5jZTogbnVtYmVyID0gMVxyXG4pOiBib29sZWFuIHtcclxuICByZXR1cm4gdHJpYW5nbGVBLnBvaW50cy5ldmVyeSgocG9pbnRBKSA9PlxyXG4gICAgdHJpYW5nbGVCLnBvaW50cy5maW5kKChwb2ludEIpID0+IGFyZVBvaW50c0VxdWFsKHBvaW50QSwgcG9pbnRCLCB0b2xlcmFuY2UpKVxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlLCBhcmVQb2ludHNFcXVhbCwgRVBTSUxPTiB9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgdHJpYW5nbGUgZnJvbSB0aHJlZSBsaW5lcy5cclxuICogQHBhcmFtIGxpbmUxIC0gVGhlIGZpcnN0IGxpbmUgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gKiBAcGFyYW0gbGluZTIgLSBUaGUgc2Vjb25kIGxpbmUgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gKiBAcGFyYW0gbGluZTMgLSBUaGUgdGhpcmQgbGluZSBvZiB0aGUgdHJpYW5nbGUuXHJcbiAqIEByZXR1cm5zIFRoZSB0cmlhbmdsZSBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGxpbmVzLCBvciBudWxsIGlmIHRoZSBsaW5lcyBjYW5ub3QgZm9ybSBhIHZhbGlkIHRyaWFuZ2xlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyaWFuZ2xlRnJvbUxpbmVzKFxyXG4gIGxpbmUxOiBMaW5lLFxyXG4gIGxpbmUyOiBMaW5lLFxyXG4gIGxpbmUzOiBMaW5lXHJcbik6IFRyaWFuZ2xlIHwgbnVsbCB7XHJcbiAgbGV0IGhwb2ludHMgPSBbXHJcbiAgICBsaW5lMS5zdGFydCxcclxuICAgIGxpbmUxLmVuZCxcclxuICAgIGxpbmUyLnN0YXJ0LFxyXG4gICAgbGluZTIuZW5kLFxyXG4gICAgbGluZTMuc3RhcnQsXHJcbiAgICBsaW5lMy5lbmQsXHJcbiAgXTtcclxuICBocG9pbnRzID0gaHBvaW50cy5maWx0ZXIoXHJcbiAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHApID0+IGFyZVBvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICApO1xyXG4gIC8vIFRoZSB0cmlhbmdsZSBtdXN0IGNvbnNpc3Qgc3RyaWN0bHkgb2YgdGhyZWUgdW5pcXVlIHBvaW50c1xyXG4gIGlmIChocG9pbnRzLmxlbmd0aCAhPSAzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgLy8gQ2hlY2tpbmcgZm9yIHRoZSBwb3NzaWJpbGl0eSBvZiB0aGUgZXhpc3RlbmNlIG9mIGEgdHJpYW5nbGVcclxuICB2YXIgYSA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lMS5zdGFydCwgbGluZTEuZW5kKTtcclxuICB2YXIgYiA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lMi5zdGFydCwgbGluZTIuZW5kKTtcclxuICB2YXIgYyA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lMy5zdGFydCwgbGluZTMuZW5kKTtcclxuICBpZiAoYSA+IGIgKyBjIHx8IGIgPiBhICsgYyB8fCBjID4gYSArIGIpIHJldHVybiBudWxsO1xyXG4gIGNvbnN0IHAgPSAoYSArIGIgKyBjKSAvIDI7XHJcbiAgbGV0IFMgPSBNYXRoLnNxcnQocCAqIChwIC0gYSkgKiAocCAtIGIpICogKHAgLSBjKSk7XHJcbiAgaWYgKGlzTmFOKFMpIHx8IFMgPD0gMSkgcmV0dXJuIG51bGw7XHJcblxyXG4gIHJldHVybiBuZXcgVHJpYW5nbGUoaHBvaW50c1swXSwgaHBvaW50c1sxXSwgaHBvaW50c1syXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBwb2ludHM6IFBvaW50W10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCB0b1BvaW50IG9mIHBvaW50cykge1xyXG4gICAgbGV0IGRpc3RhY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHRvUG9pbnQpO1xyXG4gICAgaWYgKGRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBkaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHRvUG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBkaXN0U3RhcnQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuc3RhcnQpO1xyXG4gICAgbGV0IGRpc3RFbmQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuZW5kKTtcclxuXHJcbiAgICBpZiAoTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluUG9pbnQgPSBkaXN0U3RhcnQgPCBkaXN0RW5kID8gbGluZS5zdGFydCA6IGxpbmUuZW5kO1xyXG4gICAgICBtaW5EaXN0ID0gTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IHBkID0gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUocG9pbnQsIGxpbmUpO1xyXG4gICAgaWYgKHBkLmRpc3RhbmNlIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5EaXN0ID0gcGQuZGlzdGFuY2U7XHJcbiAgICAgIG1pblBvaW50ID0gcGQubmVhcmVzdFBvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYWxjdWxhdGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMuXHJcbiAqIEBwYXJhbSBwb2ludEEgLSBUaGUgZmlyc3QgcG9pbnRcclxuICogQHBhcmFtIHBvaW50QiAtIFRoZSBzZWNvbmQgcG9pbnRcclxuICogQHJldHVybnMgVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnRBOiBQb2ludCwgcG9pbnRCOiBQb2ludCk6IG51bWJlciB7XHJcbiAgcmV0dXJuIE1hdGguc3FydCgocG9pbnRBLnggLSBwb2ludEIueCkgKiogMiArIChwb2ludEEueSAtIHBvaW50Qi55KSAqKiAyKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBwb2ludCBhbmQgYSBsaW5lLCBhbmQgZmluZHMgdGhlIG5lYXJlc3QgcG9pbnQgb24gdGhlIGxpbmUgdG8gdGhlIGdpdmVuIHBvaW50LlxyXG4gKiBAcGFyYW0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gZmluZCB0aGUgZGlzdGFuY2UgdG8gdGhlIGxpbmUgZnJvbS5cclxuICogQHBhcmFtIGxpbmUgLSBUaGUgbGluZSB0byBmaW5kIHRoZSBkaXN0YW5jZSB0byB0aGUgcG9pbnQgZnJvbS5cclxuICogQHJldHVybnMgVGhlIG5lYXJlc3QgcG9pbnQgb24gdGhlIGxpbmUgdG8gdGhlIGdpdmVuIHBvaW50IGFuZCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgZ2l2ZW4gcG9pbnQgYW5kIHRoZSBsaW5lLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lOiBMaW5lXHJcbik6IHsgbmVhcmVzdFBvaW50OiBQb2ludDsgZGlzdGFuY2U6IG51bWJlciB9IHtcclxuICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IGxpbmU7XHJcbiAgY29uc3QgZHggPSBlbmQueCAtIHN0YXJ0Lng7XHJcbiAgY29uc3QgZHkgPSBlbmQueSAtIHN0YXJ0Lnk7XHJcblxyXG4gIC8vIElmIHRoZSBsaW5lIGlzIGp1c3QgYSBwb2ludCwgcmV0dXJuIGRpc3RhbmNlIHRvIHRoYXQgcG9pbnRcclxuICBpZiAoZHggPT09IDAgJiYgZHkgPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRpc3RhbmNlOiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHN0YXJ0KSxcclxuICAgICAgbmVhcmVzdFBvaW50OiBzdGFydCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIHBhcmFtZXRlciBvZiB0aGUgcHJvamVjdGlvbiBvZiB0aGUgcG9pbnQgb250byB0aGUgbGluZVxyXG4gIGNvbnN0IHQgPVxyXG4gICAgKChwb2ludC54IC0gc3RhcnQueCkgKiBkeCArIChwb2ludC55IC0gc3RhcnQueSkgKiBkeSkgLyAoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAvLyBJZiB0IGlzIG91dHNpZGUgdGhlIHJhbmdlIFswLCAxXSwgdGhlbiB0aGUgbmVhcmVzdCBwb2ludCBpcyBvbmUgb2YgdGhlIGxpbmUgZW5kcG9pbnRzXHJcbiAgaWYgKHQgPCAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkaXN0YW5jZTogZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBzdGFydCksXHJcbiAgICAgIG5lYXJlc3RQb2ludDogc3RhcnQsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAodCA+IDEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRpc3RhbmNlOiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGVuZCksXHJcbiAgICAgIG5lYXJlc3RQb2ludDogZW5kLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIENhbGN1bGF0ZSB0aGUgbmVhcmVzdCBwb2ludCBvbiB0aGUgbGluZSBhbmQgcmV0dXJuIGl0cyBkaXN0YW5jZSB0byB0aGUgcG9pbnRcclxuICBjb25zdCBuZWFyZXN0UG9pbnQgPSBuZXcgUG9pbnQoc3RhcnQueCArIHQgKiBkeCwgc3RhcnQueSArIHQgKiBkeSk7XHJcbiAgY29uc3QgZGlzdGFuY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIG5lYXJlc3RQb2ludCk7XHJcbiAgcmV0dXJuIHsgZGlzdGFuY2UsIG5lYXJlc3RQb2ludCB9O1xyXG59XHJcblxyXG4vKipcclxuICogIFJldHVybnMgYSBsaW5lIHdoaWNoIGNvbnRhaW5zIHRoZSBjb21tb24gcGFydHMgb2YgdHdvIGxpbmVzIGlmIHRoZXkgYXJlIHBhcnRzIG9mIG9uZSBsaW5lXHJcbiAqICBAcGFyYW0gbGluZTEgVGhlIGZpcnN0IGxpbmVcclxuICogIEBwYXJhbSBsaW5lMiBUaGUgc2Vjb25kIGxpbmVcclxuICogIEByZXR1cm5zIEEgbmV3IExpbmUgb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgY29tbW9uIHBhcnRzIG9mIHRoZSB0d28gaW5wdXQgbGluZXMsIG9yIG51bGwgaWYgdGhleSBhcmUgbm90IHBhcnRzIG9mIG9uZSBsaW5lXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZmluZENvbW1vbkxpbmUobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogTGluZSB8IG51bGwge1xyXG4gIGlmICghYXJlTGluZXNQYXJhbGxlbChsaW5lMSwgbGluZTIpKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLnN0YXJ0LCBsaW5lMi5zdGFydCkpXHJcbiAgICByZXR1cm4gbmV3IExpbmUobGluZTEuZW5kLCBsaW5lMi5lbmQpO1xyXG5cclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuZW5kLCBsaW5lMi5lbmQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLnN0YXJ0LCBsaW5lMi5zdGFydCk7XHJcblxyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5zdGFydCwgbGluZTIuZW5kKSlcclxuICAgIHJldHVybiBuZXcgTGluZShsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0KTtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLmVuZCwgbGluZTIuc3RhcnQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLnN0YXJ0LCBsaW5lMi5lbmQpO1xyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0d28gbGluZXMgYXJlIHBhcmFsbGVsLlxyXG4gKlxyXG4gKiBAcGFyYW0gbGluZTEgVGhlIGZpcnN0IGxpbmUuXHJcbiAqIEBwYXJhbSBsaW5lMiBUaGUgc2Vjb25kIGxpbmUuXHJcbiAqXHJcbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGxpbmVzIGFyZSBwYXJhbGxlbCwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZUxpbmVzUGFyYWxsZWwobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogYm9vbGVhbiB7XHJcbiAgaWYgKFxyXG4gICAgTWF0aC5hYnMobGluZTEuc3RhcnQueSAtIGxpbmUxLmVuZC55KSA8PSBFUFNJTE9OICYmXHJcbiAgICBNYXRoLmFicyhsaW5lMi5zdGFydC55IC0gbGluZTIuZW5kLnkpIDw9IEVQU0lMT05cclxuICApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKFxyXG4gICAgTWF0aC5hYnMobGluZTEuc3RhcnQueCAtIGxpbmUxLmVuZC54KSA8PSBFUFNJTE9OICYmXHJcbiAgICBNYXRoLmFicyhsaW5lMi5zdGFydC54IC0gbGluZTIuZW5kLngpIDw9IEVQU0lMT05cclxuICApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgbGV0IGsxID0gTWF0aC5hdGFuKFxyXG4gICAgKGxpbmUxLmVuZC55IC0gbGluZTEuc3RhcnQueSkgLyAobGluZTEuZW5kLnggLSBsaW5lMS5zdGFydC54KVxyXG4gICk7XHJcbiAgbGV0IGsyID0gTWF0aC5hdGFuKFxyXG4gICAgKGxpbmUyLmVuZC55IC0gbGluZTIuc3RhcnQueSkgLyAobGluZTIuZW5kLnggLSBsaW5lMi5zdGFydC54KVxyXG4gICk7XHJcbiAgcmV0dXJuIE1hdGguYWJzKGsxIC0gazIpIDw9IEVQU0lMT047XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50T25MaW5lKGxpbmU6IExpbmUsIHBvaW50OiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBNYXRoLmFicyhcclxuICAgICAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUuc3RhcnQsIHBvaW50KSArXHJcbiAgICAgICAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUuZW5kLCBwb2ludCkgLVxyXG4gICAgICAgIGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lLmVuZCwgbGluZS5zdGFydClcclxuICAgICkgPD0gRVBTSUxPTlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ludGVyc2VjdGlvbihsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBQb2ludCB8IG51bGwge1xyXG4gIGxldCBjaGVja2VkUG9pbnRzID0gW2xpbmUxLnN0YXJ0LCBsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0LCBsaW5lMi5lbmRdO1xyXG4gIGxldCBBOiBudW1iZXIsIEI6IG51bWJlciwgQzogbnVtYmVyO1xyXG4gIGxldCBwb2ludHh4OiBudW1iZXIsIHBvaW50eXk6IG51bWJlcjtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTIsIGxpbmUxLnN0YXJ0KSkgcmV0dXJuIGxpbmUxLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5lbmQpKSByZXR1cm4gbGluZTEuZW5kO1xyXG5cclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMSwgbGluZTIuc3RhcnQpKSByZXR1cm4gbGluZTIuc3RhcnQ7XHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLmVuZCkpIHJldHVybiBsaW5lMi5lbmQ7XHJcblxyXG4gIHJldHVybiBUZW1wQ2hlY2soKTtcclxuXHJcbiAgZnVuY3Rpb24gVkVLKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGJ4OiBudW1iZXIsIGJ5OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBheCAqIGJ5IC0gYnggKiBheTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIENyb3NzaW5nQ2hlY2socDE6IFBvaW50LCBwMjogUG9pbnQsIHAzOiBQb2ludCwgcDQ6IFBvaW50KSB7XHJcbiAgICBsZXQgdjEsIHYyLCB2MywgdjQ7XHJcblxyXG4gICAgdjEgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMS54IC0gcDMueCwgcDEueSAtIHAzLnkpO1xyXG4gICAgdjIgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMi54IC0gcDMueCwgcDIueSAtIHAzLnkpO1xyXG4gICAgdjMgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwMy54IC0gcDEueCwgcDMueSAtIHAxLnkpO1xyXG4gICAgdjQgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwNC54IC0gcDEueCwgcDQueSAtIHAxLnkpO1xyXG4gICAgaWYgKHYxICogdjIgPCAwICYmIHYzICogdjQgPCAwKSByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gRXF1YXRpb25PZlRoZUxpbmUocDE6IFBvaW50LCBwMjogUG9pbnQpIHtcclxuICAgIEEgPSBwMi55IC0gcDEueTtcclxuICAgIEIgPSBwMS54IC0gcDIueDtcclxuICAgIEMgPSAtcDEueCAqIChwMi55IC0gcDEueSkgKyBwMS55ICogKHAyLnggLSBwMS54KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblgoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeCwgcG9pbnR4O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHggPSAtYzEgKiBiMiArIGIxICogYzI7XHJcbiAgICBwb2ludHggPSBkeCAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gSW50ZXJzZWN0aW9uWShcclxuICAgIGExOiBudW1iZXIsXHJcbiAgICBiMTogbnVtYmVyLFxyXG4gICAgYzE6IG51bWJlcixcclxuICAgIGEyOiBudW1iZXIsXHJcbiAgICBiMjogbnVtYmVyLFxyXG4gICAgYzI6IG51bWJlclxyXG4gICkge1xyXG4gICAgbGV0IGQsIGR5LCBwb2ludHk7XHJcbiAgICBkID0gYTEgKiBiMiAtIGIxICogYTI7XHJcbiAgICBkeSA9IC1hMSAqIGMyICsgYzEgKiBhMjtcclxuICAgIHBvaW50eSA9IGR5IC8gZDtcclxuICAgIHJldHVybiBwb2ludHk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBUZW1wQ2hlY2soKTogUG9pbnQgfCBudWxsIHtcclxuICAgIGlmIChcclxuICAgICAgQ3Jvc3NpbmdDaGVjayhcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzBdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMV0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1syXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzNdXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICBsZXQgYTEsIGIxLCBjMSwgYTIsIGIyLCBjMjtcclxuICAgICAgRXF1YXRpb25PZlRoZUxpbmUoY2hlY2tlZFBvaW50c1swXSwgY2hlY2tlZFBvaW50c1sxXSk7XHJcbiAgICAgIGExID0gQTtcclxuICAgICAgYjEgPSBCO1xyXG4gICAgICBjMSA9IEM7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMl0sIGNoZWNrZWRQb2ludHNbM10pO1xyXG4gICAgICBhMiA9IEE7XHJcbiAgICAgIGIyID0gQjtcclxuICAgICAgYzIgPSBDO1xyXG4gICAgICBwb2ludHh4ID0gSW50ZXJzZWN0aW9uWChhMSwgYjEsIGMxLCBhMiwgYjIsIGMyKTtcclxuICAgICAgcG9pbnR5eSA9IEludGVyc2VjdGlvblkoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHJldHVybiBuZXcgUG9pbnQocG9pbnR4eCwgcG9pbnR5eSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBUcmlhbmdsZXNDYWxjdWxhdG9yIH0gZnJvbSBcIi4uL2NhbGN1bGF0b3JcIjtcclxuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuLi9jb3JlXCI7XHJcblxyXG5cclxuY29uc3QgY2FsY3VsYXRvciA9IG5ldyBUcmlhbmdsZXNDYWxjdWxhdG9yKCk7XHJcblxyXG5zZWxmLm9ubWVzc2FnZSA9IChtZXNzYWdlOiBNZXNzYWdlRXZlbnQ8TGluZVtdPikgPT4ge1xyXG4gIGNhbGN1bGF0b3IuY2FsYyhtZXNzYWdlLmRhdGEpO1xyXG4gIHNlbGYucG9zdE1lc3NhZ2Uoe1xyXG4gICAgcmVzdWx0OiBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGgsXHJcbiAgICBsaW5lczogY2FsY3VsYXRvci5saW5lcyxcclxuICAgIHBvaW50czogY2FsY3VsYXRvci5wb2ludHMsXHJcbiAgICBjb25uZWN0aW9uczogY2FsY3VsYXRvci5jb25uZWN0aW9ucyxcclxuICAgIHRyaWFuZ2xlczogY2FsY3VsYXRvci50cmlhbmdsZXNcclxuICB9KTtcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9