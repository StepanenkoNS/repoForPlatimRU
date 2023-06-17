import { App } from 'aws-cdk-lib';
//@ts-ignore
import * as StaticEnvironment from '../../Core/ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import * as DynamicEnvironment from '../../Core/ReadmeAndConfig/DynamicEnvironment';
import { MainRestServicesStack } from './RestServices/MainRestServices';
import { TokenServiceStack } from './TokenService/TokenServices';
import { WebPublicPagesStack } from './WebPublicPages/WebPublicPages';
import { FilesRestServicesStack } from './RestServices/FilesRestServices';
import { MessagesAndPaymentsRestServicesStack } from './RestServices/MessagesAndPaymentsRestServices';
import { PlansAndPostsRestServicesStack } from './RestServices/PlansAndPostsRestServices';
import { SubscriptionsRestServicesStack } from './RestServices/SubscriptionsRestService';
import { CRMRestServicesStack } from './CRMServices/CRMRestService';
import { BotLandingRestServicesStack } from './RestServices/LandingRestService';
import { GatewayServiceStack } from './GateWays/GateWayService';

import { PaymentIntegrationsStack } from './PaymentIntegrations/PaymentIntegrations';
import { LambdaIntegrations } from '/opt/DevHelpers/AccessHelper';
import { DeploymentHelper } from './DeploymentHelper/DeploymentHelperStack';
import { CRMCampaignsStack } from './CRMServices/CRMCampaigns';

const app = new App();

const lambdaRestIntegrations: LambdaIntegrations[] = [];
const lambdaCRMIntegrations: LambdaIntegrations[] = [];

const roleService = new DeploymentHelper(app, StaticEnvironment.StackName.DeploymentHelperStack.toString(), {
    stackName: StaticEnvironment.StackName.DeploymentHelperStack.toString(),
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

const tokenService = new TokenServiceStack(app, StaticEnvironment.StackName.WebTokenAndGateWayService.toString(), {
    stackName: StaticEnvironment.StackName.WebTokenAndGateWayService.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

const webPublicPagesStack = new WebPublicPagesStack(app, StaticEnvironment.StackName.WebPublicPagesAndGateWayService.toString(), {
    stackName: StaticEnvironment.StackName.WebPublicPagesAndGateWayService.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    enableAPICache: false,

    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

webPublicPagesStack.addDependency(tokenService);

const mainRestServicesStack = new MainRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceMain.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceMain.toString(),

    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

lambdaRestIntegrations.push(...mainRestServicesStack.lambdaIntegrations);

mainRestServicesStack.addDependency(webPublicPagesStack);

const filesRestServicesStack = new FilesRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceFiles.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceFiles.toString(),

    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaRestIntegrations.push(...filesRestServicesStack.lambdaIntegrations);

filesRestServicesStack.addDependency(mainRestServicesStack);

const messagesAndPaymentsRestServicesStack = new MessagesAndPaymentsRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceMessagesAndPayments.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceMessagesAndPayments.toString(),

    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaRestIntegrations.push(...messagesAndPaymentsRestServicesStack.lambdaIntegrations);

messagesAndPaymentsRestServicesStack.addDependency(filesRestServicesStack);

const plansAndPostsRestServicesStack = new PlansAndPostsRestServicesStack(app, StaticEnvironment.StackName.WebRestServicePlansAndPosts.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServicePlansAndPosts.toString(),

    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

lambdaRestIntegrations.push(...plansAndPostsRestServicesStack.lambdaIntegrations);

plansAndPostsRestServicesStack.addDependency(messagesAndPaymentsRestServicesStack);

const subscriptionsRestServicesStack = new SubscriptionsRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceSubscriptions.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceSubscriptions.toString(),
    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaRestIntegrations.push(...subscriptionsRestServicesStack.lambdaIntegrations);

subscriptionsRestServicesStack.addDependency(plansAndPostsRestServicesStack);

const cRMRestServicesStack = new CRMRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceCRM.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceCRM.toString(),

    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaCRMIntegrations.push(...cRMRestServicesStack.lambdaIntegrations);

cRMRestServicesStack.addDependency(tokenService);

const cRMCampaignsStack = new CRMCampaignsStack(app, StaticEnvironment.StackName.WebRestServiceCRMCampaigns.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceCRMCampaigns.toString(),

    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaCRMIntegrations.push(...cRMCampaignsStack.lambdaIntegrations);

const botLandingRestServicesStack = new BotLandingRestServicesStack(app, StaticEnvironment.StackName.WebRestServiceLanding.toString(), {
    stackName: StaticEnvironment.StackName.WebRestServiceLanding.toString(),
    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
lambdaRestIntegrations.push(...botLandingRestServicesStack.lambdaIntegrations);

botLandingRestServicesStack.addDependency(mainRestServicesStack);

const gatewayRestServiceStack = new GatewayServiceStack(app, StaticEnvironment.StackName.WebRestGatewayService.toString(), {
    stackName: StaticEnvironment.StackName.WebRestGatewayService.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    lambdaIntegrations: lambdaRestIntegrations,
    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    subDomain: StaticEnvironment.WebResources.subDomains.apiBackend.backendAPISubdomain,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

gatewayRestServiceStack.addDependency(botLandingRestServicesStack);

const gatewayCRMServiceStack = new GatewayServiceStack(app, StaticEnvironment.StackName.WebCRMGatewayService.toString(), {
    stackName: StaticEnvironment.StackName.WebCRMGatewayService.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    lambdaIntegrations: lambdaCRMIntegrations,
    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    subDomain: StaticEnvironment.WebResources.subDomains.apiBackend.crmAPISubdomain,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

gatewayCRMServiceStack.addDependency(cRMRestServicesStack);

const paymentIntegrationsStack = new PaymentIntegrationsStack(app, StaticEnvironment.StackName.PaymentIntegrationsAndGateWay.toString(), {
    stackName: StaticEnvironment.StackName.PaymentIntegrationsAndGateWay.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,
    layers: roleService.layers,
    lambdaRole: roleService.lambdaRole,
    enableAPICache: false,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});

paymentIntegrationsStack.addDependency(gatewayRestServiceStack);
