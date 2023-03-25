const p = [
    [1, 1],
    [1, 3],
    [-2, 2]
];

type distancePointer = {
    distance: number;
    pointer: number;
};
function kClosest(points: number[][], k: number): number[][] {
    const distance: distancePointer[] = [];
    for (let i = 0; i < points.length; i++) {
        const x = points[i][0] * points[i][0];
        const y = points[i][1] * points[i][1];
        const d = Math.sqrt(x + y);
        distance.push({
            distance: d,
            pointer: i
        });
        console.log('point', points[i], 'distance: ', d);
    }
    const sortedDistance = distance.sort((a1, a2) => a1.distance - a2.distance);
    console.log(JSON.stringify(sortedDistance));

    const result: number[][] = [];
    for (let i = 0; i < k; i++) {
        result.push(points[sortedDistance[i].pointer]);
    }
    console.log(JSON.stringify(result));
    return result;
}

kClosest(p, 1);
