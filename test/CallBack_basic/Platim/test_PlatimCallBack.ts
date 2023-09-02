import CryptoJS from 'crypto-js';

import { handler } from '../../../services/CallBack_basic/PlatimRU/PlatimRUCallBack';

const event = {
    resource: '/callback/platim_ru',
    path: '/callback/platim_ru',
    httpMethod: 'POST',
    headers: {
        accept: '*/*',
        'accept-encoding': 'gzip',
        baggage: 'sentry-trace_id=3e5bb408e8b946a6a6a3af3ab798d454,sentry-public_key=4665e3d1cc1f485f9c9c61478e5ceb81,sentry-release=platim-private-api%402170,sentry-environment=develop',
        'content-type': 'application/json',
        Host: 'payments.zuzona.com',
        'sentry-trace': '3e5bb408e8b946a6a6a3af3ab798d454-8888c9de43f74c21',
        'User-Agent': 'Symfony HttpClient/Curl',
        'X-Amzn-Trace-Id': 'Root=1-64f17032-173b0d9042547f2a4ef9f951',
        'X-Forwarded-For': '89.22.173.67',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['*/*'],
        'accept-encoding': ['gzip'],
        baggage: ['sentry-trace_id=3e5bb408e8b946a6a6a3af3ab798d454,sentry-public_key=4665e3d1cc1f485f9c9c61478e5ceb81,sentry-release=platim-private-api%402170,sentry-environment=develop'],
        'content-type': ['application/json'],
        Host: ['payments.zuzona.com'],
        'sentry-trace': ['3e5bb408e8b946a6a6a3af3ab798d454-8888c9de43f74c21'],
        'User-Agent': ['Symfony HttpClient/Curl'],
        'X-Amzn-Trace-Id': ['Root=1-64f17032-173b0d9042547f2a4ef9f951'],
        'X-Forwarded-For': ['89.22.173.67'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'pqnksf',
        resourcePath: '/callback/platim_ru',
        httpMethod: 'POST',
        extendedRequestId: 'Kj539GehIAMEjVA=',
        requestTime: '01/Sep/2023:05:01:38 +0000',
        path: '/callback/platim_ru',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1693544498677,
        requestId: 'd7d6f89c-f315-442d-bed0-84a86479efdc',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '89.22.173.67',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Symfony HttpClient/Curl',
            user: null
        },
        domainName: 'payments.zuzona.com',
        apiId: 'oyftl3dkne'
    },
    body: '{"id":2741,"uuid":"W5F4fKrhy45SnzGYmQfXsQ","humanOrderId":"172-000-000-002-741","goods":[{"id":428,"name":"SUBSCRIPTION","description":"SUBSCRIPTION","nameEn":"SUBSCRIPTION","descriptionEn":"","recurrent":false,"currency":"RUB","price":"10000","quantity":1,"totalPrice":"10000","shortUrl":"58nZpi","enableSuccessUrl":false,"successUrl":"https:\\/\\/t.me\\/zuzonabot","externalCrmOfferCode":null,"status":"active","shopItemId":"2UmTiQEiv7bt8YyeMS8AiXwJ10Z","activeChangeRequest":null,"lastChangeRequest":null,"items":[],"currencyAmounts":{"USD":{"currency":"USD","amount":"109"},"EUR":{"currency":"EUR","amount":"101"},"RUB":{"currency":"RUB","amount":"10000"}},"isNds":false,"taxationNds":"no_nds"}],"currency":"RUB","summaryAmount":"10000","commissionAmount":"200","commissionPercent":"2","merchantAmount":"9800","amount":"10000","status":"paid","createdAt":1693544209,"payFormShortUrl":null,"externalOrderId":"2UmTiQEiv7bt8YyeMS8AiXwJ10Z","transactionUuid":"BC1nyEW7rF9SPJr2h2i4mX","transactionId":1385,"loanEnabled":true,"nonRussianCardEnabled":false,"currencyAmounts":{"USD":{"currency":"USD","amount":"109"},"EUR":{"currency":"EUR","amount":"101"},"RUB":{"currency":"RUB","amount":"10000"}},"utm":{"source":null,"medium":null,"campaign":null,"term":null,"content":null},"externalUserId":null,"paymentMethod":"russian_card","payer":{"name":null,"phone":null,"email":"stepanenkons@mail.ru","phoneIso":null},"signature":"bJhkEPE2\\/5X9OsTU4hyCFnVZDk7kCKZ\\/gOQn0TlIXDefpwqhIeWjN0FBXis8LggXj1M8EAM\\/NqpjTIrbuMJgD\\/9oKgt9u81\\/Z2Om5z2RTwE+6eYjMOOpP1am0spmVE8sySdAvEXs1ydQlVGt7qbMQLS8iCb4ey3KQG7UnwuSH3te8KRvKmpJWCjev7146oJLG8kYymdfvZlW0liwk4dp9bhJFnVL\\/ZpB0x265WTu2Qj0egLlOa8EgVRIKhBIzJfj7i\\/bswrywEwNsx439x1jmisuLISGh72eqb0Rc3m6rPyjRsdt\\/rg5S08bcOHcD1vHF5dPh2\\/70PsmycFbUd93xw=="}',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
