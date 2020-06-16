import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export class TodoAccess {
  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.TODO_TABLE
  ) {}

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
      await this.docClient.put({
          TableName: this.todosTable,
          Item: todoItem
      }).promise();
      return todoItem;
  }

  async getAllTodosByUser(userId: string): Promise<TodoItem[]> {
      const result = await this.docClient.query({
          TableName: process.env.TODO_TABLE,
          IndexName: process.env.INDEX_NAME,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }
      }).promise();

      return result.Items as TodoItem[];
  }

  async getTodoById(id: string): Promise<TodoItem>{
    const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues:{
            ':todoId': id
        }
    }).promise()

    const item = result.Items[0];
    return item as TodoItem;
}

async deleteTodoById(todoId: string): Promise<void> {
    this.docClient
        .delete({
            TableName: this.todosTable,
            Key: {
                todoId
            },
        })
        .promise();
}

async updateTodoById( userId: string, todoId:string, updatedTodo:UpdateTodoRequest){
    await this.docClient.update({
        TableName: this.todosTable,
        Key: {
            userId,
            todoId
          },
        UpdateExpression:
          'set #name = :name, #dueDate = :duedate, #done = :done',
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':duedate': updatedTodo.dueDate,
          ':done': updatedTodo.done
        },
        ExpressionAttributeNames: {
          '#name': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done'
        }
      }).promise()
}

public async setAttachmentUrl(userId: string,
    todoId: string,
    attachmentUrl: string,
): Promise<void> {
    this.docClient
        .update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
              },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl,
            },
            ReturnValues: 'UPDATED_NEW',
        })
        .promise();
}

}
