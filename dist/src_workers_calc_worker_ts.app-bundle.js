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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcnNfY2FsY193b3JrZXJfdHMuYXBwLWJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBSW9CO0FBUUo7QUFFVCxNQUFNLG1CQUFtQjtJQUFoQztRQUNFOztXQUVHO1FBQ0gsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUVyQjs7V0FFRztRQUNILFVBQUssR0FBVyxFQUFFLENBQUM7UUFFbkI7O1dBRUc7UUFDSCxhQUFRLEdBQVcsRUFBRSxDQUFDO1FBRXRCOztXQUVHO1FBQ0gsY0FBUyxHQUFlLEVBQUUsQ0FBQztRQUUzQjs7O1dBR0c7UUFDSCxnQkFBVyxHQUF5QixJQUFJLEdBQUcsRUFBbUIsQ0FBQztJQWlHakUsQ0FBQztJQS9GUSxJQUFJLENBQUMsS0FBYTtRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssU0FBUztRQUNmLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxNQUFNLElBQUksR0FBRyx5REFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLElBQUksSUFBSSxDQUFDLElB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LE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxnQ0FBZ0M7SUFDaEMsT0FBTyxJQUFJLHdDQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLENBQUM7Ozs7Ozs7VUNoU0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05vRDtBQUlwRCxNQUFNLFVBQVUsR0FBRyxJQUFJLDREQUFtQixFQUFFLENBQUM7QUFFN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLE9BQTZCLEVBQUUsRUFBRTtJQUNqRCxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2YsTUFBTSxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTTtRQUNuQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUs7UUFDdkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNO1FBQ3pCLFdBQVcsRUFBRSxVQUFVLENBQUMsUUFBUTtRQUNoQyxTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVM7S0FDaEMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NhbGN1bGF0b3IudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NvcmVtYXRoLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy93b3JrZXJzL2NhbGMud29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgZmluZEludGVyc2VjdGlvblBvaW50LFxyXG4gIGZpbmRDb21tb25MaW5lLFxyXG4gIGNyZWF0ZVRyaWFuZ2xlRnJvbUxpbmVzLFxyXG59IGZyb20gXCIuL2NvcmVtYXRoXCI7XHJcbmltcG9ydCB7XHJcbiAgTGluZSxcclxuICBQb2ludCxcclxuICBUcmlhbmdsZSxcclxuICBhcmVMaW5lc0VxdWFsLFxyXG4gIGFyZVBvaW50c0VxdWFsLFxyXG4gIGlzVHJpYW5nbGVzRXF1YWwsXHJcbn0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlc0NhbGN1bGF0b3Ige1xyXG4gIC8qKlxyXG4gICAqIEFuIGFycmF5IG9mIFBvaW50IG9iamVjdHMgcmVwcmVzZW50aW5nIGFsbCB0aGUgcG9pbnRzLlxyXG4gICAqL1xyXG4gIHBvaW50czogUG9pbnRbXSA9IFtdO1xyXG5cclxuICAvKipcclxuICAgKiBBbiBhcnJheSBvZiBMaW5lIG9iamVjdHMgcmVwcmVzZW50aW5nIGFsbCB0aGUgbGluZXMgaW4gdGhlIGRpYWdyYW0uXHJcbiAgICovXHJcbiAgbGluZXM6IExpbmVbXSA9IFtdO1xyXG5cclxuICAvKipcclxuICAgKiBBbiBhcnJheSBvZiBMaW5lIG9iamVjdHMgcmVwcmVzZW50aW5nIGFsbCB0aGUgbGluZSBzZWdtZW50cywgaW5jbHVkaW5nIHRob3NlIHRoYXQgbWFrZSB1cCB0aGUgdHJpYW5nbGVzLlxyXG4gICAqL1xyXG4gIHNlZ21lbnRzOiBMaW5lW10gPSBbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gYXJyYXkgb2YgVHJpYW5nbGUgb2JqZWN0cyByZXByZXNlbnRpbmcgYWxsIHRoZSB0cmlhbmdsZXMuXHJcbiAgICovXHJcbiAgdHJpYW5nbGVzOiBUcmlhbmdsZVtdID0gW107XHJcblxyXG4gIC8qKlxyXG4gICAqIEVhY2gga2V5IGluIHRoZSBzZWdtZW50cyBtYXAgcmVwcmVzZW50cyBhIGxpbmUgaW5kZXgsIGFuZCBpdHMgdmFsdWUgaXMgYW4gYXJyYXkgb2YgcG9pbnRzIHRoYXQgYmVsb25nIHRvIHRoYXQgbGluZVxyXG4gICAqIFRoZSBwb2ludHMgYXJyYXkgY29udGFpbnMgYWxsIHRoZSBkaXN0aW5jdCBpbnRlcnNlY3Rpb24gcG9pbnRzIGJldHdlZW4gdGhlIGxpbmVzLCBhcyB3ZWxsIGFzIHRoZSBzdGFydCBhbmQgZW5kIHBvaW50cyBvZiBlYWNoIGxpbmUuXHJcbiAgICovXHJcbiAgc2VnbWVudHNNYXA6IE1hcDxudW1iZXIsIFBvaW50W10+ID0gbmV3IE1hcDxudW1iZXIsIFBvaW50W10+KCk7XHJcblxyXG4gIHB1YmxpYyBjYWxjKGxpbmVzOiBMaW5lW10pIHtcclxuICAgIHRoaXMubGluZXMgPSBsaW5lcztcclxuICAgIHRoaXMuY2FsY0xpbmVzKCk7XHJcbiAgICB0aGlzLmNhbGNJbnRlcnNlY3Rpb25zKCk7XHJcbiAgICB0aGlzLmNhbGNTZWdtZW50cygpO1xyXG4gICAgdGhpcy5jYWxjVHJpYW5nbGVzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGVzIHRoZSBsaW5lcyBhcnJheSwgZmluZGluZyBhbGwgdGhlIHVuaXF1ZSBsaW5lcyB0aGF0IGNhbiBiZSBmb3JtZWRcclxuICAgKiBhbmQgYWRkcyB0byB0aGUgYXJyYXkuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjYWxjTGluZXMoKSB7XHJcbiAgICBjb25zdCBuTGluZXMgPSB0aGlzLmxpbmVzLmxlbmd0aDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbkxpbmVzIC0gMTsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG5MaW5lczsgaisrKSB7XHJcbiAgICAgICAgY29uc3QgbGluZSA9IGZpbmRDb21tb25MaW5lKHRoaXMubGluZXNbaV0sIHRoaXMubGluZXNbal0pO1xyXG4gICAgICAgIGlmIChsaW5lICYmICF0aGlzLmxpbmVzLnNvbWUoKGwpID0+IGFyZUxpbmVzRXF1YWwobCwgbGluZSkpKSB7XHJcbiAgICAgICAgICB0aGlzLmxpbmVzLnB1c2gobGluZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGVzIHRoZSBpbnRlcnNlY3Rpb25zIG9mIHRoZSBsaW5lcyBhbmQgdXBkYXRlcyB0aGUgc2VnbWVudHMgbWFwLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2FsY0ludGVyc2VjdGlvbnMoKSB7XHJcbiAgICB0aGlzLnNlZ21lbnRzTWFwID0gbmV3IE1hcDxudW1iZXIsIFBvaW50W10+KCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5zZXQoaSwgW10pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wb2ludHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgdGhpcy5saW5lcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGNvbnN0IGludGVyc2VjdGlvblBvaW50ID0gZmluZEludGVyc2VjdGlvblBvaW50KFxyXG4gICAgICAgICAgdGhpcy5saW5lc1tpXSxcclxuICAgICAgICAgIHRoaXMubGluZXNbal1cclxuICAgICAgICApO1xyXG4gICAgICAgIGlmIChpbnRlcnNlY3Rpb25Qb2ludCAhPSBudWxsKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMucG9pbnRzLnNvbWUoKHApID0+IGFyZVBvaW50c0VxdWFsKHAsIGludGVyc2VjdGlvblBvaW50KSkpIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHMucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnNlZ21lbnRzTWFwLmdldChpKT8ucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgICB0aGlzLnNlZ21lbnRzTWFwLmdldChqKT8ucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucG9pbnRzLnB1c2godGhpcy5saW5lc1tpXS5zdGFydCk7XHJcbiAgICAgIHRoaXMucG9pbnRzLnB1c2godGhpcy5saW5lc1tpXS5lbmQpO1xyXG4gICAgICB0aGlzLnNlZ21lbnRzTWFwLmdldChpKT8ucHVzaCh0aGlzLmxpbmVzW2ldLnN0YXJ0KTtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQoaSk/LnB1c2godGhpcy5saW5lc1tpXS5lbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlcyB0aGUgY29ubmVjdGlvbnMgYmV0d2VlbiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50cyBvZiB0aGUgbGluZXNcclxuICAgKiBhbmQgc3RvcmVzIHRoZW0gaW4gdGhlIHNlZ21lbnRzIHByb3BlcnR5LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2FsY1NlZ21lbnRzKCkge1xyXG4gICAgdGhpcy5zZWdtZW50cyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaW50ZXJzZWN0aW9uUG9pbnRzIG9mIHRoaXMuc2VnbWVudHNNYXAudmFsdWVzKCkpIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcnNlY3Rpb25Qb2ludHMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgaW50ZXJzZWN0aW9uUG9pbnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICBjb25zdCBwMSA9IGludGVyc2VjdGlvblBvaW50c1tpXTtcclxuICAgICAgICAgIGNvbnN0IHAyID0gaW50ZXJzZWN0aW9uUG9pbnRzW2pdO1xyXG4gICAgICAgICAgaWYgKCFhcmVQb2ludHNFcXVhbChwMSwgcDIpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBuZXcgTGluZShwMSwgcDIpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VnbWVudHMuc29tZSgobCkgPT4gYXJlTGluZXNFcXVhbChsLCBsaW5lKSkpXHJcbiAgICAgICAgICAgICAgdGhpcy5zZWdtZW50cy5wdXNoKG5ldyBMaW5lKHAxLCBwMikpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlcyB0aGUgdHJpYW5nbGVzIGluIHRoZSBjdXJyZW50IHN0YXRlLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2FsY1RyaWFuZ2xlcygpIHtcclxuICAgIHRoaXMudHJpYW5nbGVzID0gW107XHJcbiAgICBjb25zdCBuQ29ubmVjdGlvbnMgPSB0aGlzLnNlZ21lbnRzLmxlbmd0aDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbkNvbm5lY3Rpb25zIC0gMTsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGwxID0gdGhpcy5zZWdtZW50c1tpXTtcclxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbkNvbm5lY3Rpb25zOyBqKyspIHtcclxuICAgICAgICBjb25zdCBsMiA9IHRoaXMuc2VnbWVudHNbal07XHJcbiAgICAgICAgZm9yIChsZXQgayA9IGogKyAxOyBrIDwgbkNvbm5lY3Rpb25zOyBrKyspIHtcclxuICAgICAgICAgIGNvbnN0IGwzID0gdGhpcy5zZWdtZW50c1trXTtcclxuICAgICAgICAgIGNvbnN0IHRyaWFuZ2xlID0gY3JlYXRlVHJpYW5nbGVGcm9tTGluZXMobDEsIGwyLCBsMyk7XHJcbiAgICAgICAgICBpZiAodHJpYW5nbGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKHRyaWFuZ2xlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IHZhciBFUFNJTE9OOiBudW1iZXIgPSAwLjE7XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIHBvaW50IGluIDJEIGNvb3JkaW5hdGUgc3lzdGVtLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBvaW50IHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgeDogbnVtYmVyLCBwdWJsaWMgeTogbnVtYmVyKSB7fVxyXG5cclxuICAvKipcclxuICAqIENyZWF0ZXMgYSBuZXcgYFBvaW50YCBvYmplY3Qgd2l0aCB0aGUgc2FtZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGFzIHRoaXMgb25lLlxyXG4gICogQHJldHVybnMgQSBuZXcgYFBvaW50YCBvYmplY3Qgd2l0aCB0aGUgc2FtZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGFzIHRoaXMgb25lLlxyXG4gICovXHJcbiAgcHVibGljIGNsb25lKCk6IFBvaW50IHtcclxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgYSBsaW5lIGJ5IHR3byBwb2ludHMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTGluZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHN0YXJ0OiBQb2ludCwgcHVibGljIGVuZDogUG9pbnQpIHt9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXByZXNlbnRzIGEgdHJpYW5nbGUgYnkgdGhyZWUgcG9pbnRzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlIHtcclxuICBwdWJsaWMgcG9pbnRzOiBQb2ludFtdO1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwMTogUG9pbnQsIHB1YmxpYyBwMjogUG9pbnQsIHB1YmxpYyBwMzogUG9pbnQpIHtcclxuICAgIHRoaXMucG9pbnRzID0gW3AxLCBwMiwgcDNdO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAgRGV0ZXJtaW5lcyB3aGV0aGVyIHR3byBwb2ludHMgYXJlIGVxdWFsIHdpdGhpbiBhIGdpdmVuIHRvbGVyYW5jZS5cclxuICBAcGFyYW0gcG9pbnRBIFRoZSBmaXJzdCBwb2ludCB0byBjb21wYXJlLlxyXG4gIEBwYXJhbSBwb2ludEIgVGhlIHNlY29uZCBwb2ludCB0byBjb21wYXJlLlxyXG4gIEBwYXJhbSB0b2xlcmFuY2UgVGhlIG1heGltdW0gYWxsb3dhYmxlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHR3byBwb2ludHMuXHJcbiAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgdHdvIHBvaW50cyBhcmUgZXF1YWwgd2l0aGluIHRoZSBnaXZlbiB0b2xlcmFuY2UsIGZhbHNlIG90aGVyd2lzZS5cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZVBvaW50c0VxdWFsKFxyXG4gIHBvaW50QTogUG9pbnQsXHJcbiAgcG9pbnRCOiBQb2ludCxcclxuICB0b2xlcmFuY2U6IG51bWJlciA9IDFcclxuKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIE1hdGguYWJzKHBvaW50QS54IC0gcG9pbnRCLngpIDw9IHRvbGVyYW5jZSAmJiBNYXRoLmFicyhwb2ludEEueSAtIHBvaW50Qi55KSA8PSB0b2xlcmFuY2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gIERldGVybWluZXMgd2hldGhlciB0d28gbGluZXMgYXJlIGVxdWFsIHdpdGhpbiBhIGdpdmVuIHRvbGVyYW5jZS5cclxuICBAcGFyYW0gbGluZUEgVGhlIGZpcnN0IGxpbmUgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gbGluZUIgVGhlIHNlY29uZCBraW5lIHRvIGNvbXBhcmUuXHJcbiAgQHBhcmFtIHRvbGVyYW5jZSBUaGUgbWF4aW11bSBhbGxvd2FibGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgZW5kcG9pbnRzIG9mIHRoZSB0d28gbGluZXMuXHJcbiAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgdHdvIGxpbmVzIGFyZSBlcXVhbCB3aXRoaW4gdGhlIGdpdmVuIHRvbGVyYW5jZSwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4qL1xyXG5leHBvcnQgZnVuY3Rpb24gYXJlTGluZXNFcXVhbChcclxuICBsaW5lQTogTGluZSxcclxuICBsaW5lQjogTGluZSxcclxuICB0b2xlcmFuY2U6IG51bWJlciA9IDFcclxuKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIChhcmVQb2ludHNFcXVhbChsaW5lQS5zdGFydCwgbGluZUIuc3RhcnQsIHRvbGVyYW5jZSkgJiZcclxuICAgICAgYXJlUG9pbnRzRXF1YWwobGluZUEuZW5kLCBsaW5lQi5lbmQsIHRvbGVyYW5jZSkpIHx8XHJcbiAgICAoYXJlUG9pbnRzRXF1YWwobGluZUEuZW5kLCBsaW5lQi5zdGFydCwgdG9sZXJhbmNlKSAmJlxyXG4gICAgICBhcmVQb2ludHNFcXVhbChsaW5lQS5zdGFydCwgbGluZUIuZW5kLCB0b2xlcmFuY2UpKVxyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gIERldGVybWluZXMgd2hldGhlciB0d28gdHJpYW5nbGVzIGFyZSBlcXVhbCB3aXRoaW4gYSBnaXZlbiB0b2xlcmFuY2UuXHJcbiAgQHBhcmFtIHRyaWFuZ2xlQSBUaGUgZmlyc3QgdHJpYW5nbGUgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gdHJpYW5nbGVCIFRoZSBzZWNvbmQgdHJpYW5nbGUgdG8gY29tcGFyZS5cclxuICBAcGFyYW0gdG9sZXJhbmNlIFRoZSBtYXhpbXVtIGFsbG93YWJsZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSB2ZXJ0aWNlcyBvZiB0aGUgdHdvIHRyaWFuZ2xlcy5cclxuICBAcmV0dXJucyBUcnVlIGlmIHRoZSB0d28gdHJpYW5nbGVzIGFyZSBlcXVhbCB3aXRoaW4gdGhlIGdpdmVuIHRvbGVyYW5jZSwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4qL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmlhbmdsZXNFcXVhbChcclxuICB0cmlhbmdsZUE6IFRyaWFuZ2xlLFxyXG4gIHRyaWFuZ2xlQjogVHJpYW5nbGUsXHJcbiAgdG9sZXJhbmNlOiBudW1iZXIgPSAxXHJcbik6IGJvb2xlYW4ge1xyXG4gIHJldHVybiB0cmlhbmdsZUEucG9pbnRzLmV2ZXJ5KChwb2ludEEpID0+XHJcbiAgICB0cmlhbmdsZUIucG9pbnRzLmZpbmQoKHBvaW50QikgPT4gYXJlUG9pbnRzRXF1YWwocG9pbnRBLCBwb2ludEIsIHRvbGVyYW5jZSkpXHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUsIGFyZVBvaW50c0VxdWFsLCBFUFNJTE9OIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSB0cmlhbmdsZSBmcm9tIHRocmVlIGxpbmVzLlxyXG4gKiBAcGFyYW0gbGluZTEgLSBUaGUgZmlyc3QgbGluZSBvZiB0aGUgdHJpYW5nbGUuXHJcbiAqIEBwYXJhbSBsaW5lMiAtIFRoZSBzZWNvbmQgbGluZSBvZiB0aGUgdHJpYW5nbGUuXHJcbiAqIEBwYXJhbSBsaW5lMyAtIFRoZSB0aGlyZCBsaW5lIG9mIHRoZSB0cmlhbmdsZS5cclxuICogQHJldHVybnMgVGhlIHRyaWFuZ2xlIGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gbGluZXMsIG9yIG51bGwgaWYgdGhlIGxpbmVzIGNhbm5vdCBmb3JtIGEgdmFsaWQgdHJpYW5nbGUuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJpYW5nbGVGcm9tTGluZXMoXHJcbiAgbGluZTE6IExpbmUsXHJcbiAgbGluZTI6IExpbmUsXHJcbiAgbGluZTM6IExpbmVcclxuKTogVHJpYW5nbGUgfCBudWxsIHtcclxuICBsZXQgaHBvaW50cyA9IFtcclxuICAgIGxpbmUxLnN0YXJ0LFxyXG4gICAgbGluZTEuZW5kLFxyXG4gICAgbGluZTIuc3RhcnQsXHJcbiAgICBsaW5lMi5lbmQsXHJcbiAgICBsaW5lMy5zdGFydCxcclxuICAgIGxpbmUzLmVuZCxcclxuICBdO1xyXG4gIGhwb2ludHMgPSBocG9pbnRzLmZpbHRlcihcclxuICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgocCkgPT4gYXJlUG9pbnRzRXF1YWwocCwgdmFsdWUpKVxyXG4gICk7XHJcbiAgLy8gVGhlIHRyaWFuZ2xlIG11c3QgY29uc2lzdCBzdHJpY3RseSBvZiB0aHJlZSB1bmlxdWUgcG9pbnRzXHJcbiAgaWYgKGhwb2ludHMubGVuZ3RoICE9IDMpIHJldHVybiBudWxsO1xyXG5cclxuICAvLyBDaGVja2luZyBmb3IgdGhlIHBvc3NpYmlsaXR5IG9mIHRoZSBleGlzdGVuY2Ugb2YgYSB0cmlhbmdsZVxyXG4gIHZhciBhID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUxLnN0YXJ0LCBsaW5lMS5lbmQpO1xyXG4gIHZhciBiID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUyLnN0YXJ0LCBsaW5lMi5lbmQpO1xyXG4gIHZhciBjID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUzLnN0YXJ0LCBsaW5lMy5lbmQpO1xyXG4gIGlmIChhID4gYiArIGMgfHwgYiA+IGEgKyBjIHx8IGMgPiBhICsgYikgcmV0dXJuIG51bGw7XHJcbiAgY29uc3QgcCA9IChhICsgYiArIGMpIC8gMjtcclxuICBsZXQgUyA9IE1hdGguc3FydChwICogKHAgLSBhKSAqIChwIC0gYikgKiAocCAtIGMpKTtcclxuICBpZiAoaXNOYU4oUykgfHwgUyA8PSAxKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgcmV0dXJuIG5ldyBUcmlhbmdsZShocG9pbnRzWzBdLCBocG9pbnRzWzFdLCBocG9pbnRzWzJdKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoUG9pbnQoXHJcbiAgcG9pbnQ6IFBvaW50LFxyXG4gIHBvaW50czogUG9pbnRbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IHRvUG9pbnQgb2YgcG9pbnRzKSB7XHJcbiAgICBsZXQgZGlzdGFjZSA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgdG9Qb2ludCk7XHJcbiAgICBpZiAoZGlzdGFjZSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluRGlzdCA9IGRpc3RhY2U7XHJcbiAgICAgIG1pblBvaW50ID0gdG9Qb2ludDtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lUG9pbnRzKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IGRpc3RTdGFydCA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgbGluZS5zdGFydCk7XHJcbiAgICBsZXQgZGlzdEVuZCA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgbGluZS5lbmQpO1xyXG5cclxuICAgIGlmIChNYXRoLm1pbihkaXN0U3RhcnQsIGRpc3RFbmQpIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5Qb2ludCA9IGRpc3RTdGFydCA8IGRpc3RFbmQgPyBsaW5lLnN0YXJ0IDogbGluZS5lbmQ7XHJcbiAgICAgIG1pbkRpc3QgPSBNYXRoLm1pbihkaXN0U3RhcnQsIGRpc3RFbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aExpbmUoXHJcbiAgcG9pbnQ6IFBvaW50LFxyXG4gIGxpbmVzOiBMaW5lW10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICBsZXQgcGQgPSBkaXN0YW5jZUZyb21Qb2ludFRvTGluZShwb2ludCwgbGluZSk7XHJcbiAgICBpZiAocGQuZGlzdGFuY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBwZC5kaXN0YW5jZTtcclxuICAgICAgbWluUG9pbnQgPSBwZC5uZWFyZXN0UG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cy5cclxuICogQHBhcmFtIHBvaW50QSAtIFRoZSBmaXJzdCBwb2ludFxyXG4gKiBAcGFyYW0gcG9pbnRCIC0gVGhlIHNlY29uZCBwb2ludFxyXG4gKiBAcmV0dXJucyBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHdvIHBvaW50c1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludEE6IFBvaW50LCBwb2ludEI6IFBvaW50KTogbnVtYmVyIHtcclxuICByZXR1cm4gTWF0aC5zcXJ0KChwb2ludEEueCAtIHBvaW50Qi54KSAqKiAyICsgKHBvaW50QS55IC0gcG9pbnRCLnkpICoqIDIpO1xyXG59XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlcyB0aGUgZGlzdGFuY2UgYmV0d2VlbiBhIHBvaW50IGFuZCBhIGxpbmUsIGFuZCBmaW5kcyB0aGUgbmVhcmVzdCBwb2ludCBvbiB0aGUgbGluZSB0byB0aGUgZ2l2ZW4gcG9pbnQuXHJcbiAqIEBwYXJhbSBwb2ludCAtIFRoZSBwb2ludCB0byBmaW5kIHRoZSBkaXN0YW5jZSB0byB0aGUgbGluZSBmcm9tLlxyXG4gKiBAcGFyYW0gbGluZSAtIFRoZSBsaW5lIHRvIGZpbmQgdGhlIGRpc3RhbmNlIHRvIHRoZSBwb2ludCBmcm9tLlxyXG4gKiBAcmV0dXJucyBUaGUgbmVhcmVzdCBwb2ludCBvbiB0aGUgbGluZSB0byB0aGUgZ2l2ZW4gcG9pbnQgYW5kIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBnaXZlbiBwb2ludCBhbmQgdGhlIGxpbmUuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUoXHJcbiAgcG9pbnQ6IFBvaW50LFxyXG4gIGxpbmU6IExpbmVcclxuKTogeyBuZWFyZXN0UG9pbnQ6IFBvaW50OyBkaXN0YW5jZTogbnVtYmVyIH0ge1xyXG4gIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gbGluZTtcclxuICBjb25zdCBkeCA9IGVuZC54IC0gc3RhcnQueDtcclxuICBjb25zdCBkeSA9IGVuZC55IC0gc3RhcnQueTtcclxuXHJcbiAgLy8gSWYgdGhlIGxpbmUgaXMganVzdCBhIHBvaW50LCByZXR1cm4gZGlzdGFuY2UgdG8gdGhhdCBwb2ludFxyXG4gIGlmIChkeCA9PT0gMCAmJiBkeSA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZGlzdGFuY2U6IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgc3RhcnQpLFxyXG4gICAgICBuZWFyZXN0UG9pbnQ6IHN0YXJ0LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIENhbGN1bGF0ZSB0aGUgcGFyYW1ldGVyIG9mIHRoZSBwcm9qZWN0aW9uIG9mIHRoZSBwb2ludCBvbnRvIHRoZSBsaW5lXHJcbiAgY29uc3QgdCA9XHJcbiAgICAoKHBvaW50LnggLSBzdGFydC54KSAqIGR4ICsgKHBvaW50LnkgLSBzdGFydC55KSAqIGR5KSAvIChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblxyXG4gIC8vIElmIHQgaXMgb3V0c2lkZSB0aGUgcmFuZ2UgWzAsIDFdLCB0aGVuIHRoZSBuZWFyZXN0IHBvaW50IGlzIG9uZSBvZiB0aGUgbGluZSBlbmRwb2ludHNcclxuICBpZiAodCA8IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRpc3RhbmNlOiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHN0YXJ0KSxcclxuICAgICAgbmVhcmVzdFBvaW50OiBzdGFydCxcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh0ID4gMSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZGlzdGFuY2U6IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgZW5kKSxcclxuICAgICAgbmVhcmVzdFBvaW50OiBlbmQsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIHRoZSBuZWFyZXN0IHBvaW50IG9uIHRoZSBsaW5lIGFuZCByZXR1cm4gaXRzIGRpc3RhbmNlIHRvIHRoZSBwb2ludFxyXG4gIGNvbnN0IG5lYXJlc3RQb2ludCA9IG5ldyBQb2ludChzdGFydC54ICsgdCAqIGR4LCBzdGFydC55ICsgdCAqIGR5KTtcclxuICBjb25zdCBkaXN0YW5jZSA9IGRpc3RhbmNlQmV0d2VlblBvaW50cyhwb2ludCwgbmVhcmVzdFBvaW50KTtcclxuICByZXR1cm4geyBkaXN0YW5jZSwgbmVhcmVzdFBvaW50IH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAgUmV0dXJucyBhIGxpbmUgd2hpY2ggY29udGFpbnMgdGhlIGNvbW1vbiBwYXJ0cyBvZiB0d28gbGluZXMgaWYgdGhleSBhcmUgcGFydHMgb2Ygb25lIGxpbmUuXHJcbiAqICBAcGFyYW0gbGluZTEgVGhlIGZpcnN0IGxpbmUuXHJcbiAqICBAcGFyYW0gbGluZTIgVGhlIHNlY29uZCBsaW5lLlxyXG4gKiAgQHJldHVybnMgQSBuZXcgTGluZSBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBjb21tb24gcGFydHMgb2YgdGhlIHR3byBpbnB1dCBsaW5lcywgb3IgbnVsbCBpZiB0aGV5IGFyZSBub3QgcGFydHMgb2Ygb25lIGxpbmUuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZmluZENvbW1vbkxpbmUobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogTGluZSB8IG51bGwge1xyXG4gIGlmICghYXJlTGluZXNQYXJhbGxlbChsaW5lMSwgbGluZTIpKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLnN0YXJ0LCBsaW5lMi5zdGFydCkpXHJcbiAgICByZXR1cm4gbmV3IExpbmUobGluZTEuZW5kLCBsaW5lMi5lbmQpO1xyXG5cclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuZW5kLCBsaW5lMi5lbmQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLnN0YXJ0LCBsaW5lMi5zdGFydCk7XHJcblxyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5zdGFydCwgbGluZTIuZW5kKSlcclxuICAgIHJldHVybiBuZXcgTGluZShsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0KTtcclxuXHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLmVuZCwgbGluZTIuc3RhcnQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLnN0YXJ0LCBsaW5lMi5lbmQpO1xyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRDb21tb25Qb2ludChsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBQb2ludCB8IG51bGwge1xyXG4gIGlmIChhcmVQb2ludHNFcXVhbChsaW5lMS5zdGFydCwgbGluZTIuc3RhcnQpKSByZXR1cm4gbGluZTEuc3RhcnQ7XHJcbiAgaWYgKGFyZVBvaW50c0VxdWFsKGxpbmUxLmVuZCwgbGluZTIuZW5kKSkgcmV0dXJuIGxpbmUxLmVuZDtcclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuc3RhcnQsIGxpbmUyLmVuZCkpIHJldHVybiBsaW5lMS5zdGFydDtcclxuICBpZiAoYXJlUG9pbnRzRXF1YWwobGluZTEuZW5kLCBsaW5lMi5zdGFydCkpIHJldHVybiBsaW5lMS5lbmQ7XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHR3byBsaW5lcyBhcmUgcGFyYWxsZWwuXHJcbiAqXHJcbiAqIEBwYXJhbSBsaW5lMSBUaGUgZmlyc3QgbGluZS5cclxuICogQHBhcmFtIGxpbmUyIFRoZSBzZWNvbmQgbGluZS5cclxuICpcclxuICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgbGluZXMgYXJlIHBhcmFsbGVsLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYXJlTGluZXNQYXJhbGxlbChsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBib29sZWFuIHtcclxuICBpZiAoXHJcbiAgICBNYXRoLmFicyhsaW5lMS5zdGFydC55IC0gbGluZTEuZW5kLnkpIDw9IE51bWJlci5FUFNJTE9OICYmXHJcbiAgICBNYXRoLmFicyhsaW5lMi5zdGFydC55IC0gbGluZTIuZW5kLnkpIDw9IE51bWJlci5FUFNJTE9OXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGlmIChcclxuICAgIE1hdGguYWJzKGxpbmUxLnN0YXJ0LnggLSBsaW5lMS5lbmQueCkgPD0gTnVtYmVyLkVQU0lMT04gJiZcclxuICAgIE1hdGguYWJzKGxpbmUyLnN0YXJ0LnggLSBsaW5lMi5lbmQueCkgPD0gTnVtYmVyLkVQU0lMT05cclxuICApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgbGV0IGsxID0gTWF0aC5hdGFuKFxyXG4gICAgKGxpbmUxLmVuZC55IC0gbGluZTEuc3RhcnQueSkgLyAobGluZTEuZW5kLnggLSBsaW5lMS5zdGFydC54KVxyXG4gICk7XHJcbiAgbGV0IGsyID0gTWF0aC5hdGFuKFxyXG4gICAgKGxpbmUyLmVuZC55IC0gbGluZTIuc3RhcnQueSkgLyAobGluZTIuZW5kLnggLSBsaW5lMi5zdGFydC54KVxyXG4gICk7XHJcbiAgcmV0dXJuIE1hdGguYWJzKGsxIC0gazIpIDw9IE51bWJlci5FUFNJTE9OO1xyXG59XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgcG9pbnQgaXMgbG9jYXRlZCBvbiBhIGdpdmVuIGxpbmUgc2VnbWVudC5cclxuICogQHBhcmFtIGxpbmUgLSBUaGUgbGluZSBzZWdtZW50IHRvIHRlc3QuXHJcbiAqIEBwYXJhbSBwb2ludCAtIFRoZSBwb2ludCB0byBjaGVjay5cclxuICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgcG9pbnQgaXMgb24gdGhlIGxpbmUgc2VnbWVudCwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRPbkxpbmUobGluZTogTGluZSwgcG9pbnQ6IFBvaW50KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIE1hdGguYWJzKFxyXG4gICAgICBkaXN0YW5jZUJldHdlZW5Qb2ludHMobGluZS5zdGFydCwgcG9pbnQpICtcclxuICAgICAgICBkaXN0YW5jZUJldHdlZW5Qb2ludHMobGluZS5lbmQsIHBvaW50KSAtXHJcbiAgICAgICAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUuZW5kLCBsaW5lLnN0YXJ0KVxyXG4gICAgKSA8PSBFUFNJTE9OXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHBvaW50IG9mIGludGVyc2VjdGlvbiBvciBjb25uZWN0aW9uIGJldHdlZW4gdHdvIGxpbmUgc2VnbWVudHMuXHJcbiAqIEBwYXJhbSBsaW5lMSAtIFRoZSBmaXJzdCBsaW5lIHNlZ21lbnQuXHJcbiAqIEBwYXJhbSBsaW5lMiAtIFRoZSBzZWNvbmQgbGluZSBzZWdtZW50LlxyXG4gKiBAcmV0dXJucyBUaGUgcG9pbnQgb2YgaW50ZXJzZWN0aW9uIG9yIGNvbm5lY3Rpb24gYmV0d2VlbiB0aGUgdHdvIGxpbmUgc2VnbWVudHMsIG9yIG51bGwuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZmluZEludGVyc2VjdGlvblBvaW50KGxpbmUxOiBMaW5lLCBsaW5lMjogTGluZSk6IFBvaW50IHwgbnVsbCB7XHJcbiAgLy8gQ2hlY2sgaWYgdGhlIHR3byBsaW5lIHNlZ21lbnRzIGFyZSBwYXJhbGxlbFxyXG4gIGlmIChhcmVMaW5lc1BhcmFsbGVsKGxpbmUxLCBsaW5lMikpIHtcclxuICAgIC8vIElmIHRoZXkgYXJlIHBhcmFsbGVsLCBjaGVjayBpZiB0aGV5IGxpZSBvbiB0aGUgc2FtZSBsaW5lXHJcbiAgICByZXR1cm4gZmluZENvbW1vblBvaW50KGxpbmUxLCBsaW5lMik7XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIHNsb3BlcyBvZiB0aGUgbGluZXNcclxuICBjb25zdCBzbG9wZTEgPSAobGluZTEuZW5kLnkgLSBsaW5lMS5zdGFydC55KSAvIChsaW5lMS5lbmQueCAtIGxpbmUxLnN0YXJ0LngpO1xyXG4gIGNvbnN0IHNsb3BlMiA9IChsaW5lMi5lbmQueSAtIGxpbmUyLnN0YXJ0LnkpIC8gKGxpbmUyLmVuZC54IC0gbGluZTIuc3RhcnQueCk7XHJcblxyXG4gIC8vIENhbGN1bGF0ZSB0aGUgeS1pbnRlcmNlcHRzIG9mIHRoZSBsaW5lc1xyXG4gIGNvbnN0IHlJbnRlcmNlcHQxID0gbGluZTEuc3RhcnQueSAtIHNsb3BlMSAqIGxpbmUxLnN0YXJ0Lng7XHJcbiAgY29uc3QgeUludGVyY2VwdDIgPSBsaW5lMi5zdGFydC55IC0gc2xvcGUyICogbGluZTIuc3RhcnQueDtcclxuXHJcbiAgLy8gQ2FsY3VsYXRlIHRoZSB4LWNvb3JkaW5hdGUgb2YgdGhlIGludGVyc2VjdGlvbiBwb2ludFxyXG4gIGxldCB4ID0gKHlJbnRlcmNlcHQyIC0geUludGVyY2VwdDEpIC8gKHNsb3BlMSAtIHNsb3BlMik7XHJcbiAgLy8gQ2FsY3VsYXRlIHRoZSB5LWNvb3JkaW5hdGUgb2YgdGhlIGludGVyc2VjdGlvbiBwb2ludFxyXG4gIGxldCB5ID0gc2xvcGUxICogeCArIHlJbnRlcmNlcHQxO1xyXG5cclxuICAvLyBDaGVjayBpZiBlaXRoZXIgc2xvcGUgaXMgdmVydGljYWwgKGkuZS4gaW5maW5pdGUpXHJcbiAgaWYgKCFpc0Zpbml0ZShzbG9wZTEpKSB7XHJcbiAgICB4ID0gbGluZTEuc3RhcnQueDtcclxuICAgIHkgPSBzbG9wZTIgKiBsaW5lMS5zdGFydC54ICsgeUludGVyY2VwdDI7XHJcbiAgfVxyXG4gIGlmICghaXNGaW5pdGUoc2xvcGUyKSkge1xyXG4gICAgeCA9IGxpbmUyLnN0YXJ0Lng7XHJcbiAgICB5ID0gc2xvcGUxICogbGluZTIuc3RhcnQueCArIHlJbnRlcmNlcHQxO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQoeCwgeSk7XHJcbiAgaWYgKCFpc1BvaW50T25MaW5lKGxpbmUxLCBwb2ludCkgfHwgIWlzUG9pbnRPbkxpbmUobGluZTIsIHBvaW50KSkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICAvLyBSZXR1cm4gdGhlIGludGVyc2VjdGlvbiBwb2ludFxyXG4gIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBUcmlhbmdsZXNDYWxjdWxhdG9yIH0gZnJvbSBcIi4uL2NhbGN1bGF0b3JcIjtcclxuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuLi9jb3JlXCI7XHJcblxyXG5cclxuY29uc3QgY2FsY3VsYXRvciA9IG5ldyBUcmlhbmdsZXNDYWxjdWxhdG9yKCk7XHJcblxyXG5zZWxmLm9ubWVzc2FnZSA9IChtZXNzYWdlOiBNZXNzYWdlRXZlbnQ8TGluZVtdPikgPT4ge1xyXG4gIGNhbGN1bGF0b3IuY2FsYyhtZXNzYWdlLmRhdGEpO1xyXG4gIHNlbGYucG9zdE1lc3NhZ2Uoe1xyXG4gICAgcmVzdWx0OiBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGgsXHJcbiAgICBsaW5lczogY2FsY3VsYXRvci5saW5lcyxcclxuICAgIHBvaW50czogY2FsY3VsYXRvci5wb2ludHMsXHJcbiAgICBjb25uZWN0aW9uczogY2FsY3VsYXRvci5zZWdtZW50cyxcclxuICAgIHRyaWFuZ2xlczogY2FsY3VsYXRvci50cmlhbmdsZXNcclxuICB9KTtcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9