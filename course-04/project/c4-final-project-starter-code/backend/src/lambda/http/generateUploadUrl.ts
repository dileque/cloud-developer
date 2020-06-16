import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger';

const logger = createLogger('generateUploadUrl');

const XAWS = AWSXRay.captureAWS(AWS);
let options: AWS.S3.Types.ClientConfiguration = {
    signatureVersion: 'v4',
};
const s3 = new XAWS.S3(options);

const bucketName = process.env.TODO_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

function getUploadUrl(imageId: string): string {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: urlExpiration,
    });
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info("Processing event", event);
    const todoId = event.pathParameters.todoId
    logger.info('Geting signed URL for todo...')
    const uploadUrl = getUploadUrl(todoId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl
      })
    };
  } catch (error) {
    logger.error("Error occured generateUploadUrl", error);
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