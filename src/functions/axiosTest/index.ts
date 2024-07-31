import * as AWS from 'aws-sdk';
import axios from 'axios';

const secretsManager = new AWS.SecretsManager();
const secretName = process.env.SECRET_NAME!;

export const handler = async () => {
  try {
    // Getting secret from Secrets Manager
    const secretValue = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const secretString = secretValue.SecretString;
    if (!secretString) {
      throw new Error('Secret string is undefined');
    }

    const secret = JSON.parse(secretString);
    const apiUrl = secret.apiUrl;

    const response = await axios.get(apiUrl);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: response.data,
        message: "hello"
      })
    };
  } catch (error) {
    console.error('Error fetching data or secret:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error',
      }),
    };
  }
};