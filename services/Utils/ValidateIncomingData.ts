import { APIGatewayEvent } from 'aws-lambda';
import ReturnRestApiResult from './ReturnRestApiResult';

// export function ValidateIncomingEventBody(event: APIGatewayEvent, params: string[]) {
//     let bodyObject: any;

//     if (!event.body) {
//         return false;
//     }
//     try {
//         bodyObject = JSON.parse(event.body);
//     } catch (error) {
//         return false;
//     }
//     for (const param of params) {
//         if (!bodyObject.hasOwnProperty(param)) {
//             return false;
//         }
//     }

//     return bodyObject;
// }

export type DataType =
    | 'string'
    | 'boolean'
    | 'number(any)'
    | 'number(positive)'
    | 'number(nonZeroPositive)'
    | 'number(integer)'
    | 'number(positiveInteger)'
    | 'number(nonZeroPositiveInteger)'
    | 'date'
    | 'array'
    | string[];

function validateDataType(value: any, datatype: DataType) {
    switch (datatype) {
        case 'string': {
            return Object.prototype.toString.call(value) === '[object String]';
        }
        case 'boolean': {
            return typeof value == 'boolean';
        }
        case 'number(any)': {
            return Object.prototype.toString.call(value) === '[object Number]';
        }
        case 'number(positive)': {
            if (!(Object.prototype.toString.call(value) === '[object Number]')) {
                return false;
            }
            if (value >= 0) {
                return false;
            }
            return true;
        }
        case 'number(nonZeroPositive)': {
            if (!(Object.prototype.toString.call(value) === '[object Number]')) {
                return false;
            }
            if (value > 0) {
                return false;
            }
            return true;
        }
        case 'number(integer)': {
            if (!(Object.prototype.toString.call(value) === '[object Number]')) {
                return false;
            }
            return Number.isInteger(value);
        }
        case 'number(positiveInteger)': {
            if (!(Object.prototype.toString.call(value) === '[object Number]')) {
                return false;
            }
            if (!Number.isInteger(value)) {
                return false;
            }
            return value >= 0;
        }
        case 'number(nonZeroPositiveInteger)': {
            if (!(Object.prototype.toString.call(value) === '[object Number]')) {
                return false;
            }
            if (!Number.isInteger(value)) {
                return false;
            }
            return value > 0;
        }
        case 'date': {
            if (!(Object.prototype.toString.call(value) === '[object Date]')) {
                return false;
            }

            return true;
        }
        case 'array': {
            if (!(Object.prototype.toString.call(value) === '[object Array]')) {
                return false;
            }

            return true;
        }
    }
    if (Object.prototype.toString.call(datatype) === '[object Array]') {
        if ((datatype as string[]).includes(value)) {
            return true;
        }
    }
    return false;
}
export function ValidateIncomingEventBody(event: APIGatewayEvent, params: { key: string; datatype: DataType }[]) {
    let bodyObject: any;

    if (!event.body) {
        console.log('body validation error(body not present)');
        return false;
    }
    try {
        bodyObject = JSON.parse(event.body);
    } catch (error) {
        console.log('body validation error(not json)\n' + event.body);
        return false;
    }
    for (const param of params) {
        if (!bodyObject.hasOwnProperty(param.key)) {
            console.log('body validation error(missing key)\nparam: ' + param.key);
            return false;
        } else {
            if (validateDataType(bodyObject[param.key], param.datatype) === false) {
                console.log('body validation error\nparam: ' + param.key + ' datatype: ' + param.datatype + ' value: ' + bodyObject[param.key]);
                return false;
            }
        }
    }

    return bodyObject;
}

export function ValidateIncomingArray(obj: any, params: { key: string; datatype: DataType }[]) {
    if (!(Object.prototype.toString.call(obj) === '[object Array]')) {
        console.log('array validation error(object is not array)\nparam: ' + obj);
        return false;
    }

    for (const item of obj as any[]) {
        for (const param of params) {
            if (!item.hasOwnProperty(param.key)) {
                console.log('array validation error(missing key)\nparam: ' + param.key);
                return false;
            } else {
                if (validateDataType(obj[param.key], param.datatype) === false) {
                    console.log('array validation error\nparam: ' + param.key + ' datatype: ' + param.datatype + ' value: ' + obj[param.key]);
                    return false;
                }
            }
        }
    }

    return true;
}
