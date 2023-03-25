// var points1: number[][] = [
//     [2, 24],
//     [0, 11],
//     [-7, 1],
//     [-5, -3]
// ];

const points1: number[][] = [
    [-1, -1000],
    [1, 1000],
    [-7, 1],
    [-5, -3]
];

function GenerateArray(limit: number = 10000, border: number = 10000000) {
    const points: number[][] = [];
    for (let i = 0; i < 2 * limit; i++) {
        const x = Math.floor(Math.random() * border);
        const y = x - Math.floor(Math.random() * (1 - border));
        points.push([i, y]);
    }
    return points;
}

function distance(p1: number[], p2: number[]) {
    const x = (p1[0] - p2[0]) * (p1[0] - p2[0]);
    const y = (p1[1] - p2[1]) * (p1[1] - p2[1]);
    return Math.sqrt(x + y);
}

function bruteForce(P: number[][], n: number) {
    var min = Number.POSITIVE_INFINITY;
    for (var i = 0; i < n; ++i) {
        for (var j = i + 1; j < n; ++j) {
            if (distance(P[i], P[j]) < min) {
                min = distance(P[i], P[j]);
            }
        }
    }
    return min;
}

// A utility function to find the
// distance between the closest points of
// strip of given size. All points in
// strip[] are sorted according to
// y coordinate. They all have an upper
// bound on minimum distance as d.
// Note that this method seems to be
// a O(n^2) method, but it's a O(n)
// method as the inner loop runs at most 6 times
function stripClosest(strip: number[][], size: number, d: number) {
    var min = d; // Initialize the minimum distance as d
    strip.sort((a, b) => a[1] - b[1]);

    // Pick all points one by one and try the next points till the difference
    // between y coordinates is smaller than d.
    // This is a proven fact that this loop runs at most 6 times
    for (var i = 0; i < size; ++i) {
        for (var j = i + 1; j < size; ++j) {
            if (strip[j][1] - strip[i][1] < min) {
                break;
            }
            if (distance(strip[i], strip[j]) < min) {
                min = distance(strip[i], strip[j]);
            }
        }
    }
    return min;
}

// A recursive function to find the
// smallest distance. The array P contains
// all points sorted according to x coordinate
function closestUtil(P: number[][], n: number) {
    // If there are 2 or 3 points, then use brute force
    if (n < 4) {
        return bruteForce(P, n);
    }

    // Find the middle point
    var mid = Math.floor(n / 2);
    var midPoint = P[mid];

    // Consider the vertical line passing
    // through the middle point calculate
    // the smallest distance dl on left
    // of middle point and dr on right side
    const dl = closestUtil(P, mid);
    const dr = closestUtil(P.slice(mid), n - mid);

    // Find the smaller of two distances
    const d = Math.min(dl, dr);

    // Build an array strip[] that contains
    // points close (closer than d)
    // to the line passing through the middle point
    const strip = [];
    let j = 0;
    for (let i = 0; i < n; i++) {
        if (Math.abs(P[i][0] - midPoint[0]) < d) {
            strip[j] = P[i];
            j++;
        }
    }

    // Find the closest points in strip.
    // Return the minimum of d and closest
    // distance is strip[]
    return Math.min(d, stripClosest(strip, j, d));
}

function solution(P: number[][]) {
    P.sort((a, b) => a[0] - b[0]);

    let startTime = performance.now();
    const res = closestUtil(P, P.length);
    let endTime = performance.now();
    console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
    return res;
}

const points2 = GenerateArray(10000, 10000000);

const res = solution(points1);

console.log('min distance:', res);
