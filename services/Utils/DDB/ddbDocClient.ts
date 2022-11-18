import { DynamoDBDocument, TranslateConfig } from "@aws-sdk/lib-dynamodb";
import {ddbClient} from "./ddbClient";



const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: true, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: true, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};
const translateConfig :TranslateConfig = { marshallOptions, unmarshallOptions };

export const ddbDocClient = DynamoDBDocument.from(ddbClient, translateConfig);


