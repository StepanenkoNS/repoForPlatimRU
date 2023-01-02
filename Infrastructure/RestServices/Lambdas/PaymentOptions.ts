import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, GrantAccessToSecrets } from '../Helper';

export function CreatePaymentOptionsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListPaymentOptionsResource = rootResource.addResource('List');
    const lambdaGetPaymentOptionsResource = rootResource.addResource('Get');
    const lambdaAddPaymentOptionResource = rootResource.addResource('Add');
    const lambdaDeletePaymentOptionsResource = rootResource.addResource('Delete');
    const lambdaEdutPaymentOptionsResource = rootResource.addResource('Edit');

    //вывод список опций оплаты
    const ListPaymentOptionsLambda = new NodejsFunction(that, 'ListPaymentOptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentOptions', 'ListPaymentOptionsLambda.ts'),
        handler: 'ListPaymentOptionsHandler',
        functionName: 'react-PaymentOptions-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationListPaymentOptions = new apigateway.LambdaIntegration(ListPaymentOptionsLambda);
    lambdaListPaymentOptionsResource.addMethod('GET', lambdaIntegrationListPaymentOptions);

    //Вывод одного элемента
    const GetPaymentOptionLambda = new NodejsFunction(that, 'GetPaymentOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentOptions', 'GetPaymentOptionLambda.ts'),
        handler: 'GetPaymentOptionHandler',
        functionName: 'react-PaymentOptions-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationGetPaymentOption = new apigateway.LambdaIntegration(GetPaymentOptionLambda);
    lambdaGetPaymentOptionsResource.addMethod('GET', lambdaIntegrationGetPaymentOption);

    //добавление опции оплаты
    const AddPaymentOptionLambda = new NodejsFunction(that, 'AddPaymentOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentOptions', 'AddPaymentOptionLambda.ts'),
        handler: 'AddPaymentOptionHandler',
        functionName: 'react-PaymentOptions-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationAddPaymentOption = new apigateway.LambdaIntegration(AddPaymentOptionLambda);
    lambdaAddPaymentOptionResource.addMethod('POST', lambdaIntegrationAddPaymentOption);

    //редактирование опции оплаты
    const EditPaymentOptionLambda = new NodejsFunction(that, 'EditPaymentOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentOptions', 'EditPaymentOptionLambda.ts'),
        handler: 'EditPaymentOptionHandler',
        functionName: 'react-PaymentOptions-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationEditPaymentOption = new apigateway.LambdaIntegration(EditPaymentOptionLambda);
    lambdaEdutPaymentOptionsResource.addMethod('PUT', lambdaIntegrationEditPaymentOption);

    //удаление опции оплаты
    const DeletePaymentOptionLambda = new NodejsFunction(that, 'DeletePaymentOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentOptions', 'DeletePaymentOptionLambda.ts'),
        handler: 'DeletePaymentOptionHandler',
        functionName: 'react-PaymentOptions-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationDeletePaymentOption = new apigateway.LambdaIntegration(DeletePaymentOptionLambda);
    lambdaDeletePaymentOptionsResource.addMethod('DELETE', lambdaIntegrationDeletePaymentOption);

    //Добавление политик
    GrantAccessToSecrets([AddPaymentOptionLambda, DeletePaymentOptionLambda, EditPaymentOptionLambda]);

    GrantAccessToDDB([ListPaymentOptionsLambda, AddPaymentOptionLambda, DeletePaymentOptionLambda, EditPaymentOptionLambda, GetPaymentOptionLambda], tables);
}
