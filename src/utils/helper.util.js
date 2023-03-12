import { QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import libs from '../libs/aws.js';
import configs from '../configs/index.js';

const { s3Client, ddbClient, tableName, bucketS3 } = libs;

export const scanOrQueryItemDynamodb = (type, method, params) =>
    new Promise((resolve, reject) => {
        const items = [];
        const limitItems = params.Limit;
        const run = async (ExclusiveStartKey) => {
            try {
                const config = {
                    TableName: tableName[type],
                    ...params,
                    ...(ExclusiveStartKey && { ExclusiveStartKey }),
                };
                const Command = method === 'query' ? QueryCommand : ScanCommand;
                const result = await ddbClient.send(new Command(config));
                const marshalled = [...result.Items].map((e) => unmarshall(e));
                items.push(...marshalled);
                if (limitItems && items.length >= limitItems) {
                    resolve(items.slice(0, limitItems));
                    return;
                }
                if (!result.LastEvaluatedKey) {
                    resolve(items);
                    return;
                }
                run(result.LastEvaluatedKey);
            } catch (err) {
                reject(err);
            }
        };
        run();
    });

export const getImgFromS3 = async (type, id) => {
    const params = { Bucket: bucketS3, Key: `${type}/thumbs/${id}.jpg` };
    const result = await s3Client.send(new GetObjectCommand(params));
    return Buffer.concat(await result.Body.toArray());
};

export const sortingRecipe = (recipes) => {
    const { id, recipe_info, content, ingredient, steps } = recipes;
    const { introduction, body } = content;
    [...body].map(({ heading, paragraph, list }) => ({ heading, paragraph, list }));
    return { id, recipe_info, content: { introduction, body }, ingredient, steps };
};

export const sortingArticle = (article) => {
    const {
        id,
        article_info,
        content: { introduction, body },
    } = article;
    return { id, article_info, contents: { introduction, body } };
};

export const addingPropertyThumb = (type, data) => {
    const { PORT, PROD_URL, NODE_ENV } = configs;
    const url = NODE_ENV === 'dev' ? `localhost:${PORT}` : PROD_URL;
    const getThumbPath = (object) => `http://${url}/${type}s/image/${object.id}`;
    return {
        ...data,
        [`${type}_info`]: {
            thumb: getThumbPath(data),
            ...data[`${type}_info`],
        },
    };
};
