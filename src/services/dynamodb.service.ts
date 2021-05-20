import { DynamoDB } from 'aws-sdk'

const ddb = new DynamoDB.DocumentClient({
    'region': 'ap-south-1' 
    // region: 'localhost',
    // endpoint: 'http://localhost:8000'
});
const tableName = 'cowinator_pool'

export const addConnection = async (meetingId, connectionId) =>{
    try{
    return ddb.put({
         TableName: tableName, 
         Item: { 
             connection_id: connectionId,
             meeting_id: meetingId
            }, 
        }).promise();
    }
    catch(error) {             
        throw(error)
    }
}

export const removeConnection = async (connectionId, meetingId) =>{
    try{
    return ddb.delete({
         TableName: tableName, 
         Key: { 
             connection_id: connectionId,
             meeting_id: meetingId
            }, 
        }).promise();
    }
    catch(error) {     
        throw(error)
    }
}

export const getMeetingId = async (connectionId) =>{
    try{
    const params = {
            TableName: tableName,
            KeyConditionExpression: "#ci = :connid",
            ExpressionAttributeNames: {
              "#ci": "connection_id"
            },
            ExpressionAttributeValues: {
              ":connid": connectionId
            }
          }
    const { Items } = await ddb.query(params).promise()     
    const [ meeting ] = Items as Array<{meeting_id:string}>
    const { meeting_id: meetingId } = meeting
    return { meetingId }
    }
    catch(error) {     
        throw(error)
    }
}

export const getConnections = async (meetingId) =>{
    try{
    const params = {
            TableName: tableName,
            IndexName: 'meeting_index',
            KeyConditionExpression: "#mi = :meetid",
            ExpressionAttributeNames: {
              "#mi": "meeting_id"
            },
            ExpressionAttributeValues: {
              ":meetid": meetingId
            }
          }
    const { Items } = await ddb.query(params).promise()  
    return Items as Array<{meeting_id:string, connection_id:string}>
    }
    catch(error) {     
        throw(error)
    }
}