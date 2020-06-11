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
    const todoId = uuid.v4();
    const userId = getUserId(event);

    return await todoAccess.createTodo({
        createdAt: new Date().toISOString(),
        done: false,
        dueDate: request.dueDate,
        name: request.name,
        todoId,
        userId,
        attachmentUrl: ""
    });
};

export const updateAttachmentUrl = async (todoId: string, attachmentUrl: string): Promise<void> => {
    return await todoAccess.setAttachmentUrl(todoId, attachmentUrl);
};

export const updateTodo = async (todoId: string, request: UpdateTodoRequest): Promise<void> => {
    return await todoAccess.updateTodoById(todoId, request);
};

export const deleteTodo = async (todoId: string ): Promise<void> => {
    return await todoAccess.deleteTodoById(todoId);
};