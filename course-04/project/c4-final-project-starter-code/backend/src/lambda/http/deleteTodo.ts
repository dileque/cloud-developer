import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { deleteTodo} from '../../businessLogic/TodoBusiness';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteTodo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info("Processing event", event);
    const todoId = event.pathParameters.todoId;

    await deleteTodo(todoId);

    return {
      statusCode: 200,
      body: ""
    };
  }
  catch (error) {
    logger.error("Error occured in deleteTodo", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    };
  }
});

handler.use(
  cors({
    origin: "*",
    credentials: true
  })
);