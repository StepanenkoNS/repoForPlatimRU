import { App } from 'aws-cdk-lib';
//@ts-ignore
import * as StaticEnvironment from '../../ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import * as DynamicEnvironment from '../../ReadmeAndConfig/DynamicEnvironment';
import { RestServicesStack } from './RestServices/RestServices';
import { TokenServiceStack } from './TokenService/TokenService';
import { WebPublicPagesStack } from './NotAuthorizedPages/WebPublicPages';

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

const restServicesStack = new RestServicesStack(app, StaticEnvironment.StackName.WebRestService.toString(), {
    stackName: StaticEnvironment.StackName.WebRestService.toString(),
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
