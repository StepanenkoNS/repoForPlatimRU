import { App } from 'aws-cdk-lib';
//@ts-ignore
import { StaticEnvironment } from '../../../Core/ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import { CertificateARN, DynamicEnvironment, LayersVersions } from '../../../Core/ReadmeAndConfig/DynamicEnvironment';

import { PaymentIntegrationsStack } from './PaymentIntegrations/PaymentIntegrations';
import { getConfig } from '/opt/DevHelpers/AWSEnvConfig';
import { StackName } from '../../../Core/ReadmeAndConfig/globalTypes';
import { EEnvironment } from 'tgbot-project-types/TypesCompiled/generalTypes';

async function main() {
    const app = new App();

    const environment = getConfig(app) as EEnvironment;
   if (!environment) {
        throw 'Environment is not defined';
    }

    const LayerArns = await LayersVersions(environment);
    if (!LayerArns) {
        throw 'Layers undefined';
    }

    const certificateARN = await CertificateARN(environment, StaticEnvironment(environment).WebResources.mainDomainName);
    if (!certificateARN) {
        throw 'CertificateARN is undefined';
    }

    const paymentIntegrationsStack = new PaymentIntegrationsStack(app, StackName.PaymentIntegrationsAndGateWay.toString(), {
        stackName: StackName.PaymentIntegrationsAndGateWay.toString(),
        certificateARN,
        environment,
        LayerArns,
        enableAPICache: false,
        env: {
            account: StaticEnvironment(environment).AwsSettings.account,
            region: StaticEnvironment(environment).AwsSettings.region
        }
    });
}
main();
