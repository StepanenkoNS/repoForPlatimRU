import { App } from "aws-cdk-lib";
//@ts-ignore
import * as StaticEnvironment from "../../ReadmeAndConfig/StaticEnvironment";
import { RestServicesStack } from "./RestServices/RestServices";
import { TokenServiceStack } from "./TokenService/TokenService";

const app = new App();

const tokenService = new TokenServiceStack(
  app,
  StaticEnvironment.StackName.WebTokenService.toString(),
  {
    stackName: StaticEnvironment.StackName.WebTokenService.toString(),
    redeployGateWayEachTime: true,
    env: {
      account: StaticEnvironment.GlobalAWSEnvironment.account,
      region: StaticEnvironment.GlobalAWSEnvironment.region,
    },
  }
);

const restServicesStack = new RestServicesStack(
  app,
  StaticEnvironment.StackName.WebRestService.toString(),
  {
    stackName: StaticEnvironment.StackName.WebRestService.toString(),
    redeployGateWayEachTime: true,
    env: {
      account: StaticEnvironment.GlobalAWSEnvironment.account,
      region: StaticEnvironment.GlobalAWSEnvironment.region,
    },
  }
);
