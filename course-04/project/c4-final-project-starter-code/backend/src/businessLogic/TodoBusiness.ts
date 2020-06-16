import * as uuid from "uuid";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import { TodoAccess } from "../dataAccess/TodoAccess";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId } from "../lambda/utils";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const todoAccess = new TodoAccess();

export const getTodo = async (todoId: string ): Promise<TodoItem> => {
    return await todoAccess.getTodoById(todoId);
};

export const getAllTodosByUser = async (event: APIGatewayProxyEvent): Promise<TodoItem[]> => {
    const userId = getUserId(event);
    return await todoAccess.getAllTodosByUser(userId);
};

export const createTodo = async (request: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> => {
    
    const userId = getUserId(event);
    const itemId = uuid.v4()
    const bucketName = process.env.TODO_S3_BUCKET

  return await todoAccess.createTodo({
    todoId: itemId,
    createdAt: new Date().toISOString(),
    ...request,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`,
    userId
  });
};

export const updateAttachmentUrl = async (userId: string, todoId: string, attachmentUrl: string): Promise<void> => {
    return await todoAccess.setAttachmentUrl(userId, todoId, attachmentUrl);
};

export const updateTodo = async (userId: string, todoId: string, request: UpdateTodoRequest): Promise<void> => {
    return await todoAccess.updateTodoById(userId, todoId, request);
};

export const deleteTodo = async (todoId: string ): Promise<void> => {
    return await todoAccess.deleteTodoById(todoId);
};