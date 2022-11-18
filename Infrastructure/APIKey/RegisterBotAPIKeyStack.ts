import { CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiKey } from 'aws-cdk-lib/aws-apigateway';

export class RegisterBotAPIKeyStack extends Stack {


    public readonly apiKey:  ApiKey;

    constructor (scope: Construct, id:string, props: StackProps){
        super(scope, id, props);
        this.apiKey = new ApiKey(this, 'registerBotAPIKey', {
            apiKeyName: 'registerBotAPIKey',
            description: 'APIKey to server RegisterBot Queries',
            enabled: true
        });

        // new CfnOutput(this, 'registerBotAPIKey', {
        //     value: this.apiKey,
        //     description:'APIKeyValue for all GWs',
        //     exportName: 'registerBotAPIKey'
        //   });
    }

}

