import 'source-map-support/register';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateItem } from '../../businessLogic/Business';
import { UpdateItemRequest } from "../../requests/UpdateItemRequest";
import { getUserId } from "../utils";
import { createLogger } from '../../utils/logger';

const logger = createLogger('updateTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info("Processing event", event);
    const itemId = event.pathParameters.itemId;
    const updatedItem: UpdateItemRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    await updateItem(userId, itemId, updatedItem);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ""
    };
  } catch (error) {
    logger.error("updateItem", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error
      })
    };
  }
}


