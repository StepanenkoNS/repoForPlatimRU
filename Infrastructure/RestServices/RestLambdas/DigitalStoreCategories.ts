import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateDigitalStoreCategories(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const ListDigitalStoreCategoriesLambda = new NodejsFunction(that, 'ListDigitalStoreCategoriesLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'ListDigitalStoreCategoriesLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Вывод одного элемента
    const GetDigitalStoreCategoryLambda = new NodejsFunction(that, 'GetDigitalStoreCategoryLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'GetDigitalStoreCategoryLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Добавление
    const AddDigitalStoreCategoryLambda = new NodejsFunction(that, 'AddDigitalStoreCategoryLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'AddDigitalStoreCategoryLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //редактирование
    const EditDigitalStoreCategoryLambda = new NodejsFunction(that, 'EditDigitalStoreCategoryLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'EditDigitalStoreCategoryLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //удаление
    const DeleteDigitalStoreCategoryLambda = new NodejsFunction(that, 'DeleteDigitalStoreCategoryLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'DeleteDigitalStoreCategoryLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //предоставление доступа

    GrantAccessToDDB([ListDigitalStoreCategoriesLambda, AddDigitalStoreCategoryLambda, EditDigitalStoreCategoryLambda, DeleteDigitalStoreCategoryLambda, GetDigitalStoreCategoryLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListDigitalStoreCategoriesLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetDigitalStoreCategoryLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddDigitalStoreCategoryLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditDigitalStoreCategoryLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteDigitalStoreCategoryLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
