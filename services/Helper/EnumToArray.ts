import { TextHelper } from '/opt/TextHelpers/textHelper';
const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

// Turn enum into array
export function EnumToArray(enumme: any) {
    const res1 = Object.keys(enumme)
        .filter(StringIsNumber)
        .map((key) => enumme[key]);
    const res2: string[] = [];
    for (const item of res1) {
        res2.push(item.toString());
    }
    return res2;
}
