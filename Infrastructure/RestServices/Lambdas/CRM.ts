import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/LambdaHelpers/AccessHelper';

export function CreateCRMLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const usersResource = rootResource.addResource('Users');
    const usersResourceList = usersResource.addResource('List');

    //Вывод списка
    const ListMyUsersLambda = new NodejsFunction(that, 'ListMyUsersLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ListMyUsers.ts'),
        handler: 'ListMyUsersHandler',
        functionName: 'react-CRM-Users-List-Lambda',
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
    const lambdaIntegrationListUsers = new apigateway.LambdaIntegration(ListMyUsersLambda);
    usersResourceList.addMethod('GET', lambdaIntegrationListUsers);

    //предоставление доступа

    GrantAccessToDDB([ListMyUsersLambda], tables);
}
