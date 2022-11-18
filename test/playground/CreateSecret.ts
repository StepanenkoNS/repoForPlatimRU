import SecretsManager from 'aws-sdk/clients/secretsmanager';
import {getSecrets, createSecrets} from '../../services/BotFatherBot/utils/AwsSecretManager';

const botId = "1";
const botToken = "1:AAFAS4_GBLgK9d4CNUb1re6U5qw43y0t70M"
async function main(){
    const p: SecretsManager.CreateSecretRequest = {
        Name: 'telegram-'+botId,
        SecretString: botToken,

        Tags: [
        {Key: 'serviceName',
        Value: 'telegramBot'}
        ]
    }
    const result = await createSecrets(p);
    console.log(result);
}

main()