import axios from 'axios';

export const handler = async () => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return {
          statusCode: 200,
          body: JSON.stringify({
            data: response.data,
          })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error',
            }),
        };
    }
};