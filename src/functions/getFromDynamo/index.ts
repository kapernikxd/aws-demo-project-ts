import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const id = event.queryStringParameters?.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing id parameter'
            }),
        };
    }

    const params = {
        TableName: tableName,
        Key: {
            id: id
        }
    };

    try {
        const result = await dynamo.get(params).promise();
        if (result.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify(result.Item),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Item not found'
                }),
            };
        }
    } catch (error) {
        console.error('Error getting from DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error getting from DynamoDB',
            }),
        };
    }
};