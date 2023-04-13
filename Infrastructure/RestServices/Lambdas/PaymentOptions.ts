import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, GrantAccessToSecrets } from '/opt/LambdaHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreatePaymentOptionsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

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

    //Добавление политик
    GrantAccessToSecrets([AddPaymentOptionLambda, DeletePaymentOptionLambda, EditPaymentOptionLambda]);

    GrantAccessToDDB([ListPaymentOptionsLambda, AddPaymentOptionLambda, DeletePaymentOptionLambda, EditPaymentOptionLambda, GetPaymentOptionLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListPaymentOptionsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetPaymentOptionLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddPaymentOptionLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditPaymentOptionLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeletePaymentOptionLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
