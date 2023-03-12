export default {
    PROD_URL: process.env.PROD_URL,
    NODE_ENV: process.env.NODE_ENV || 'dev',
    PORT: process.env.PORT || 3000,

    // * AWS credentials
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

    // * S3
    bucketS3: process.env.BUCKET_S3,

    // * DynamoDB
    tableName: {
        article: process.env.TABLE_ARTICLE,
        recipe: process.env.TABLE_RECIPE,
    },
};
