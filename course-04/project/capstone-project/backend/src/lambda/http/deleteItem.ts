import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register';
import { deleteItem} from '../../businessLogic/Business';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteItem');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info("Processing event", event);
    const itemId = event.pathParameters.itemId;

    await deleteItem(itemId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ""
    };
  }
  catch (error) {
    logger.error("Error occured in deleteItem", error);
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

