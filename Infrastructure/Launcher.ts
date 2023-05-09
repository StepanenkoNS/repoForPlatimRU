import { App } from 'aws-cdk-lib';
//@ts-ignore
import * as StaticEnvironment from '../../ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import * as DynamicEnvironment from '../../ReadmeAndConfig/DynamicEnvironment';
import { MainRestServicesStack } from './RestServices/MainRestServices';
import { TokenServiceStack } from './TokenService/TokenServices';
import { WebPublicPagesStack } from './WebPublicPages/WebPublicPages';
import { FilesRestServicesStack } from './RestServices/FilesRestServices';
import { MessagesAndPaymentsRestServicesStack } from './RestServices/MessagesAndPaymentsRestServices';
import { PlansAndPostsRestServicesStack } from './RestServices/PlansAndPostsRestServices';
import { SubscriptionsRestServicesStack } from './RestServices/SubscriptionsRestService';
import { CRMRestServicesStack } from './RestServices/CRMRestService';
import { BotLandingRestServicesStack } from './RestServices/LandingRestService';
import { GatewayServiceStack } from './RestServices/GateWayService';
import { LambdaIntegrations } from './RestServices/Helper/GWtypes';

const app = new App();

const lambdaRestIntegrations: LambdaIntegrations[] = [];
const lambdaCRMIntegrations: LambdaIntegrations[] = [];

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

    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

lambdaRestIntegrations.push(...mainRestServicesStack.lambdaIntegrations);

const filesRestServicesStack = new FilesRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceFiles.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceFiles.toString(),

    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaRestIntegrations.push(...filesRestServicesStack.lambdaIntegrations);

const messagesAndPaymentsRestServicesStack = new MessagesAndPaymentsRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceMessagesAndPayments.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceMessagesAndPayments.toString(),

    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaRestIntegrations.push(...messagesAndPaymentsRestServicesStack.lambdaIntegrations);

const plansAndPostsRestServicesStack = new PlansAndPostsRestServicesStack(app, StaticEnvironment.StackName.WebRestServicePlansAndPosts.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServicePlansAndPosts.toString(),

    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

lambdaRestIntegrations.push(...plansAndPostsRestServicesStack.lambdaIntegrations);

const subscriptionsRestServicesStack = new SubscriptionsRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceSubscriptions.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceSubscriptions.toString(),

    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaRestIntegrations.push(...subscriptionsRestServicesStack.lambdaIntegrations);

const cRMRestServicesStack = new CRMRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceCRM.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceCRM.toString(),

    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaCRMIntegrations.push(...cRMRestServicesStack.lambdaIntegrations);

const botLandingRestServicesStack = new BotLandingRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceLanding.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceLanding.toString(),

    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaRestIntegrations.push(...botLandingRestServicesStack.lambdaIntegrations);

const gatewayRestServiceStack = new GatewayServiceStack(app, StaticEnvironment.StackName.WebRestGatewayService.toString(), {
    stackName: StaticEnvironment.StackName.WebRestGatewayService.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    lambdaIntegrations: lambdaRestIntegrations,
    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    subDomain: StaticEnvironment.WebResources.subDomains.apiBackend.backendAPISubdomain,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

const gatewayCRMServiceStack = new GatewayServiceStack(app, StaticEnvironment.StackName.WebCRMGatewayService.toString(), {
    stackName: StaticEnvironment.StackName.WebCRMGatewayService.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    lambdaIntegrations: lambdaCRMIntegrations,
    layerARNs: [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN],
    subDomain: StaticEnvironment.WebResources.subDomains.apiBackend.crmAPISubdomain,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
