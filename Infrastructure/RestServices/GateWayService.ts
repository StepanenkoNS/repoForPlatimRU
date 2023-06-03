import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { LambdaIntegrations, ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
//@ts-ignore
import { createAPIandAuthorizer } from '/opt/DevHelpers/CreateAPIwithAuth';

import { Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IRole } from 'aws-cdk-lib/aws-iam';

export class GatewayServiceStack extends Stack {
    restServicesAPI: RestApi;
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            certificateARN: string;
            layerARNs: string[];
            lambdaIntegrations: LambdaIntegrations[];
            subDomain: string;
            role: IRole;
        }
    ) {
        super(scope, id, props);

        const botsIndexes = ReturnGSIs(StaticEnvironment.DynamoDbTables.botsTable.GSICount);
        const botsTable = Table.fromTableAttributes(this, 'imported-BotsTable', {
            tableArn: DynamicEnvrionment.DynamoDbTables.botsTable.arn,
            globalIndexes: botsIndexes
        });
        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        this.restServicesAPI = createAPIandAuthorizer(this, {
            certificateARN: props.certificateARN,
            layers: layers,
            tables: [botsTable],
            subDomainName: props.subDomain
        });

        let resource: Resource | undefined = undefined;
        for (const item of props.lambdaIntegrations) {
            resource = this.restServicesAPI.root.addResource(item.rootResource);

            for (const lambda of item.lambdas) {
                let res = resource;
                if (lambda.resource) {
                    res = res.addResource(lambda.resource);
                }
                const lambdaIntegration = new apigateway.LambdaIntegration(lambda.lambda, {
                    allowTestInvoke: false
                });
                res.addMethod(lambda.httpMethod, lambdaIntegration);
            }
        }

        new CfnOutput(this, this.stackName + '-APIGW-SecureAPI', {
            value: this.restServicesAPI.deploymentStage.urlForPath(),
            exportName: this.stackName + '-APIGW-SecureAPI'
        });
    }
}
