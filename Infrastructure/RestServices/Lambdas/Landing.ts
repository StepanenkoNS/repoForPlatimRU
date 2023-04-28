import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateBotSetLandingLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const UpdateBotLandingPage = new NodejsFunction(that, 'SetBotLandingPageLamda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'WebBotLandingPages', 'UpdateBotLanding.ts'),
        handler: 'handler',
        functionName: 'react-BotLanding-Update-Lambda',
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

    GrantAccessToDDB([UpdateBotLandingPage], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: UpdateBotLandingPage,
        resource: undefined,
        httpMethod: 'PUT'
    });
    return returnArray;
}
