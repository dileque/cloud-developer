import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Item } from "../models/Item";
import { UpdateItemRequest } from '../requests/UpdateItemRequest'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

export class Access {
  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly blogTable = process.env.BLOG_TABLE,
      private readonly ImagesBucket = process.env.IMAGES_S3_BUCKET) {}

  async createItem(item: Item): Promise<Item> {
      await this.docClient.put({
          TableName: this.blogTable,
          Item: item
      }).promise();
      return item;
  }

  async getAllItemsByUser(userId: string): Promise<Item[]> {
      const result = await this.docClient.query({
          TableName: process.env.BLOG_TABLE,
          IndexName: process.env.INDEX_NAME,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }
      }).promise();

      return result.Items as Item[];
  }

  async getItemById(id: string): Promise<Item>{
    const result = await this.docClient.query({
        TableName: this.blogTable,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues:{
            ':id': id
        }
    }).promise()

    const item = result.Items[0];
    return item as Item;
}

async deleteItemById(id: string): Promise<void> {
    this.docClient
        .delete({
            TableName: this.blogTable,
            Key: {
                id
            },
        })
        .promise();
}

async updateItemById( userId: string, id:string, updatedItem:UpdateItemRequest){
    await this.docClient.update({
        TableName: this.blogTable,
        Key: {
            userId,
            id
          },
        UpdateExpression:
          'set #title = :title, #desc = :desc',
        ExpressionAttributeValues: {
          ':title': updatedItem.title,
          '::desc': updatedItem.desc
        },
        ExpressionAttributeNames: {
          '#title': 'title',
          '#desc': 'desc'
        }
      }).promise()
}

public async setAttachmentUrl(userId: string,
    id: string,
    attachmentUrl: string,
): Promise<void> {
    this.docClient
        .update({
            TableName: this.blogTable,
            Key: {
                userId,
                id
              },
            UpdateExpression: 'set ImageUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':ImageUrl': attachmentUrl,
            },
            ReturnValues: 'UPDATED_NEW',
        })
        .promise();
}

async getUploadUrl(itemId:string){
    return await s3.getSignedUrl('putObject', {
      Bucket: this.ImagesBucket,
      Key: itemId,
      Expires: 300
    })
  }
}
