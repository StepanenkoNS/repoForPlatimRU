const input = ['{}', '[]', '[]{}', '[(])'];

const brackets: {
    [key: string]: string;
} = {
    ']': '[',
    ')': '(',
    '}': '{'
};

function isClosing(s: string) {
    if (brackets.hasOwnProperty(s)) {
        return brackets[s];
    } else return undefined;
}

function solution(sequence: string) {
    const stack: string[] = [];
    const arr = sequence.split('');
    for (const item of arr) {
        const tmp = isClosing(item);

        if (tmp) {
            const lastStack = stack.pop();
            if (tmp !== lastStack) {
                return false;
            }
        } else {
            stack.push(item);
        }
    }
    if (stack.length == 0) {
        return true;
    } else {
        return false;
    }
}

solution(input[2]);
