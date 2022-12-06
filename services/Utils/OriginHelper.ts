import { APIGatewayEvent } from 'aws-lambda';

export function SetOrigin(event: APIGatewayEvent) {
    let origin = 'https://' + process.env.cookieDomain;
    if (event.headers && event.headers.origin) {
        //todo - удалить перед деплоем
        const array = process.env.allowedOrigins!.split(',');
        if (array.includes(origin)) {
            origin = event.headers.origin;
        }
    }
    return origin;
}
