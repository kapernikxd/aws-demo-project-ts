import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const requestBody = JSON.parse(event.body!);

    const item = {
        id: requestBody.id || new Date().getTime().toString(),
        data: requestBody.data || 'Default data'
    };

    const params = {
        TableName: tableName,
        Item: item
    };

    try {
        await dynamo.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Data written to DynamoDB successfully',
                item
            }),
        };
    } catch (error) {
        console.error('Error writing to DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error writing to DynamoDB',
            }),
        };
    }
};