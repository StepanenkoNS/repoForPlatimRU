import { App } from 'aws-cdk-lib';
//@ts-ignore
import { StaticEnvironment } from '../../../Core/ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import { DynamicEnvironment } from '../../../Core/ReadmeAndConfig/DynamicEnvironment';

import { PaymentIntegrationsStack } from './PaymentIntegrations/PaymentIntegrations';

async function main() {
    const app = new App();

    const environment = getConfig(app) as EEnvironment;
    if (!EEnvironment) {
        throw 'Environment is not defined';
    }
    const certificateARN = await CertificateARN(environment, StaticEnvironment(environment).WebResources.mainDomainName);
    if (!certificateARN) {
        throw 'CertificateARN is undefined';
    }

    const paymentIntegrationsStack = new PaymentIntegrationsStack(app, StackName.PaymentIntegrationsAndGateWay.toString(), {
        stackName: StackName.PaymentIntegrationsAndGateWay.toString(),
        certificateARN: DynamicEnvironment(props.environment).Certificates.domainCertificateARN,

        enableAPICache: false,
        env: {
            account: StaticEnvironment(environment).AwsSettings.account,
            region: StaticEnvironment(environment).AwsSettings.region
        }
    });
}
main();
