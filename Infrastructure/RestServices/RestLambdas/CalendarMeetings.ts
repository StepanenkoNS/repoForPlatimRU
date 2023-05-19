import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateCalendarMeetingsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    const ListMeetingsLambda = new NodejsFunction(that, 'ListMeetingsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'ListMeetingsLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-List-Lambda',
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
    const GetMeetingLambda = new NodejsFunction(that, 'GetMeetingLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'GetMeetingLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-Get-Lambda',
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
    const AddMeetingLambda = new NodejsFunction(that, 'AddMeetingLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'AddMeetingLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-Add-Lambda',
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
    const EditMeetingLambda = new NodejsFunction(that, 'EditMeetingLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'EditMeetingLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //удаление
    const DeleteMeetingLambda = new NodejsFunction(that, 'DeleteMeetingLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'DeleteMeetingLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-Delete-Lambda',
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

    GrantAccessToDDB([ListMeetingsLambda, AddMeetingLambda, GetMeetingLambda, EditMeetingLambda, DeleteMeetingLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListMeetingsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddMeetingLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });
    returnArray.push({
        lambda: GetMeetingLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: EditMeetingLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteMeetingLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
