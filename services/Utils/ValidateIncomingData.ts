import { APIGatewayEvent } from 'aws-lambda';
import { DateTime } from 'luxon';

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
    | 'object'
    | string[];

export type DataValidationParameter = {
    key: any;
    datatype: DataType;
    objectKeys?: DataValidationParameter[] | undefined;
};

function validateBoolean(value: any) {
    return typeof value == 'boolean' || value.toString().toLowerCase() === 'true' || value.toString().toLowerCase() === 'false';
}

function validateNumber(value: any) {
    if (Object.prototype.toString.call(value) === '[object Number]') return value as number;
    if (Object.prototype.toString.call(value) === '[object String]') {
        if (isNaN(value)) {
            return false;
        } else {
            return Number(value);
        }
    }
    return false;
}

function validateDataValue(value: any, datatype: DataType, objectKeys?: DataValidationParameter[]) {
    // console.log('\nvalue: ' + value + '\nRequestedDataType: ' + datatype + '\nObject Type: ' + Object.prototype.toString.call(value) + '\nTypeOf: ' + typeof value);
    switch (datatype) {
        case 'string': {
            return Object.prototype.toString.call(value) === '[object String]';
        }
        case 'boolean': {
            return validateBoolean(value == 'boolean');
        }
        case 'number(any)': {
            const numberValidationResult = validateNumber(value);
            if (numberValidationResult === false) {
                return false;
            } else {
                return true;
            }
        }
        case 'number(positive)': {
            const numberValidationResult = validateNumber(value);
            if (numberValidationResult === false) {
                return false;
            } else {
                return numberValidationResult >= 0;
            }
        }
        case 'number(nonZeroPositive)': {
            const numberValidationResult = validateNumber(value);
            if (numberValidationResult === false) {
                return false;
            } else {
                return numberValidationResult > 0;
            }
        }
        case 'number(integer)': {
            const numberValidationResult = validateNumber(value);
            if (numberValidationResult === false) {
                return false;
            } else {
                return Number.isInteger(numberValidationResult);
            }
        }
        case 'number(positiveInteger)': {
            const numberValidationResult = validateNumber(value);
            if (numberValidationResult === false) {
                return false;
            } else {
                if (!Number.isInteger(numberValidationResult)) {
                    return false;
                } else {
                    return numberValidationResult >= 0;
                }
            }
        }
        case 'number(nonZeroPositiveInteger)': {
            const numberValidationResult = validateNumber(value);
            if (numberValidationResult === false) {
                return false;
            } else {
                if (!Number.isInteger(numberValidationResult)) {
                    return false;
                } else {
                    return numberValidationResult > 0;
                }
            }
        }
        case 'date': {
            if (!DateTime.fromISO(value).isValid) {
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
        case 'object': {
            if (Object.prototype.toString.call(value) !== '[object Object]') {
                return false;
            }
            if (objectKeys === undefined) {
                return false;
            }
            for (const objectKey of objectKeys) {
                const result = validateDataValue(value[objectKey.key], objectKey.datatype, objectKey.objectKeys);
                if (result === false) {
                    return false;
                }
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
export function ValidateIncomingEventBody(event: APIGatewayEvent, params: DataValidationParameter[]) {
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
            if (validateDataValue(bodyObject[param.key], param.datatype, param.objectKeys) === false) {
                console.log('body validation error\nparam: ' + param.key + ' datatype: ' + param.datatype + ' value: ' + bodyObject[param.key]);
                return false;
            }
        }
    }

    return bodyObject;
}

export function ValidateIncomingArray(obj: any, params: DataValidationParameter[]) {
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
                if (validateDataValue(item[param.key], param.datatype, param.objectKeys) === false) {
                    console.log('array validation error\nparam: ' + param.key + '\ndatatype: ' + param.datatype + '\nvalue: ' + item[param.key]);
                    return false;
                }
            }
        }
    }

    return true;
}

// console.log(
//     validateDataValue({ durationInDays: 5 }, 'object', [
//         {
//             key: 'durationInDays',
//             datatype: 'number(positiveInteger)'
//         }
//     ])
// );
