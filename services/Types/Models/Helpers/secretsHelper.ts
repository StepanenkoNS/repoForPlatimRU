import {AWSError, SecretsManager} from 'aws-sdk';
import { CreateSecretRequest, CreateSecretResponse, DeleteSecretRequest, DeleteSecretResponse, GetSecretValueRequest, GetSecretValueResponse, UpdateSecretRequest, UpdateSecretResponse } from 'aws-sdk/clients/secretsmanager';

const secretsClient = new SecretsManager({
    region: process.env.region,
  });

  export const createSecrets = async (params: CreateSecretRequest) => {
    const response = await new Promise<AWSError | CreateSecretResponse>((resolve, reject) => {
      secretsClient.createSecret(params, (err, result) => {
        if (err) reject(err);
        if (result) {
          resolve(result);
        }
      });
    });
    return response;
  };  

  export const updateSecrets = async (params:UpdateSecretRequest) => {
    const response = await new Promise<AWSError | UpdateSecretResponse>((resolve, reject) => {
      secretsClient.updateSecret(params, (err, result) => {
        if (err) {
            reject(err);
            throw(err);
        }
        if (result) {
          resolve(result);
        }
      });
    });
    return response;
  };  

export const getSecrets = async (params: GetSecretValueRequest) => {
    const response = await new Promise<AWSError | GetSecretValueResponse>((resolve, reject) => {

        secretsClient.getSecretValue(params, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result) {
          resolve(result);
        }
      });
    });
    return response;
}; 

export const deleteSecret = async (params: DeleteSecretRequest) => {
  const response = await new Promise<AWSError | DeleteSecretResponse>((resolve, reject) => {

      secretsClient.deleteSecret(params, (err, result) => {
      if (err) reject(err);
      if (result) {
        resolve(result);
      }
    });
  });
  return response;
}; 