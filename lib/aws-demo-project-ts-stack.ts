import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import path = require('path');

export class AwsDemoProjectTsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // creating secret
    const apiUrlSecret = new Secret(this, 'ApiUrlSecret', {
      secretStringValue: cdk.SecretValue.unsafePlainText(JSON.stringify({ apiUrl: 'https://jsonplaceholder.typicode.com/posts' })),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // creating DynamoDB table
    const table = new dynamodb.Table(this, 'AwsDemoProjectTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: "AwsDemoProjectTable", //table name
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const apiFunction = new NodejsFunction(this, 'AxiosFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      entry: path.join(__dirname, '../src/functions/axiosTest/index.ts'),
      environment: {
        SECRET_NAME: apiUrlSecret.secretName,
      },
      functionName: `AxiosFunction`,
      architecture: lambda.Architecture.ARM_64,
      bundling: {
        externalModules: [],
        nodeModules: ['axios'],
      },
    });

    const helloWorldFunction = new NodejsFunction(this, 'hello-world', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../src/functions/index.ts'),
      functionName: `hello-world`,
      architecture: lambda.Architecture.ARM_64,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const writeLambdaFunction = new NodejsFunction(this, 'WriteFunction', {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: path.join(__dirname, '../src/functions/writeToDynamo/index.ts'),
        environment: {
            TABLE_NAME: table.tableName
        },
        functionName: `WriteFunction`,
        architecture: lambda.Architecture.ARM_64,
    });

      const getLambdaFunction = new NodejsFunction(this, 'GetFunction', {
          runtime: lambda.Runtime.NODEJS_16_X,
          handler: 'handler',
          entry: path.join(__dirname, '../src/functions/getFromDynamo/index.ts'),
          environment:{
              TABLE_NAME: table.tableName 
          },
          architecture: lambda.Architecture.ARM_64,
          functionName: `GetFunction`,
      });
  

      // Grant the lambda function permissions to access the DynamoDB table
      table.grantReadWriteData(helloWorldFunction);
      table.grantReadWriteData(writeLambdaFunction);
      table.grantReadData(getLambdaFunction);


    // Create API Gateway
    const api = new apigateway.RestApi(this, 'DemoApi', {
      restApiName: 'Demo Service',
      description: 'This service serves write and read functions.'
    });

    // Add /write endpoint
    const writeIntegration = new apigateway.LambdaIntegration(writeLambdaFunction);
    api.root.addResource('write').addMethod('POST', writeIntegration);

    // Add /get endpoint
    const getIntegration = new apigateway.LambdaIntegration(getLambdaFunction);
    api.root.addResource('get').addMethod('GET', getIntegration);


    // Permissions for Lambda function to access secret
    apiUrlSecret.grantRead(apiFunction);

  }
}
