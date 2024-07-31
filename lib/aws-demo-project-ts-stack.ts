import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import path = require('path');

export class AwsDemoProjectTsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // creating DynamoDB table
    const table = new dynamodb.Table(this, 'AwsDemoProjectTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: "AwsDemoProjectTable", //table name
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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
        architecture: lambda.Architecture.ARM_64
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
  }
}
