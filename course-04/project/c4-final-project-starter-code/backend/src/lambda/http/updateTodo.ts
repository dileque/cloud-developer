import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { updateTodo } from '../../businessLogic/TodoBusiness';
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { createLogger } from '../../utils/logger';

const logger = createLogger('updateTodo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info("Processing event", event);
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

    await updateTodo(todoId, updatedTodo);

    return {
      statusCode: 200,
      body: ""
    };
  } catch (error) {
    logger.error("updateTodo", error);
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
