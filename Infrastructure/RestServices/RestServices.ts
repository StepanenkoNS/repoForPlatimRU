import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import { createAPIandAuthorizer, GrantAccessToDDB, GrantAccessToSecrets } from './Helper';

export class RestServicesStack extends Stack {
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            certificateARN: string;
            layerARNs: string[];
        }
    ) {
        super(scope, id, props);
        const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);
        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        const restServicesAPI = createAPIandAuthorizer(this, props.certificateARN, layers, [botsTable]);
        const lambdaBotsRootResource = restServicesAPI.root.addResource('Bots');
        const lambdaGetMyBotsResource = lambdaBotsRootResource.addResource('GetMyBots');

        const lambdaPaymentOptionsRootResource = restServicesAPI.root.addResource('PaymentOptions');
        const lambdaGetPaymentOptionsResource = lambdaPaymentOptionsRootResource.addResource('List');
        const lambdaAddPaymentOptionsResource = lambdaPaymentOptionsRootResource.addResource('Add');
        const lambdaDeletePaymentOptionsResource = lambdaPaymentOptionsRootResource.addResource('Delete');
        const lambdaEdutPaymentOptionsResource = lambdaPaymentOptionsRootResource.addResource('Edit');

        const ListBotsLambda = new NodejsFunction(this, 'ListBotsLambda', {
            entry: join(__dirname, '..', '..', 'services', 'Bots', 'ListMyBots.ts'),
            handler: 'ListMyBotsHandler',
            functionName: 'react-ListBots-Lambda',
            runtime: Runtime.NODEJS_16_X,
            environment: {
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                botFatherId: StaticEnvironment.EnvironmentVariables.botFatherId,
                allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
                cookieDomain: StaticEnvironment.WebResources.mainDomainName
            },
            bundling: {
                externalModules: ['aws-sdk', '/opt/*']
            },
            layers: layers
        });

        const lambdaIntegrationListBots = new apigateway.LambdaIntegration(ListBotsLambda);
        lambdaGetMyBotsResource.addMethod('GET', lambdaIntegrationListBots);

        const ListPaymentOptionsLambda = new NodejsFunction(this, 'ListPaymentOptionsLambda', {
            entry: join(__dirname, '..', '..', 'services', 'PaymentOptions', 'ListPaymentOptionsLambda.ts'),
            handler: 'ListPaymentOptionsHandler',
            functionName: 'react-ListPaymentOptions-Lambda',
            runtime: Runtime.NODEJS_16_X,
            environment: {
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                botFatherId: StaticEnvironment.EnvironmentVariables.botFatherId,
                allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
                cookieDomain: StaticEnvironment.WebResources.mainDomainName
            },
            bundling: {
                externalModules: ['aws-sdk', '/opt/*']
            },
            layers: layers
        });

        const lambdaIntegrationListPaymentOptions = new apigateway.LambdaIntegration(ListPaymentOptionsLambda);
        lambdaGetPaymentOptionsResource.addMethod('GET', lambdaIntegrationListPaymentOptions);

        const AddPaymentOptionsLambda = new NodejsFunction(this, 'AddPaymentOptionsLambda', {
            entry: join(__dirname, '..', '..', 'services', 'PaymentOptions', 'AddPaymentOptionsLambda.ts'),
            handler: 'AddPaymentOptionsHandler',
            functionName: 'react-AddPaymentOptions-Lambda',
            runtime: Runtime.NODEJS_16_X,
            environment: {
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                botFatherId: StaticEnvironment.EnvironmentVariables.botFatherId,
                allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
                cookieDomain: StaticEnvironment.WebResources.mainDomainName
            },
            bundling: {
                externalModules: ['aws-sdk', '/opt/*']
            },
            layers: layers
        });

        const lambdaIntegrationAddPaymentOptions = new apigateway.LambdaIntegration(AddPaymentOptionsLambda);
        lambdaAddPaymentOptionsResource.addMethod('POST', lambdaIntegrationAddPaymentOptions);

        //удаление опции оплаты
        const DeletePaymentOptionLambda = new NodejsFunction(this, 'DeletePaymentOptionLambda', {
            entry: join(__dirname, '..', '..', 'services', 'PaymentOptions', 'DeletePaymentOptionLambda.ts'),
            handler: 'DeletePaymentOptionHandler',
            functionName: 'react-DeletePaymentOption-Lambda',
            runtime: Runtime.NODEJS_16_X,
            environment: {
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                botFatherId: StaticEnvironment.EnvironmentVariables.botFatherId,
                allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
                cookieDomain: StaticEnvironment.WebResources.mainDomainName
            },
            bundling: {
                externalModules: ['aws-sdk', '/opt/*']
            },
            layers: layers
        });

        const lambdaIntegrationDeletePaymentOption = new apigateway.LambdaIntegration(DeletePaymentOptionLambda);
        lambdaDeletePaymentOptionsResource.addMethod('DELETE', lambdaIntegrationDeletePaymentOption);

        //редактирование опции оплаты
        const EditPaymentOptionLambda = new NodejsFunction(this, 'EditPaymentOptionLambda', {
            entry: join(__dirname, '..', '..', 'services', 'PaymentOptions', 'EditPaymentOptionLambda.ts'),
            handler: 'EditPaymentOptionHandler',
            functionName: 'react-EditPaymentOption-Lambda',
            runtime: Runtime.NODEJS_16_X,
            timeout: Duration.seconds(15),
            environment: {
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                botFatherId: StaticEnvironment.EnvironmentVariables.botFatherId,
                allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
                cookieDomain: StaticEnvironment.WebResources.mainDomainName
            },
            bundling: {
                externalModules: ['aws-sdk', '/opt/*']
            },
            layers: layers
        });

        const lambdaIntegrationEditPaymentOption = new apigateway.LambdaIntegration(EditPaymentOptionLambda);
        lambdaEdutPaymentOptionsResource.addMethod('PUT', lambdaIntegrationEditPaymentOption);

        GrantAccessToSecrets([AddPaymentOptionsLambda, DeletePaymentOptionLambda, EditPaymentOptionLambda]);
        GrantAccessToDDB([ListBotsLambda, ListPaymentOptionsLambda, AddPaymentOptionsLambda, DeletePaymentOptionLambda, EditPaymentOptionLambda], [botsTable]);
        new CfnOutput(this, this.stackName + '-APIGW-SecureAPI', {
            value: restServicesAPI.deploymentStage.urlForPath(),
            exportName: this.stackName + '-APIGW-SecureAPI'
        });
        // new CfnOutput(this, this.stackName + "-AuthoriserId", {
        //   value: authorizer.authorizerId,
        //   exportName: this.stackName + "-AuthoriserId",
        // });
    }
}
