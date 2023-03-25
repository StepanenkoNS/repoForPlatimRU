type density = {
    t: number;
    s: number;
};

function solution(a: string, b: string) {
    const densities = new Map<string, density>();

    const aArr = a.split('');
    for (const item of aArr) {
        const d = densities.get(item);
        if (d) {
            densities.set(item, { t: d.t + 1, s: 0 });
        } else {
            densities.set(item, { t: 1, s: 0 });
        }
    }

    const bArr = b.split('');
    for (const item of bArr) {
        const d = densities.get(item);
        if (d) {
            densities.set(item, { t: d.t, s: d.s + 1 });
        }
    }
    console.log(densities);
    let min = Number.MAX_VALUE;
    for (const element of densities) {
        const tmpMin = element[1].s / element[1].t;
        console.log(element[0], tmpMin);

        if (tmpMin < 1) return 0;

        if (tmpMin < min) {
            min = element[1].s / element[1].t - (element[1].s % element[1].t);
        }
    }
    return min;
}

const result = solution('abc', 'abbdcdedf');
console.log(result);
