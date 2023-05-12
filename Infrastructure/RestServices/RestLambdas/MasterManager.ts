import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToRoute53 } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateMasterManagerLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод одного элемента
    const GetMasterManagerMeLambda = new NodejsFunction(that, 'GetMasterManagerMeLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MasterManager', 'GetMasterManagerMeLambda.ts'),
        handler: 'handler',
        functionName: 'react-MasterManager-GetMe-Lambda',
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

    const SubscribeToPaidSubscriptionLambda = new NodejsFunction(that, 'SubscribeToPaidSubscriptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MasterManager', 'SubscribeToPaidSubscriptionLambda.ts'),
        handler: 'handler',
        functionName: 'react-MasterManager-SubscribeToPaidSubscription-Lambda',
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

    const ListMasterManagerSubscriptionsLambda = new NodejsFunction(that, 'ListMasterManagerSubscriptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MasterManager', 'ListMasterManagerSubscriptionsLambda.ts'),
        handler: 'handler',
        functionName: 'react-MasterManager-ListSubscriptions-Lambda',
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

    //Добавление политик

    GrantAccessToDDB([GetMasterManagerMeLambda, SubscribeToPaidSubscriptionLambda, ListMasterManagerSubscriptionsLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: GetMasterManagerMeLambda,
        resource: 'GetMe',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: SubscribeToPaidSubscriptionLambda,
        resource: 'SubscribeToPaidSubscription',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: ListMasterManagerSubscriptionsLambda,
        resource: 'ListMySubscriptions',
        httpMethod: 'GET'
    });
    return returnArray;
}
