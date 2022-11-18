import { botFatherHandler } from '../../../services/BotFatherBot/BotFather-Lambda';



const event = 
{
    "resource": "/MessageBotIntegration/v1/{proxy+}",
    "path": "/MessageBotIntegration/v1/5647754848",
    "httpMethod": "POST",
    "headers": {
        "Accept-Encoding": "gzip, deflate",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-ASN": "62041",
        "CloudFront-Viewer-Country": "NL",
        "Content-Type": "application/json",
        "Host": "616wfrep4m.execute-api.us-east-1.amazonaws.com",
        "User-Agent": "Amazon CloudFront",
        "Via": "1.1 de7a608ee8aa91b02488536faf8169a0.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "_HIf7bZRtoTfmJPLSYVKFR1NFD6syakjycQDOH2UT66izRNl8oNlnQ==",
        "X-Amzn-Trace-Id": "Root=1-633d5f39-3f9793b52ddad18a7487e4b7",
        "X-Forwarded-For": "91.108.6.142, 15.158.40.7",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "multiValueHeaders": {
        "Accept-Encoding": [
            "gzip, deflate"
        ],
        "CloudFront-Forwarded-Proto": [
            "https"
        ],
        "CloudFront-Is-Desktop-Viewer": [
            "true"
        ],
        "CloudFront-Is-Mobile-Viewer": [
            "false"
        ],
        "CloudFront-Is-SmartTV-Viewer": [
            "false"
        ],
        "CloudFront-Is-Tablet-Viewer": [
            "false"
        ],
        "CloudFront-Viewer-ASN": [
            "62041"
        ],
        "CloudFront-Viewer-Country": [
            "NL"
        ],
        "Content-Type": [
            "application/json"
        ],
        "Host": [
            "616wfrep4m.execute-api.us-east-1.amazonaws.com"
        ],
        "User-Agent": [
            "Amazon CloudFront"
        ],
        "Via": [
            "1.1 de7a608ee8aa91b02488536faf8169a0.cloudfront.net (CloudFront)"
        ],
        "X-Amz-Cf-Id": [
            "_HIf7bZRtoTfmJPLSYVKFR1NFD6syakjycQDOH2UT66izRNl8oNlnQ=="
        ],
        "X-Amzn-Trace-Id": [
            "Root=1-633d5f39-3f9793b52ddad18a7487e4b7"
        ],
        "X-Forwarded-For": [
            "91.108.6.142, 15.158.40.7"
        ],
        "X-Forwarded-Port": [
            "443"
        ],
        "X-Forwarded-Proto": [
            "https"
        ]
    },
    "queryStringParameters": null,
    "multiValueQueryStringParameters": null,
    "pathParameters": {
        "proxy": "5647754848"
    },
    "stageVariables": null,
    "requestContext": {
        "resourceId": "6s10rh",
        "resourcePath": "/MessageBotIntegration/v1/{proxy+}",
        "httpMethod": "POST",
        "extendedRequestId": "ZhvRAEK8IAMFYmA=",
        "requestTime": "05/Oct/2022:10:40:57 +0000",
        "path": "/test/MessageBotIntegration/v1/5647754848",
        "accountId": "993738567487",
        "protocol": "HTTP/1.1",
        "stage": "test",
        "domainPrefix": "616wfrep4m",
        "requestTimeEpoch": 1664966457465,
        "requestId": "9bf04521-90c6-4e6f-8116-d7be49fb465f",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "sourceIp": "91.108.6.142",
            "principalOrgId": null,
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "Amazon CloudFront",
            "user": null
        },
        "domainName": "616wfrep4m.execute-api.us-east-1.amazonaws.com",
        "apiId": "616wfrep4m"
    },
    // "body": 
    // "{\"update_id\":294728825,\n\"message\":{\"message_id\":681,\"from\":{\"id\":199163834,\"is_bot\":false,\"first_name\":\"Nick\",\"username\":\"LikeAHurricane\",\"language_code\":\"en\"},\"chat\":{\"id\":199163834,\"first_name\":\"Nick\",\"username\":\"LikeAHurricane\",\"type\":\"private\"},\"date\":1664961213,\"text\":\"hi\"}}",
 
    "body": '{"update_id":294728962,\n' +
    '"message":{"message_id":1660,"from":{"id":199163834,"is_bot":false,"first_name":"Nick","username":"LikeAHurricane","language_code":"en"},"chat":{"id":199163834,"first_name":"Nick","username":"LikeAHurricane","type":"private"},"date":1665482402,"text":"/wizard","entities":[{"offset":0,"length":8,"type":"bot_command"}]}}',
    "isBase64Encoded": false
    
}

type a = "aaa" | "bbb" | "ccc";
async function main() {

    //console.log(JSON.parse(event.toString()));
    // const key = "aaa";
    // if (key in ["aaa","bbb"]){
    //     console.log(key);
    // }

    botFatherHandler(event, {});
    
}

main();