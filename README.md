# AWS CDK Project Setup

This guide provides step-by-step instructions for setting up an AWS CDK (Cloud Development Kit) project using TypeScript.

## Installation

### 1. Install AWS CLI

Follow the [AWS CLI installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to install the AWS CLI on your system.

### 2. Verify AWS CLI Installation
```bash
aws --version
```
### 3. Install AWS CDK
```bash
npm install -g aws-cdk
```
### 4. Set AWS Credentials

Configure your AWS credentials using the following command:
```bash
aws configure
```
### 5. Initializing the Project

Navigate to your project directory and run the following command to initialize a new CDK project with TypeScript:
```bash
cdk init app --language typescript
```

### 5. Bootstrap the AWS Environment

The `cdk bootstrap` command is used to prepare your AWS account for using the AWS CDK (Cloud Development Kit). It creates the infrastructure needed for deploying CDK applications. Here is what the `cdk bootstrap` command does:

- **Creating an S3 bucket**:
  - Creates a special S3 bucket used to store file assets (such as Lambda function packages, static websites, and other files) that will be used by your CDK stacks.

- **Creating IAM roles**:
  - Creates IAM roles used for deploying and executing your CDK stacks. These roles provide the necessary permissions for CloudFormation to perform actions on your behalf.

```bash
cdk bootstrap
```
### 6. Deploying the Project
Deploy your CDK stacks to your AWS account with the following command:
```bash
cdk deploy
```
### 7. Destroy CDK Stacks
To delete all resources created by your CDK stacks, use the following command:
```bash
cdk destroy
```
