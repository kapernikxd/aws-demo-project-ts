import * as AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();

export const handler = async () => {
    const tableName = process.env.TABLE_NAME;
    if (!tableName) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Table name is not set in the environment variables',
            }),
        };
    }

    const item = {
        id: new Date().getTime().toString(),
        data: 'Default data'
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