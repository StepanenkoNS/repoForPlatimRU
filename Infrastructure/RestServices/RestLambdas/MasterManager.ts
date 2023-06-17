import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToRoute53, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateMasterManagerLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    //Вывод одного элемента
    // const GetMasterManagerMeLambda = new NodejsFunction(that, 'GetMasterManagerMeLambda', {
    //     entry: join(__dirname, '..', '..', '..', 'services', 'MasterManager', 'GetMasterManagerMeLambda.ts'),
    //     handler: 'handler',
    //     functionName: 'react-MasterManager-GetMe-Lambda',
    //     runtime: StaticEnvironment.LambdaSettings.runtime,
    //     logRetention: StaticEnvironment.LambdaSettings.logRetention,
    //     timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
    //     environment: {
    //         WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
    //         ...StaticEnvironment.LambdaSettings.EnvironmentVariables
    //     },
    //     bundling: {
    //         externalModules: StaticEnvironment.LambdaSettings.externalModules
    //     },
    //     layers: layers
    // });

    const SubscribeToPaidSubscriptionLambda = new NodejsFunction(that, 'SubscribeToPaidSubscriptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MasterManager', 'SubscribeToPaidSubscriptionLambda.ts'),
        handler: 'handler',
        functionName: 'react-MasterManager-SubscribeToPaidSubscription-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    const ListMasterManagerSubscriptionsLambda = new NodejsFunction(that, 'ListMasterManagerSubscriptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MasterManager', 'ListMasterManagerSubscriptionsLambda.ts'),
        handler: 'handler',
        functionName: 'react-MasterManager-ListSubscriptions-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //Добавление политик

    //GrantAccessToDDB([SubscribeToPaidSubscriptionLambda, ListMasterManagerSubscriptionsLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    // returnArray.push({
    //     lambda: GetMasterManagerMeLambda,
    //     resource: 'GetMe',
    //     httpMethod: 'GET'
    // });

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
