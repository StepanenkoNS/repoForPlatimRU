import { App } from 'aws-cdk-lib';
//@ts-ignore
import {StaticEnvironment}from '../../../Core/ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import {DynamicEnvironment}from '../../../Core/ReadmeAndConfig/DynamicEnvironment';

import { PaymentIntegrationsStack } from './PaymentIntegrations/PaymentIntegrations';

const app = new App();

const paymentIntegrationsStack = new PaymentIntegrationsStack(app, StackName.PaymentIntegrationsAndGateWay.toString(), {
    stackName: StackName.PaymentIntegrationsAndGateWay.toString(),
    certificateARN: DynamicEnvironment.Certificates.domainCertificateARN,

    enableAPICache: false,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }
});
