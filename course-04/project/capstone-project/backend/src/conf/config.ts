const bucketName = process.env.IMAGES_S3_BUCKET;
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION
const tableName = process.env.BLOG_TABLE;
const tableIndexName = process.env.INDEX_NAME;
const isOffline = process.env.IS_OFFLINE;
const auth0JWKSUrl = process.env.Auth0JWKSUrl;

export {
    bucketName,
    signedUrlExpiration,
    tableName,
    tableIndexName,
    isOffline,
    auth0JWKSUrl
};