import { response } from "../helpers/response.helper";
import { Sender } from "../helpers/socket.helper";
import { addConnection, getConnections, getMeetingId, removeConnection } from "../services/dynamodb.service";

export const connect = async (event) =>{
    try{
      const meetingId = event.queryStringParameters?.meetingId
      const connectionId = event.requestContext?.connectionId;
      if(!meetingId){
        throw new Error('Meeting Id missing')
      }
      await addConnection(meetingId, connectionId)
      const resp = response(`Successfully connected ${connectionId}`,{
        status: 200
        });
      console.log(resp);
      return resp
      
    }
    catch(error) {        
        const resp = response({message:'Failed to connect', error},{
            status: 500
        });
        console.error(resp);
        return resp
    }
}

export const disconnect = async (event) =>{
  try{
    const connectionId = event.requestContext?.connectionId;
    const { meetingId } = await getMeetingId(connectionId)
    await removeConnection(connectionId, meetingId)
    const resp =  response(`Successfully disconnected ${connectionId}`,{
      status: 200
      });
    console.log(resp);
    return resp
    
  }
  catch(error) {        
      const resp = response({message:'Failed to disconnect', error},{
          status: 500
      });
      console.error(resp);
      return resp
  }
}

export const message = async (event) =>{
  try{
    const { value } = JSON.parse(event.body)    
    const connectionId = event.requestContext?.connectionId;
    const { meetingId } = await getMeetingId(connectionId)
    const connections = await getConnections(meetingId)
    const sender = new Sender(event)
        
    const messenger = connections.map(({ connection_id }) => {
      try {
        return sender.post(value, connection_id);
      } catch (err) {
        console.error(response({message:'Failed to send message', err},{
          status: 500
        }));        
      }
    });
    await Promise.all(messenger);
    const resp = response(`Successfully sent message to ${meetingId}`,{
      status: 200
      });
    console.log(resp)
    return resp
  }
  catch(error) {      
    const resp = response({message:'Failed to send message', error},{
      status: 500
    })
    console.error(resp);
    return resp
  }
}