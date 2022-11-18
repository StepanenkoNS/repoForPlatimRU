import { handler } from '../../services/RegisterBot/addBot';
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';





async function main() {
    const result = await handler(event:any, {})
    console.log(result);
}

main();