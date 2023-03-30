import { App } from 'aws-cdk-lib';
//@ts-ignore
import * as StaticEnvironment from '../../ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import * as DynamicEnvironment from '../../ReadmeAndConfig/DynamicEnvironment';
import { MainRestServicesStack } from './RestServices/MainRestServices';
import { TokenServiceStack } from './TokenService/TokenService';
import { WebPublicPagesStack } from './WebPublicPages/WebPublicPages';
import { ReturnGSIs } from '/opt/LambdaHelpers/AccessHelper';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { FilesRestServicesStack } from './RestServices/FilesRestServices';
import { MessagesAndPaymentsRestServicesStack } from './RestServices/MessagesAndPaymentsRestServices';
import { PlansAndPostsRestServicesStack } from './RestServices/PlansAndPostsRestServices';
import { SubscriptionsRestServicesStack } from './RestServices/SubscriptionsRestService';

const app = new App();

const tokenService = new TokenServiceStack(app, StaticEnvironment.StackName.WebTokenService.toString(), {
    stackName: StaticEnvironment.StackName.WebTokenService.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

const webPublicPagesStack = new WebPublicPagesStack(app, StaticEnvironment.StackName.WebPublicPages.toString(), {
    stackName: StaticEnvironment.StackName.WebPublicPages.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    enableAPICache: false,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

const mainRestServicesStack = new MainRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceMain.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceMain.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

const gateway = mainRestServicesStack.restServicesAPI;

const filesRestServicesStack = new FilesRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceFiles.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceFiles.toString(),
    restServicesAPI: gateway,
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

const messagesAndPaymentsRestServicesStack = new MessagesAndPaymentsRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceMessagesAndPayments.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceMessagesAndPayments.toString(),
    restServicesAPI: gateway,
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

const plansAndPostsRestServicesStack = new PlansAndPostsRestServicesStack(app, StaticEnvironment.StackName.WebRestServicePlansAndPosts.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServicePlansAndPosts.toString(),
    restServicesAPI: gateway,
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

const subscriptionsRestServicesStack = new SubscriptionsRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceSubscriptions.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceSubscriptions.toString(),
    restServicesAPI: gateway,
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
