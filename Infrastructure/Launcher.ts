import { App } from 'aws-cdk-lib';
//@ts-ignore
import * as StaticEnvironment from '../../../Core/ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import * as DynamicEnvironment from '../../../Core/ReadmeAndConfig/DynamicEnvironment';

import { PaymentIntegrationsStack } from './PaymentIntegrations/PaymentIntegrations';

const app = new App();

const paymentIntegrationsStack = new PaymentIntegrationsStack(app, StaticEnvironment.StackName.PaymentIntegrationsAndGateWay.toString(), {
    stackName: StaticEnvironment.StackName.PaymentIntegrationsAndGateWay.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,

    enableAPICache: false,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
