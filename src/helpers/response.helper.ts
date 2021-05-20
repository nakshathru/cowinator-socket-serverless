export const response = (body:any, config: {status:number}) => {
    const { status } = config;    
    return {
        statusCode: status,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({output: body}),
        isBase64Encoded: false
      };
}