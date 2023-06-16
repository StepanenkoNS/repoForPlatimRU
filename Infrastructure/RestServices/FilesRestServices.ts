import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { LambdaIntegrations, ReturnGSIs } from 'opt/DevHelpers/AccessHelper';
//@ts-ignore

import { CreateGetPresignedUrlsLambdas } from './RestLambdas/PreSignedUrl';

import { CreateTelegramFilesLambdas } from './RestLambdas/TelegramFiles';
import { IRole } from 'aws-cdk-lib/aws-iam';

export class FilesRestServicesStack extends Stack {
    lambdaIntegrations: LambdaIntegrations[];
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            layers: ILayerVersion[];
            lambdaRole: IRole;
        }
    ) {
        super(scope, id, props);
        this.lambdaIntegrations = [];
        // const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);

        // const botsIndexes = ReturnGSIs(StaticEnvironment.DynamoDbTables.botsTable.GSICount);
        // const botsTable = Table.fromTableAttributes(this, 'imported-BotsTable', {
        //     tableArn: DynamicEnvrionment.DynamoDbTables.botsTable.arn,
        //     globalIndexes: botsIndexes
        // });

        // const messageFilesLambdas = CreateMessageFilesLambdas(this, layers, [botsTable]);
        // this.lambdaIntegrations.push({
        //     rootResource: 'MessageFiles',
        //     lambdas: messageFilesLambdas
        // });
        const telegramFilesLambdas = CreateTelegramFilesLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'TelegramFiles',
            lambdas: telegramFilesLambdas
        });
        const preSignedUrlLambdas = CreateGetPresignedUrlsLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'PreSignedUrls',
            lambdas: preSignedUrlLambdas
        });
    }
}
