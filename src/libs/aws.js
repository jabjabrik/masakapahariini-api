import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import config from '../configs/index.js';

const { region, accessKeyId, secretAccessKey, tableName, bucketS3 } = config;

const params = {
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
};

// * S3
const s3Client = new S3Client(params);

// * dynamodb
const ddbClient = new DynamoDBClient(params);

export default { s3Client, ddbClient, tableName, bucketS3 };
