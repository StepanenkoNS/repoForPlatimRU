import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { LambdaIntegrations, ReturnGSIs } from '/opt/DevHelpers/AccessHelper';

import { CreateBotsLambdas } from './RestLambdas/Bots';

import { CreatePaymentOptionsLambdas } from './RestLambdas/PaymentOptions';

import { CreateChannelsLambdas } from './RestLambdas/Channels';
import { CreateBotCommandsLambdas } from './RestLambdas/BotCommands';
import { CreateCalendarMeetingsLambdas } from './RestLambdas/CalendarMeetings';
import { CreateCascadeDelete } from './RestLambdas/CascadeDelete';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { CreateBotMenuSettingsLambdas } from './RestLambdas/BotMenuSettings';
import { CreateNotificationsLambdas } from './RestLambdas/Notifications';
import { CreateCampaignsLambdas } from './RestLambdas/Campaigns';

export class MainRestServicesStack extends Stack {
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

        const botsIndexes = ReturnGSIs(StaticEnvironment.DynamoDbTables.botsTable.GSICount);
        const botsTable = Table.fromTableAttributes(this, 'imported-BotsTable', {
            tableArn: DynamicEnvrionment.DynamoDbTables.botsTable.arn,
            globalIndexes: botsIndexes
        });

        const botLambdas = CreateBotsLambdas(this, props.layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'Bots',
            lambdas: botLambdas
        });

        const botCommands = CreateBotCommandsLambdas(this, props.layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'BotCommands',
            lambdas: botCommands
        });
        const channelLambdas = CreateChannelsLambdas(this, props.layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'Channels',
            lambdas: channelLambdas
        });

        const meetingLambdas = CreateCalendarMeetingsLambdas(this, props.layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'CalendarMeeting',
            lambdas: meetingLambdas
        });

        const paymentOptionsLambdas = CreatePaymentOptionsLambdas(this, props.layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'PaymentOptions',
            lambdas: paymentOptionsLambdas
        });

        const botMenuSettingsLambdas = CreateBotMenuSettingsLambdas(this, props.layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'BotMenuSettings',
            lambdas: botMenuSettingsLambdas
        });

        const createNotificationsLambdas = CreateNotificationsLambdas(this, props.layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'Notifications',
            lambdas: createNotificationsLambdas
        });

        const cascadeDeleteLambdas = CreateCascadeDelete(this, props.layers, props.lambdaRole);

        const campaigns = CreateCampaignsLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'CampaignsInternal',
            lambdas: createNotificationsLambdas
        });
    }
}
