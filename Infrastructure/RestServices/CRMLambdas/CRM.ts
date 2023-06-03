import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateCRMLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const crmListMyUsersLambda = new NodejsFunction(that, 'crmListMyUsersLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ListMyUsers.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Users-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const crmBotSubscriptionsLambda = new NodejsFunction(that, 'crmBotSubscriptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'BotSubscriptions.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Bot-Subscriptions-Lambda',
        role: lambdaRole,
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

    const crmBotSubscriptionsByUserLambda = new NodejsFunction(that, 'crmBotSubscriptionsByUserLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'BotSubscriptionsByUser.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Bot-Subscriptions-ByUser-Lambda',
        role: lambdaRole,
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

    const crmChannelSubscriptionsLambda = new NodejsFunction(that, 'crmChannelSubscriptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ChannelSubscriptions.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Channel-Subscriptions-Lambda',
        role: lambdaRole,
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

    const crmChannelSubscriptionsByUserLambda = new NodejsFunction(that, 'crmChannelSubscriptionsByUserLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ChannelSubscriptionsByUser.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Channel-Subscriptions-ByUser-Lambda',
        role: lambdaRole,
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

    const botPaymentsLambda = new NodejsFunction(that, 'botPaymentsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'BotPayments.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Bot-Payments-Lambda',
        role: lambdaRole,
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

    const botPaymentsByUserLambda = new NodejsFunction(that, 'botPaymentsByUserLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'BotPaymentsByUser.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Bot-Payments-ByUser-Lambda',
        role: lambdaRole,
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

    const scheduledPostsByUserLambda = new NodejsFunction(that, 'scheduledPostsByUserLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ScheduledPostsByUser.ts'),
        handler: 'handler',
        functionName: 'react-CRM-ScheduledPosts-ByUser-Lambda',
        role: lambdaRole,
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

    const crmUserProfileLambda = new NodejsFunction(that, 'crmUserProfileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'GetMyUserProfile.ts'),
        handler: 'handler',
        functionName: 'react-CRM-UserProfile-Lambda',
        role: lambdaRole,
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
    const crmBanLambda = new NodejsFunction(that, 'crmBanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'BanUserLambda.ts'),
        handler: 'handler',
        functionName: 'react-CRM-BanUser-Lambda',
        role: lambdaRole,
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

    const crmEditUserNotesLambda = new NodejsFunction(that, 'crmEditUserNotesLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'EditUserNotesLambda.ts'),
        handler: 'handler',
        functionName: 'react-CRM-EditUserNotes-Lambda',
        role: lambdaRole,
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

    const GetMyBotAnalitics = new NodejsFunction(that, 'GetMyBotAnalitics', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'GetMyBotAnalitics.ts'),
        handler: 'handler',
        functionName: 'react-CRM-GetMyBot-Analitics-Lambda',
        role: lambdaRole,
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

    const GetContentPlanPostStats = new NodejsFunction(that, 'ContentPlanPostStats', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ContentPlanPostStats.ts'),
        handler: 'handler',
        functionName: 'react-CRM-ContentPlanPostStats-Lambda',
        role: lambdaRole,
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

    const ContentPlanPostFeedBacks = new NodejsFunction(that, 'ContentPlanPostFeedBacks', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ContentPlanPostFeedBacks.ts'),
        handler: 'handler',
        functionName: 'react-CRM-ContentPlanPostFeedBacks-Lambda',
        role: lambdaRole,
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

    const ContentPlanPostRates = new NodejsFunction(that, 'ContentPlanPostRates', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ContentPlanPostRates.ts'),
        handler: 'handler',
        functionName: 'react-CRM-ContentPlanPostRates-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        role: lambdaRole,
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
    // GrantAccessToDDB(
    //     [
    //         crmListMyUsersLambda,
    //         crmChannelSubscriptionsLambda,
    //         crmBotSubscriptionsLambda,
    //         crmUserProfileLambda,
    //         crmEditUserNotesLambda,
    //         crmBanLambda,
    //         crmBotSubscriptionsByUserLambda,
    //         crmChannelSubscriptionsByUserLambda,
    //         botPaymentsLambda,
    //         botPaymentsByUserLambda,
    //         scheduledPostsByUserLambda,
    //         GetMyBotAnalitics,
    //         GetContentPlanPostStats,
    //         ContentPlanPostFeedBacks,
    //         ContentPlanPostRates
    //     ],
    //     tables
    // );

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: crmListMyUsersLambda,
        resource: 'ListMyUsers',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: crmBotSubscriptionsLambda,
        resource: 'ListMyBotSubscriptions',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: crmBotSubscriptionsByUserLambda,
        resource: 'ListMyBotSubscriptionsByUser',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: crmChannelSubscriptionsLambda,
        resource: 'ListMyChannelsSubscriptions',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: crmChannelSubscriptionsByUserLambda,
        resource: 'ListMyChannelSubscriptionsByUser',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: botPaymentsLambda,
        resource: 'ListMyBotPayments',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: botPaymentsByUserLambda,
        resource: 'ListMyBotPaymentsByUser',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: scheduledPostsByUserLambda,
        resource: 'ListScheduledPostsByUser',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: crmUserProfileLambda,
        resource: 'UserProfile',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: crmBanLambda,
        resource: 'BanUser',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: crmEditUserNotesLambda,
        resource: 'EditUserNotes',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: GetMyBotAnalitics,
        resource: 'GetMyBotAnalitics',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: GetContentPlanPostStats,
        resource: 'GetContentPlanPostStats',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: ContentPlanPostFeedBacks,
        resource: 'ContentPlanPostFeedBacks',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: ContentPlanPostRates,
        resource: 'ContentPlanPostRates',
        httpMethod: 'GET'
    });

    return returnArray;
}
