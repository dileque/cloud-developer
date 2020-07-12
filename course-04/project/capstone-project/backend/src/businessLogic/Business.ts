import * as uuid from "uuid";
import { CreateItemRequest } from "../requests/CreateItemRequest";
import { Item } from "../models/Item";
import { Access } from "../dataAccess/Access";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId } from "../lambda/utils";
import { UpdateItemRequest } from "../requests/UpdateItemRequest";

const access = new Access();

export const getItem = async (id: string ): Promise<Item> => {
    return await access.getItemById(id);
};

export const getAllItemsByUser = async (event: APIGatewayProxyEvent): Promise<Item[]> => {
    const userId = getUserId(event);
    return await access.getAllItemsByUser(userId);
};

export const createItem = async (request: CreateItemRequest, event: APIGatewayProxyEvent): Promise<Item> => {
    
    const userId = getUserId(event);
    const itemId = uuid.v4()
    const bucketName = process.env.IMAGES_S3_BUCKET
    const title = request.title;
    const desc = request.desc;


  return await access.createItem({
    id: itemId,
    createdAt: new Date().toISOString(),
    ...request,
    ImageUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`,
    userId : userId,
    modifiedAt: new Date().toISOString(),
    title : title,
    desc : desc
  });
};

export const updateAttachmentUrl = async (userId: string, id: string, attachmentUrl: string): Promise<void> => {
    return await access.setAttachmentUrl(userId, id, attachmentUrl);
};

export const updateItem = async (userId: string, id: string, request: UpdateItemRequest): Promise<void> => {
    return await access.updateItemById(userId, id, request);
};

export const deleteItem = async (id: string ): Promise<void> => {
    return await access.deleteItemById(id);
};

export async function getUploadUrl(itemId:string){
    return await access.getUploadUrl(itemId)
  }