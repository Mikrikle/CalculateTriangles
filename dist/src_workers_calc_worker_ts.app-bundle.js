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
        /**
         * An array of Point objects representing all the points.
         */
        this.points = [];
        /**
         * An array of Line objects representing all the lines in the diagram.
         */
        this.lines = [];
        /**
         * An array of Line objects representing all the line segments, including those that make up the triangles.
         */
        this.segments = [];
        /**
         * An array of Triangle objects representing all the triangles.
         */
        this.triangles = [];
        /**
         * Each key in the segments map represents a line index, and its value is an array of points that belong to that line
         * The points array contains all the distinct intersection points between the lines, as well as the start and end points of each line.
         */
        this.segmentsMap = new Map();
    }
    calc(lines) {
        this.lines = lines;
        this.calcLines();
        this.calcIntersections();
        this.calcSegments();
        this.calcTriangles();
    }
    /**
     * Calculates the lines array, finding all the unique lines that can be formed
     * and adds to the array.
     */
    calcLines() {
        const nLines = this.lines.length;
        for (let i = 0; i < nLines - 1; i++) {
            for (let j = i + 1; j < nLines; j++) {
                const line = (0,_coremath__WEBPACK_IMPORTED_MODULE_0__.findCommonLine)(this.lines[i], this.lines[j]);
                if (line && !this.lines.some((l) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.areLinesEqual)(l, line))) {
                    this.lines.push(line);
                }
            }
        }
    }
    /**
     * Calculates the intersections of the lines and updates the segments map.
     */
    calcIntersections() {
        this.segmentsMap = new Map();
        for (let i = 0; i < this.lines.length; i++) {
            this.segmentsMap.set(i, []);
        }
        this.points = [];
        for (let i = 0; i < this.lines.length - 1; i++) {
            for (let j = i + 1; j < this.lines.length; j++) {
                const intersectionPoint = (0,_coremath__WEBPACK_IMPORTED_MODULE_0__.findIntersectionPoint)(this.lines[i], this.lines[j]);
                if (intersectionPoint != null) {
                    if (!this.points.some((p) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.arePointsEqual)(p, intersectionPoint))) {
                        this.points.push(intersectionPoint);
                    }
                    this.segmentsMap.get(i)?.push(intersectionPoint);
                    this.segmentsMap.get(j)?.push(intersectionPoint);
                }
            }
            this.points.push(this.lines[i].start);
            this.points.push(this.lines[i].end);
            this.segmentsMap.get(i)?.push(this.lines[i].start);
            this.segmentsMap.get(i)?.push(this.lines[i].end);
        }
    }
    /**
     * Calculates the connections between the intersection points of the lines
     * and stores them in the segments property.
     */
    calcSegments() {
        this.segments = [];
        for (let intersectionPoints of this.segmentsMap.values()) {
            for (let i = 0; i < intersectionPoints.length - 1; i++) {
                for (let j = i + 1; j < intersectionPoints.length; j++) {
                    const p1 = intersectionPoints[i];
                    const p2 = intersectionPoints[j];
                    if (!(0,_core__WEBPACK_IMPORTED_MODULE_1__.arePointsEqual)(p1, p2)) {
                        const line = new _core__WEBPACK_IMPORTED_MODULE_1__.Line(p1, p2);
                        if (!this.segments.some((l) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.areLinesEqual)(l, line)))
                            this.segments.push(new _core__WEBPACK_IMPORTED_MODULE_1__.Line(p1, p2));
                    }
                }
            }
        }
    }
    /**
     * Calculates the triangles in the current state.
     */
    calcTriangles() {
        this.triangles = [];
        const nConnections = this.segments.length;
        for (let i = 0; i < nConnections - 1; i++) {
            const l1 = this.segments[i];
            for (let j = i + 1; j < nConnections; j++) {
                const l2 = this.segments[j];
                for (let k = j + 1; k < nConnections; k++) {
                    const l3 = this.segments[k];
                    const triangle = (0,_coremath__WEBPACK_IMPORTED_MODULE_0__.createTriangleFromLines)(l1, l2, l3);
                    if (triangle != null) {
                        this.triangles.push(triangle);
                    }
                }
            }
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
        return line1.start.clone();
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.end, line2.end))
        return line1.end.clone();
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.start, line2.end))
        return line1.start.clone();
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.arePointsEqual)(line1.end, line2.start))
        return line1.end.clone();
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
    // Check if either slope is vertical (i.e. infinite)
    if (!isFinite(slope1)) {
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Point(line1.start.x, slope2 * line1.start.x + yIntercept2);
    }
    if (!isFinite(slope2)) {
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Point(line2.start.x, slope1 * line2.start.x + yIntercept1);
    }
    // Calculate the x-coordinate of the intersection point
    const x = (yIntercept2 - yIntercept1) / (slope1 - slope2);
    // Check if the x-coordinate is out of range for both line segments
    if (x < Math.min(line1.start.x, line1.end.x) - _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON ||
        x > Math.max(line1.start.x, line1.end.x) + _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON ||
        x < Math.min(line2.start.x, line2.end.x) - _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON ||
        x > Math.max(line2.start.x, line2.end.x) + _core__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
        return null;
    }
    // Calculate the y-coordinate of the intersection point
    const y = slope1 * x + yIntercept1;
    // Return the intersection point
    return new _core__WEBPACK_IMPORTED_MODULE_0__.Point(x, y);
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
        connections: calculator.segments,
        triangles: calculator.triangles
    });
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcnNfY2FsY193b3JrZXJfdHMuYXBwLWJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBSW9CO0FBUUo7QUFFVCxNQUFNLG1CQUFtQjtJQUFoQztRQUNFOztXQUVHO1FBQ0gsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUVyQjs7V0FFRztRQUNILFVBQUssR0FBVyxFQUFFLENBQUM7UUFFbkI7O1dBRUc7UUFDSCxhQUFRLEdBQVcsRUFBRSxDQUFDO1FBRXRCOztXQUVHO1FBQ0gsY0FBUyxHQUFlLEVBQUUsQ0FBQztRQUUzQjs7O1dBR0c7UUFDSCxnQkFBVyxHQUF5QixJQUFJLEdBQUcsRUFBbUIsQ0FBQztJQWlHakUsQ0FBQztJQS9GUSxJQUFJLENBQUMsS0FBYTtRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssU0FBUztRQUNmLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxNQUFNLElBQUksR0FBRyx5REFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLElBQUksSUFBSSxDQUFDLElB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Q0FBQyxLQUFLO1FBQ3ZCLE1BQU0sRUFBRSxVQUFVLENBQUMsTUFBTTtRQUN6QixXQUFXLEVBQUUsVUFBVSxDQUFDLFFBQVE7UUFDaEMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTO0tBQ2hDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jYWxjdWxhdG9yLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jb3JlLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jb3JlbWF0aC50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvd29ya2Vycy9jYWxjLndvcmtlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIGZpbmRJbnRlcnNlY3Rpb25Qb2ludCxcclxuICBmaW5kQ29tbW9uTGluZSxcclxuICBjcmVhdGVUcmlhbmdsZUZyb21MaW5lcyxcclxufSBmcm9tIFwiLi9jb3JlbWF0aFwiO1xyXG5pbXBvcnQge1xyXG4gIExpbmUsXHJcbiAgUG9pbnQsXHJcbiAgVHJpYW5nbGUsXHJcbiAgYXJlTGluZXNFcXVhbCxcclxuICBhcmVQb2ludHNFcXVhbCxcclxuICBpc1RyaWFuZ2xlc0VxdWFsLFxyXG59IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZXNDYWxjdWxhdG9yIHtcclxuICAvKipcclxuICAgKiBBbiBhcnJheSBvZiBQb2ludCBvYmplY3RzIHJlcHJlc2VudGluZyBhbGwgdGhlIHBvaW50cy5cclxuICAgKi9cclxuICBwb2ludHM6IFBvaW50W10gPSBbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gYXJyYXkgb2YgTGluZSBvYmplY3RzIHJlcHJlc2VudGluZyBhbGwgdGhlIGxpbmVzIGluIHRoZSBkaWFncmFtLlxyXG4gICAqL1xyXG4gIGxpbmVzOiBMaW5lW10gPSBbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gYXJyYXkgb2YgTGluZSBvYmplY3RzIHJlcHJlc2VudGluZyBhbGwgdGhlIGxpbmUgc2VnbWVudHMsIGluY2x1ZGluZyB0aG9zZSB0aGF0IG1ha2UgdXAgdGhlIHRyaWFuZ2xlcy5cclxuICAgKi9cclxuICBzZWdtZW50czogTGluZVtdID0gW107XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuIGFycmF5IG9mIFRyaWFuZ2xlIG9iamVjdHMgcmVwcmVzZW50aW5nIGFsbCB0aGUgdHJpYW5nbGVzLlxyXG4gICAqL1xyXG4gIHRyaWFuZ2xlczogVHJpYW5nbGVbXSA9IFtdO1xyXG5cclxuICAvKipcclxuICAgKiBFYWNoIGtleSBpbiB0aGUgc2VnbWVudHMgbWFwIHJlcHJlc2VudHMgYSBsaW5lIGluZGV4LCBhbmQgaXRzIHZhbHVlIGlzIGFuIGFycmF5IG9mIHBvaW50cyB0aGF0IGJlbG9uZyB0byB0aGF0IGxpbmVcclxuICAgKiBUaGUgcG9pbnRzIGFycmF5IGNvbnRhaW5zIGFsbCB0aGUgZGlzdGluY3QgaW50ZXJzZWN0aW9uIHBvaW50cyBiZXR3ZWVuIHRoZSBsaW5lcywgYXMgd2VsbCBhcyB0aGUgc3RhcnQgYW5kIGVuZCBwb2ludHMgb2YgZWFjaCBsaW5lLlxyXG4gICAqL1xyXG4gIHNlZ21lbnRzTWFwOiBNYXA8bnVtYmVyLCBQb2ludFtdPiA9IG5ldyBNYXA8bnVtYmVyLCBQb2ludFtdPigpO1xyXG5cclxuICBwdWJsaWMgY2FsYyhsaW5lczogTGluZVtdKSB7XHJcbiAgICB0aGlzLmxpbmVzID0gbGluZXM7XHJcbiAgICB0aGlzLmNhbGNMaW5lcygpO1xyXG4gICAgdGhpcy5jYWxjSW50ZXJzZWN0aW9ucygpO1xyXG4gICAgdGhpcy5jYWxjU2VnbWVudHMoKTtcclxuICAgIHRoaXMuY2FsY1RyaWFuZ2xlcygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlcyB0aGUgbGluZXMgYXJyYXksIGZpbmRpbmcgYWxsIHRoZSB1bmlxdWUgbGluZXMgdGhhdCBjYW4gYmUgZm9ybWVkXHJcbiAgICogYW5kIGFkZHMgdG8gdGhlIGFycmF5LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2FsY0xpbmVzKCkge1xyXG4gICAgY29uc3QgbkxpbmVzID0gdGhpcy5saW5lcy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5MaW5lcyAtIDE7IGkrKykge1xyXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuTGluZXM7IGorKykge1xyXG4gICAgICAgIGNvbnN0IGxpbmUgPSBmaW5kQ29tbW9uTGluZSh0aGlzLmxpbmVzW2ldLCB0aGlzLmxpbmVzW2pdKTtcclxuICAgICAgICBpZiAobGluZSAmJiAhdGhpcy5saW5lcy5zb21lKChsKSA9PiBhcmVMaW5lc0VxdWFsKGwsIGxpbmUpKSkge1xyXG4gICAgICAgICAgdGhpcy5saW5lcy5wdXNoKGxpbmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlcyB0aGUgaW50ZXJzZWN0aW9ucyBvZiB0aGUgbGluZXMgYW5kIHVwZGF0ZXMgdGhlIHNlZ21lbnRzIG1hcC5cclxuICAgKi9cclxuICBwcml2YXRlIGNhbGNJbnRlcnNlY3Rpb25zKCkge1xyXG4gICAgdGhpcy5zZWdtZW50c01hcCA9IG5ldyBNYXA8bnVtYmVyLCBQb2ludFtdPigpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuc2V0KGksIFtdKTtcclxuICAgIH1cclxuICAgIHRoaXMucG9pbnRzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IHRoaXMubGluZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBjb25zdCBpbnRlcnNlY3Rpb25Qb2ludCA9IGZpbmRJbnRlcnNlY3Rpb25Qb2ludChcclxuICAgICAgICAgIHRoaXMubGluZXNbaV0sXHJcbiAgICAgICAgICB0aGlzLmxpbmVzW2pdXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoaW50ZXJzZWN0aW9uUG9pbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLnBvaW50cy5zb21lKChwKSA9PiBhcmVQb2ludHNFcXVhbChwLCBpbnRlcnNlY3Rpb25Qb2ludCkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQoaSk/LnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQoaik/LnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnBvaW50cy5wdXNoKHRoaXMubGluZXNbaV0uc3RhcnQpO1xyXG4gICAgICB0aGlzLnBvaW50cy5wdXNoKHRoaXMubGluZXNbaV0uZW5kKTtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQoaSk/LnB1c2godGhpcy5saW5lc1tpXS5zdGFydCk7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuZ2V0KGkpPy5wdXNoKHRoaXMubGluZXNbaV0uZW5kKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZXMgdGhlIGNvbm5lY3Rpb25zIGJldHdlZW4gdGhlIGludGVyc2VjdGlvbiBwb2ludHMgb2YgdGhlIGxpbmVzXHJcbiAgICogYW5kIHN0b3JlcyB0aGVtIGluIHRoZSBzZWdtZW50cyBwcm9wZXJ0eS5cclxuICAgKi9cclxuICBwcml2YXRlIGNhbGNTZWdtZW50cygpIHtcclxuICAgIHRoaXMuc2VnbWVudHMgPSBbXTtcclxuICAgIGZvciAobGV0IGludGVyc2VjdGlvblBvaW50cyBvZiB0aGlzLnNlZ21lbnRzTWFwLnZhbHVlcygpKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJzZWN0aW9uUG9pbnRzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IGludGVyc2VjdGlvblBvaW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgY29uc3QgcDEgPSBpbnRlcnNlY3Rpb25Qb2ludHNbaV07XHJcbiAgICAgICAgICBjb25zdCBwMiA9IGludGVyc2VjdGlvblBvaW50c1tqXTtcclxuICAgICAgICAgIGlmICghYXJlUG9pbnRzRXF1YWwocDEsIHAyKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUocDEsIHAyKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlZ21lbnRzLnNvbWUoKGwpID0+IGFyZUxpbmVzRXF1YWwobCwgbGluZSkpKVxyXG4gICAgICAgICAgICAgIHRoaXMuc2VnbWVudHMucHVzaChuZXcgTGluZShwMSwgcDIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZXMgdGhlIHRyaWFuZ2xlcyBpbiB0aGUgY3VycmVudCBzdGF0ZS5cclxuICAgKi9cclxuICBwcml2YXRlIGNhbGNUcmlhbmdsZXMoKSB7XHJcbiAgICB0aGlzLnRyaWFuZ2xlcyA9IFtdO1xyXG4gICAgY29uc3QgbkNvbm5lY3Rpb25zID0gdGhpcy5zZWdtZW50cy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5Db25uZWN0aW9ucyAtIDE7IGkrKykge1xyXG4gICAgICBjb25zdCBsMSA9IHRoaXMuc2VnbWVudHNbaV07XHJcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG5Db25uZWN0aW9uczsgaisrKSB7XHJcbiAgICAgICAgY29uc3QgbDIgPSB0aGlzLnNlZ21lbnRzW2pdO1xyXG4gICAgICAgIGZvciAobGV0IGsgPSBqICsgMTsgayA8IG5Db25uZWN0aW9uczsgaysrKSB7XHJcbiAgICAgICAgICBjb25zdCBsMyA9IHRoaXMuc2VnbWVudHNba107XHJcbiAgICAgICAgICBjb25zdCB0cmlhbmdsZSA9IGNyZWF0ZVRyaWFuZ2xlRnJvbUxpbmVzKGwxLCBsMiwgbDMpO1xyXG4gICAgICAgICAgaWYgKHRyaWFuZ2xlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50cmlhbmdsZXMucHVzaCh0cmlhbmdsZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCB2YXIgRVBTSUxPTjogbnVtYmVyID0gMC4xO1xyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgYSBwb2ludCBpbiAyRCBjb29yZGluYXRlIHN5c3RlbS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cclxuXHJcbiAgLyoqXHJcbiAgKiBDcmVhdGVzIGEgbmV3IGBQb2ludGAgb2JqZWN0IHdpdGggdGhlIHNhbWUgeCBhbmQgeSBjb29yZGluYXRlcyBhcyB0aGlzIG9uZS5cclxuICAqIEByZXR1cm5zIEEgbmV3IGBQb2ludGAgb2JqZWN0IHdpdGggdGhlIHNhbWUgeCBhbmQgeSBjb29yZGluYXRlcyBhcyB0aGlzIG9uZS5cclxuICAqL1xyXG4gIHB1YmxpYyBjbG9uZSgpOiBQb2ludCB7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXByZXNlbnRzIGEgbGluZSBieSB0d28gcG9pbnRzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExpbmUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogUG9pbnQsIHB1YmxpYyBlbmQ6IFBvaW50KSB7fVxyXG59XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIHRyaWFuZ2xlIGJ5IHRocmVlIHBvaW50cy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZSB7XHJcbiAgcHVibGljIHBvaW50czogUG9pbnRbXTtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcDE6IFBvaW50LCBwdWJsaWMgcDI6IFBvaW50LCBwdWJsaWMgcDM6IFBvaW50KSB7XHJcbiAgICB0aGlzLnBvaW50cyA9IFtwMSwgcDIsIHAzXTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gIERldGVybWluZXMgd2hldGhlciB0d28gcG9pbnRzIGFyZSBlcXVhbCB3aXRoaW4gYSBnaXZlbiB0b2xlcmFuY2UuXHJcbiAgQHBhcmFtIHBvaW50QSBUaGUgZmlyc3QgcG9pbnQgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gcG9pbnRCIFRoZSBzZWNvbmQgcG9pbnQgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gdG9sZXJhbmNlIFRoZSBtYXhpbXVtIGFsbG93YWJsZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSB0d28gcG9pbnRzLlxyXG4gIEByZXR1cm5zIFRydWUgaWYgdGhlIHR3byBwb2ludHMgYXJlIGVxdWFsIHdpdGhpbiB0aGUgZ2l2ZW4gdG9sZXJhbmNlLCBmYWxzZSBvdGhlcndpc2UuXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcmVQb2ludHNFcXVhbChcclxuICBwb2ludEE6IFBvaW50LFxyXG4gIHBvaW50QjogUG9pbnQsXHJcbiAgdG9sZXJhbmNlOiBudW1iZXIgPSAxXHJcbik6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBNYXRoLmFicyhwb2ludEEueCAtIHBvaW50Qi54KSA8PSB0b2xlcmFuY2UgJiYgTWF0aC5hYnMocG9pbnRBLnkgLSBwb2ludEIueSkgPD0gdG9sZXJhbmNlO1xyXG59XHJcblxyXG4vKipcclxuICBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIGxpbmVzIGFyZSBlcXVhbCB3aXRoaW4gYSBnaXZlbiB0b2xlcmFuY2UuXHJcbiAgQHBhcmFtIGxpbmVBIFRoZSBmaXJzdCBsaW5lIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIGxpbmVCIFRoZSBzZWNvbmQga2luZSB0byBjb21wYXJlLlxyXG4gIEBwYXJhbSB0b2xlcmFuY2UgVGhlIG1heGltdW0gYWxsb3dhYmxlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIGVuZHBvaW50cyBvZiB0aGUgdHdvIGxpbmVzLlxyXG4gIEByZXR1cm5zIFRydWUgaWYgdGhlIHR3byBsaW5lcyBhcmUgZXF1YWwgd2l0aGluIHRoZSBnaXZlbiB0b2xlcmFuY2UsIGZhbHNlIG90aGVyd2lzZS5cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZUxpbmVzRXF1YWwoXHJcbiAgbGluZUE6IExpbmUsXHJcbiAgbGluZUI6IExpbmUsXHJcbiAgdG9sZXJhbmNlOiBudW1iZXIgPSAxXHJcbik6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICAoYXJlUG9pbnRzRXF1YWwobGluZUEuc3RhcnQsIGxpbmVCLnN0YXJ0LCB0b2xlcmFuY2UpICYmXHJcbiAgICAgIGFyZVBvaW50c0VxdWFsKGxpbmVBLmVuZCwgbGluZUIuZW5kLCB0b2xlcmFuY2UpKSB8fFxyXG4gICAgKGFyZVBvaW50c0VxdWFsKGxpbmVBLmVuZCwgbGluZUIuc3RhcnQsIHRvbGVyYW5jZSkgJiZcclxuICAgICAgYXJlUG9pbnRzRXF1YWwobGluZUEuc3RhcnQsIGxpbmVCLmVuZCwgdG9sZXJhbmNlKSlcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIHRyaWFuZ2xlcyBhcmUgZXF1YWwgd2l0aGluIGEgZ2l2ZW4gdG9sZXJhbmNlLlxyXG4gIEBwYXJhbSB0cmlhbmdsZUEgVGhlIGZpcnN0IHRyaWFuZ2xlIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIHRyaWFuZ2xlQiBUaGUgc2Vjb25kIHRyaWFuZ2xlIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIHRvbGVyYW5jZSBUaGUgbWF4aW11bSBhbGxvd2FibGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgdmVydGljZXMgb2YgdGhlIHR3byB0cmlhbmdsZXMuXHJcbiAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgdHdvIHRyaWFuZ2xlcyBhcmUgZXF1YWwgd2l0aGluIHRoZSBnaXZlbiB0b2xlcmFuY2UsIGZhbHNlIG90aGVyd2lzZS5cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJpYW5nbGVzRXF1YWwoXHJcbiAgdHJpYW5nbGVBOiBUcmlhbmdsZSxcclxuICB0cmlhbmdsZUI6IFRyaWFuZ2xlLFxyXG4gIHRvbGVyYW5jZTogbnVtYmVyID0gMVxyXG4pOiBib29sZWFuIHtcclxuICByZXR1cm4gdHJpYW5nbGVBLnBvaW50cy5ldmVyeSgocG9pbnRBKSA9PlxyXG4gICAgdHJpYW5nbGVCLnBvaW50cy5maW5kKChwb2ludEIpID0+IGFyZVBvaW50c0VxdWFsKHBvaW50QSwgcG9pbnRCLCB0b2xlcmFuY2UpKVxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlLCBhcmVQb2ludHNFcXVhbCwgRVBTSUxPTiB9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgdHJpYW5nbGUgZnJvbSB0aHJlZSBsaW5lcy5cclxuICogQHBhcmFtIGxpbmUxIC0gVGhlIGZpcnN0IGxpbmUgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gKiBAcGFyYW0gbGluZTIgLSBUaGUgc2Vjb25kIGxpbmUgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gKiBAcGFyYW0gbGluZTMgLSBUaGUgdGhpcmQgbGluZSBvZiB0aGUgdHJpYW5nbGUuXHJcbiAqIEByZXR1cm5zIFRoZSB0cmlhbmdsZSBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGxpbmVzLCBvciBudWxsIGlmIHRoZSBsaW5lcyBjYW5ub3QgZm9ybSBhIHZhbGlkIHRyaWFuZ2xlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyaWFuZ2xlRnJvbUxpbmVzKFxyXG4gIGxpbmUxOiBMaW5lLFxyXG4gIGxpbmUyOiBMaW5lLFxyXG4gIGxpbmUzOiBMaW5lXHJcbik6IFRyaWFuZ2xlIHwgbnVsbCB7XHJcbiAgbGV0IGhwb2ludHMgPSBbXHJcbiAgICBsaW5lMS5zdGFydCxcclxuICAgIGxpbmUxLmVuZCxcclxuICAgIGxpbmUyLnN0YXJ0LFxyXG4gICAgbGluZTIuZW5kLFxyXG4gICAgbGluZTMuc3RhcnQsXHJcbiAgICBsaW5lMy5lbmQsXHJcbiAgXTtcclxuICBocG9pbnRzID0gaHBvaW50cy5maWx0ZXIoXHJcbiAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHApID0+IGFyZVBvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICApO1xyXG4gIC8vIFRoZSB0cmlhbmdsZSBtdXN0IGNvbnNpc3Qgc3RyaWN0bHkgb2YgdGhyZWUgdW5pcXVlIHBvaW50c1xyXG4gIGlmIChocG9pbnRzLmxlbmd0aCAhPSAzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgLy8gQ2hlY2tpbmcgZm9yIHRoZSBwb3NzaWJpbGl0eSBvZiB0aGUgZXhpc3RlbmNlIG9mIGEgdHJpYW5nbGVcclxuICB2YXIgYSA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lMS5zdGFydCwgbGluZTEuZW5kKTtcclxuICB2YXIgYiA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lMi5zdGFydCwgbGluZTIuZW5kKTtcclxuICB2YXIgYyA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lMy5zdGFydCwgbGluZTMuZW5kKTtcclxuICBpZiAoYSA+IGIgKyBjIHx8IGIgPiBhICsgYyB8fCBjID4gYSArIGIpIHJldHVybiBudWxsO1xyXG4gIGNvbnN0IHAgPSAoYSArIGIgKyBjKSAvIDI7XHJcbiAgbGV0IFMgPSBNYXRoLnNxcnQocCAqIChwIC0gYSkgKiAocCAtIGIpICogKHAgLSBjKSk7XHJcbiAgaWYgKGlzTmFOKFMpIHx8IFMgPD0gMSkgcmV0dXJuIG51bGw7XHJcblxyXG4gIHJldHVybiBuZXcgVHJpYW5nbGUoaHBvaW50c1swXSwgaHBvaW50c1sxXSwgaHBvaW50c1syXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBwb2ludHM6IFBvaW50W10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCB0b1BvaW50IG9mIHBvaW50cykge1xyXG4gICAgbGV0IGRpc3RhY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHRvUG9pbnQpO1xyXG4gICAgaWYgKGRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBkaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHRvUG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBkaXN0U3RhcnQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuc3RhcnQpO1xyXG4gICAgbGV0IGRpc3RFbmQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuZW5kKTtcclxuXHJcbiAgICBpZiAoTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluUG9pbnQgPSBkaXN0U3RhcnQgPCBkaXN0RW5kID8gbGluZS5zdGFydCA6IGxpbmUuZW5kO1xyXG4gICAgICBtaW5EaXN0ID0gTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IHBkID0gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUocG9pbnQsIGxpbmUpO1xyXG4gICAgaWYgKHBkLmRpc3RhbmNlIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5EaXN0ID0gcGQuZGlzdGFuY2U7XHJcbiAgICAgIG1pblBvaW50ID0gcGQubmVhcmVzdFBvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYWxjdWxhdGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMuXHJcbiAqIEBwYXJhbSBwb2ludEEgLSBUaGUgZmlyc3QgcG9pbnRcclxuICogQHBhcmFtIHBvaW50QiAtIFRoZSBzZWNvbmQgcG9pbnRcclxuICogQHJldHVybnMgVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnRBOiBQb2ludCwgcG9pbnRCOiBQb2ludCk6IG51bWJlciB7XHJcbiAgcmV0dXJuIE1hdGguc3FydCgocG9pbnRBLnggLSBwb2ludEIueCkgKiogMiArIChwb2ludEEueSAtIHBvaW50Qi55KSAqKiAyKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBwb2ludCBhbmQgYSBsaW5lLCBhbmQgZmluZHMgdGhlIG5lYXJlc3QgcG9pbnQgb24gdGhlIGxpbmUgdG8gdGhlIGdpdmVuIHBvaW50LlxyXG4gKiBAcGFyYW0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gZmluZCB0aGUgZGlzdGFuY2UgdG8gdGhlIGxpbmUgZnJvbS5cclxuICogQHBhcmFtIGxpbmUgLSBUaGUgbGluZSB0byBmaW5kIHRoZSBkaXN0YW5jZSB0byB0aGUgcG9pbnQgZnJvbS5cclxuICogQHJldHVybnMgVGhlIG5lYXJlc3QgcG9pbnQgb24gdGhlIGxpbmUgdG8gdGhlIGdpdmVuIHBvaW50IGFuZCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgZ2l2ZW4gcG9pbnQgYW5kIHRoZSBsaW5lLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lOiBMaW5lXHJcbik6IHsgbmVhcmVzdFBvaW50OiBQb2ludDsgZGlzdGFuY2U6IG51bWJlciB9IHtcclxuICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IGxpbmU7XHJcbiAgY29uc3QgZHggPSBlbmQueCAtIHN0YXJ0Lng7XHJcbiAgY29uc3QgZHkgPSBlbmQueSAtIHN0YXJ0Lnk7XHJcblxyXG4gIC8vIElmIHRoZSBsaW5lIGlzIGp1c3QgYSBwb2ludCwgcmV0dXJuIGRpc3RhbmNlIHRvIHRoYXQgcG9pbnRcclxuICBpZiAoZHggPT09IDAgJiYgZHkgPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRpc3RhbmNlOiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHN0YXJ0KSxcclxuICAgICAgbmVhcmVzdFBvaW50OiBzdGFydCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIHBhcmFtZXRlciBvZiB0aGUgcHJvamVjdGlvbiBvZiB0aGUgcG9pbnQgb250byB0aGUgbGluZVxyXG4gIGNvbnN0IHQgPVxyXG4gICAgKChwb2ludC54IC0gc3RhcnQueCkgKiBkeCArIChwb2ludC55IC0gc3RhcnQueSkgKiBkeSkgLyAoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAvLyBJZiB0IGlzIG91dHNpZGUgdGhlIHJhbmdlIFswLCAxXSwgdGhlbiB0aGUgbmVhcmVzdCBwb2ludCBpcyBvbmUgb2YgdGhlIGxpbmUgZW5kcG9pbnRzXHJcbiAgaWYgKHQgPCAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkaXN0YW5jZTogZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBzdGFydCksXHJcbiAgICAgIG5lYXJlc3RQb2ludDogc3RhcnQsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAodCA+IDEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRpc3RhbmNlOiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGVuZCksXHJcbiAgICAgIG5lYXJlc3RQb2ludDogZW5kLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIENhbGN1bGF0ZSB0aGUgbmVhcmVzdCBwb2ludCBvbiB0aGUgbGluZSBhbmQgcmV0dXJuIGl0cyBkaXN0YW5jZSB0byB0aGUgcG9pbnRcclxuICBjb25zdCBuZWFyZXN0UG9pbnQgPSBuZXcgUG9pbnQoc3RhcnQueCArIHQgKiBkeCwgc3RhcnQueSArIHQgKiBkeSk7XHJcbiAgY29uc3QgZGlzdGFuY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIG5lYXJlc3RQb2ludCk7XHJcbiAgcmV0dXJuIHsgZGlzdGFuY2UsIG5lYXJlc3RQb2ludCB9O1xyXG59XHJcblxyXG4vKipcclxuICogIFJldHVybnMgYSBsaW5lIHdoaWNoIGNvbnRhaW5zIHRoZSBjb21tb24gcGFydHMgb2YgdHdvIGxpbmVzIGlmIHRoZXkgYXJlIHBhcnRzIG9mIG9uZSBsaW5lLlxyXG4gKiAgQHBhcmFtIGxpbmUxIFRoZSBmaXJzdCBsaW5lLlxyXG4gKiAgQHBhcmFtIGxpbmUyIFRoZSBzZWNvbmQgbGluZS5cclxuICogIEByZXR1cm5zIEEgbmV3IExpbmUgb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgY29tbW9uIHBhcnRzIG9mIHRoZSB0d28gaW5wdXQgbGluZXMsIG9yIG51bGwgaWYgdGhleSBhcmUgbm90IHBhcnRzIG9mIG9uZSBsaW5lLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRDb21tb25MaW5lKGxpbmUxOiBMaW5lLCBsaW5lMjogTGluZSk6IExpbmUgfCBudWxsIHtcclxuICBpZiAoIWFyZUxpbmVzUGFyYWxsZWwobGluZTEsIGxpbmUyKSkgcmV0dXJuIG51bGw7XHJcblxyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5zdGFydCwgbGluZTIuc3RhcnQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLmVuZCwgbGluZTIuZW5kKTtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLmVuZCwgbGluZTIuZW5kKSlcclxuICAgIHJldHVybiBuZXcgTGluZShsaW5lMS5zdGFydCwgbGluZTIuc3RhcnQpO1xyXG5cclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuc3RhcnQsIGxpbmUyLmVuZCkpXHJcbiAgICByZXR1cm4gbmV3IExpbmUobGluZTEuZW5kLCBsaW5lMi5zdGFydCk7XHJcblxyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0KSlcclxuICAgIHJldHVybiBuZXcgTGluZShsaW5lMS5zdGFydCwgbGluZTIuZW5kKTtcclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kQ29tbW9uUG9pbnQobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogUG9pbnQgfCBudWxsIHtcclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuc3RhcnQsIGxpbmUyLnN0YXJ0KSkgcmV0dXJuIGxpbmUxLnN0YXJ0LmNsb25lKCk7XHJcblxyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5lbmQsIGxpbmUyLmVuZCkpIHJldHVybiBsaW5lMS5lbmQuY2xvbmUoKTtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLnN0YXJ0LCBsaW5lMi5lbmQpKSByZXR1cm4gbGluZTEuc3RhcnQuY2xvbmUoKTtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLmVuZCwgbGluZTIuc3RhcnQpKSByZXR1cm4gbGluZTEuZW5kLmNsb25lKCk7XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHR3byBsaW5lcyBhcmUgcGFyYWxsZWwuXHJcbiAqXHJcbiAqIEBwYXJhbSBsaW5lMSBUaGUgZmlyc3QgbGluZS5cclxuICogQHBhcmFtIGxpbmUyIFRoZSBzZWNvbmQgbGluZS5cclxuICpcclxuICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgbGluZXMgYXJlIHBhcmFsbGVsLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYXJlTGluZXNQYXJhbGxlbChsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBib29sZWFuIHtcclxuICBpZiAoXHJcbiAgICBNYXRoLmFicyhsaW5lMS5zdGFydC55IC0gbGluZTEuZW5kLnkpIDw9IEVQU0lMT04gJiZcclxuICAgIE1hdGguYWJzKGxpbmUyLnN0YXJ0LnkgLSBsaW5lMi5lbmQueSkgPD0gRVBTSUxPTlxyXG4gICkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBpZiAoXHJcbiAgICBNYXRoLmFicyhsaW5lMS5zdGFydC54IC0gbGluZTEuZW5kLngpIDw9IEVQU0lMT04gJiZcclxuICAgIE1hdGguYWJzKGxpbmUyLnN0YXJ0LnggLSBsaW5lMi5lbmQueCkgPD0gRVBTSUxPTlxyXG4gICkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBsZXQgazEgPSBNYXRoLmF0YW4oXHJcbiAgICAobGluZTEuZW5kLnkgLSBsaW5lMS5zdGFydC55KSAvIChsaW5lMS5lbmQueCAtIGxpbmUxLnN0YXJ0LngpXHJcbiAgKTtcclxuICBsZXQgazIgPSBNYXRoLmF0YW4oXHJcbiAgICAobGluZTIuZW5kLnkgLSBsaW5lMi5zdGFydC55KSAvIChsaW5lMi5lbmQueCAtIGxpbmUyLnN0YXJ0LngpXHJcbiAgKTtcclxuICByZXR1cm4gTWF0aC5hYnMoazEgLSBrMikgPD0gRVBTSUxPTjtcclxufVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciBhIHBvaW50IGlzIGxvY2F0ZWQgb24gYSBnaXZlbiBsaW5lIHNlZ21lbnQuXHJcbiAqIEBwYXJhbSBsaW5lIC0gVGhlIGxpbmUgc2VnbWVudCB0byB0ZXN0LlxyXG4gKiBAcGFyYW0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gY2hlY2suXHJcbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHBvaW50IGlzIG9uIHRoZSBsaW5lIHNlZ21lbnQsIGZhbHNlIG90aGVyd2lzZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50T25MaW5lKGxpbmU6IExpbmUsIHBvaW50OiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBNYXRoLmFicyhcclxuICAgICAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUuc3RhcnQsIHBvaW50KSArXHJcbiAgICAgICAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUuZW5kLCBwb2ludCkgLVxyXG4gICAgICAgIGRpc3RhbmNlQmV0d2VlblBvaW50cyhsaW5lLmVuZCwgbGluZS5zdGFydClcclxuICAgICkgPD0gRVBTSUxPTlxyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBwb2ludCBvZiBpbnRlcnNlY3Rpb24gb3IgY29ubmVjdGlvbiBiZXR3ZWVuIHR3byBsaW5lIHNlZ21lbnRzLlxyXG4gKiBAcGFyYW0gbGluZTEgLSBUaGUgZmlyc3QgbGluZSBzZWdtZW50LlxyXG4gKiBAcGFyYW0gbGluZTIgLSBUaGUgc2Vjb25kIGxpbmUgc2VnbWVudC5cclxuICogQHJldHVybnMgVGhlIHBvaW50IG9mIGludGVyc2VjdGlvbiBvciBjb25uZWN0aW9uIGJldHdlZW4gdGhlIHR3byBsaW5lIHNlZ21lbnRzLCBvciBudWxsLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRJbnRlcnNlY3Rpb25Qb2ludChsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBQb2ludCB8IG51bGwge1xyXG4gIC8vIENoZWNrIGlmIHRoZSB0d28gbGluZSBzZWdtZW50cyBhcmUgcGFyYWxsZWxcclxuICBpZiAoYXJlTGluZXNQYXJhbGxlbChsaW5lMSwgbGluZTIpKSB7XHJcbiAgICAvLyBJZiB0aGV5IGFyZSBwYXJhbGxlbCwgY2hlY2sgaWYgdGhleSBsaWUgb24gdGhlIHNhbWUgbGluZVxyXG4gICAgcmV0dXJuIGZpbmRDb21tb25Qb2ludChsaW5lMSwgbGluZTIpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIHRoZSBzbG9wZXMgb2YgdGhlIGxpbmVzXHJcbiAgY29uc3Qgc2xvcGUxID0gKGxpbmUxLmVuZC55IC0gbGluZTEuc3RhcnQueSkgLyAobGluZTEuZW5kLnggLSBsaW5lMS5zdGFydC54KTtcclxuICBjb25zdCBzbG9wZTIgPSAobGluZTIuZW5kLnkgLSBsaW5lMi5zdGFydC55KSAvIChsaW5lMi5lbmQueCAtIGxpbmUyLnN0YXJ0LngpO1xyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIHktaW50ZXJjZXB0cyBvZiB0aGUgbGluZXNcclxuICBjb25zdCB5SW50ZXJjZXB0MSA9IGxpbmUxLnN0YXJ0LnkgLSBzbG9wZTEgKiBsaW5lMS5zdGFydC54O1xyXG4gIGNvbnN0IHlJbnRlcmNlcHQyID0gbGluZTIuc3RhcnQueSAtIHNsb3BlMiAqIGxpbmUyLnN0YXJ0Lng7XHJcblxyXG4gIC8vIENoZWNrIGlmIGVpdGhlciBzbG9wZSBpcyB2ZXJ0aWNhbCAoaS5lLiBpbmZpbml0ZSlcclxuICBpZiAoIWlzRmluaXRlKHNsb3BlMSkpIHtcclxuICAgIHJldHVybiBuZXcgUG9pbnQobGluZTEuc3RhcnQueCwgc2xvcGUyICogbGluZTEuc3RhcnQueCArIHlJbnRlcmNlcHQyKTtcclxuICB9XHJcbiAgaWYgKCFpc0Zpbml0ZShzbG9wZTIpKSB7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50KGxpbmUyLnN0YXJ0LngsIHNsb3BlMSAqIGxpbmUyLnN0YXJ0LnggKyB5SW50ZXJjZXB0MSk7XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50XHJcbiAgY29uc3QgeCA9ICh5SW50ZXJjZXB0MiAtIHlJbnRlcmNlcHQxKSAvIChzbG9wZTEgLSBzbG9wZTIpO1xyXG5cclxuICAvLyBDaGVjayBpZiB0aGUgeC1jb29yZGluYXRlIGlzIG91dCBvZiByYW5nZSBmb3IgYm90aCBsaW5lIHNlZ21lbnRzXHJcbiAgaWYgKFxyXG4gICAgeCA8IE1hdGgubWluKGxpbmUxLnN0YXJ0LngsIGxpbmUxLmVuZC54KSAtIEVQU0lMT04gfHxcclxuICAgIHggPiBNYXRoLm1heChsaW5lMS5zdGFydC54LCBsaW5lMS5lbmQueCkgKyBFUFNJTE9OIHx8XHJcbiAgICB4IDwgTWF0aC5taW4obGluZTIuc3RhcnQueCwgbGluZTIuZW5kLngpIC0gRVBTSUxPTiB8fFxyXG4gICAgeCA+IE1hdGgubWF4KGxpbmUyLnN0YXJ0LngsIGxpbmUyLmVuZC54KSArIEVQU0lMT05cclxuICApIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIHRoZSB5LWNvb3JkaW5hdGUgb2YgdGhlIGludGVyc2VjdGlvbiBwb2ludFxyXG4gIGNvbnN0IHkgPSBzbG9wZTEgKiB4ICsgeUludGVyY2VwdDE7XHJcblxyXG4gIC8vIFJldHVybiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50XHJcbiAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFRyaWFuZ2xlc0NhbGN1bGF0b3IgfSBmcm9tIFwiLi4vY2FsY3VsYXRvclwiO1xyXG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4uL2NvcmVcIjtcclxuXHJcblxyXG5jb25zdCBjYWxjdWxhdG9yID0gbmV3IFRyaWFuZ2xlc0NhbGN1bGF0b3IoKTtcclxuXHJcbnNlbGYub25tZXNzYWdlID0gKG1lc3NhZ2U6IE1lc3NhZ2VFdmVudDxMaW5lW10+KSA9PiB7XHJcbiAgY2FsY3VsYXRvci5jYWxjKG1lc3NhZ2UuZGF0YSk7XHJcbiAgc2VsZi5wb3N0TWVzc2FnZSh7XHJcbiAgICByZXN1bHQ6IGNhbGN1bGF0b3IudHJpYW5nbGVzLmxlbmd0aCxcclxuICAgIGxpbmVzOiBjYWxjdWxhdG9yLmxpbmVzLFxyXG4gICAgcG9pbnRzOiBjYWxjdWxhdG9yLnBvaW50cyxcclxuICAgIGNvbm5lY3Rpb25zOiBjYWxjdWxhdG9yLnNlZ21lbnRzLFxyXG4gICAgdHJpYW5nbGVzOiBjYWxjdWxhdG9yLnRyaWFuZ2xlc1xyXG4gIH0pO1xyXG59O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=