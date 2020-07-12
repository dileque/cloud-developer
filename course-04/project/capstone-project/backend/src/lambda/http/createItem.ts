import 'source-map-support/register';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateItemRequest } from "../../requests/CreateItemRequest";
import { createItem } from '../../businessLogic/Business';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createItem');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('Processing event:', event);

    const newItemReq: CreateItemRequest = JSON.parse(event.body);
    const newItem = await createItem(newItemReq, event);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: newItem
      })
    };
  } catch (error) {
    logger.error("Error occured in createItem", error);
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
