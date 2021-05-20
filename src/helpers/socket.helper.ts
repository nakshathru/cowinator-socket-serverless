import { ApiGatewayManagementApi } from "aws-sdk";

export class Sender {
  post:((message:string, connectionId:string)=>{})

  constructor(event) {
    if (event) {
      this.init(event);
    }
  }

  private init = (event) => {
    try {
      const apigwManagementApi = new ApiGatewayManagementApi({
        apiVersion: "cowinator2021",
        endpoint:
          `${event.requestContext.domainName}/${event.requestContext.stage}`
          // 'http://localhost:3001'
      });

      this.post = async (message, connectionId) => {
        return await apigwManagementApi
          .postToConnection({ ConnectionId: connectionId, Data: message })
          .promise();
      };
      console.log('event', event);
      console.log(this.post);
            
    } catch (error) {
      throw error;
    }
  };
}
