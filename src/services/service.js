import { marshall } from '@aws-sdk/util-dynamodb';
import * as utils from '../utils/helper.util.js';

export const getInformation = async (type) => {
    const params = {
        Select: 'SPECIFIC_ATTRIBUTES',
        ProjectionExpression: `${type}_info.#date, ${type}_info.#author, ${type}_info.#category, ${type}_info.#tags`,
        ExpressionAttributeNames: {
            '#date': 'date',
            '#author': 'author',
            '#category': 'category',
            '#tags': 'tags',
        },
    };
    const result = [...(await utils.scanOrQueryItemDynamodb(type, 'scan', params))];
    const tags = [...new Set(result.flatMap(({ [`${type}_info`]: info }) => info.tags))];
    const categories = [...new Set(result.map(({ [`${type}_info`]: info }) => info.category))];
    const authors = [...new Set(result.map(({ [`${type}_info`]: info }) => info.author))];
    const years = [...new Set(result.map(({ [`${type}_info`]: info }) => info.date.split('-')[0]))].sort(
        (a, b) => a - b
    );
    return { tags, categories, authors, years };
};

export const getAllItems = async (type, Limit) => {
    const params = { ...(Limit && { Limit }) };
    const result = [...(await utils.scanOrQueryItemDynamodb(type, 'scan', params))];
    const sortedResult = [...result].map((e) =>
        type === 'article' ? utils.sortingArticle(e) : utils.sortingRecipe(e)
    );
    const addedPropThumb = [...sortedResult].map((e) => utils.addingPropertyThumb(type, e));
    return addedPropThumb;
};

export const getItemById = async (type, id) => {
    const params = {
        KeyConditionExpression: `id = :id`,
        ExpressionAttributeValues: marshall({ ':id': id }),
    };
    const [result] = [...(await utils.scanOrQueryItemDynamodb(type, 'query', params))];
    if (!result) return false;
    const sortedResult = type === 'article' ? utils.sortingArticle(result) : utils.sortingRecipe(result);
    const addedPropThumb = utils.addingPropertyThumb(type, sortedResult);
    return addedPropThumb;
};

export const getItemByKeyword = async (type, keyword) => {
    const params = {
        FilterExpression: `${type}_info.#keyword = :keywordVal`,
        ExpressionAttributeNames: { '#keyword': 'keyword' },
        ExpressionAttributeValues: marshall({ ':keywordVal': keyword }),
    };
    const [result] = [...(await utils.scanOrQueryItemDynamodb(type, 'scan', params))];
    if (!result) return false;
    const sortedResult = type === 'article' ? utils.sortingArticle(result) : utils.sortingRecipe(result);
    const addedPropThumb = utils.addingPropertyThumb(type, sortedResult);
    return addedPropThumb;
};

export const getItemsByTags = async (type, tags) => {
    const params = {
        ExpressionAttributeNames: { '#tags': 'tags' },
        ExpressionAttributeValues: marshall({ ':tagVal': tags[0] }),
        FilterExpression: `contains(${type}_info.#tags, :tagVal)`,
    };
    const result = await utils.scanOrQueryItemDynamodb(type, 'scan', params);
    const containsTags = [
        ...result.filter(({ [`${type}_info`]: info }) => {
            const _tags = [...info.tags];
            const isMultipleExist = tags.every((tag) => _tags.includes(tag));
            return isMultipleExist;
        }),
    ];
    if (!containsTags.length) return false;
    const sortedResult = [...containsTags].map((e) =>
        type === 'article' ? utils.sortingArticle(e) : utils.sortingRecipe(e)
    );
    const addedPropThumb = [...sortedResult].map((e) => utils.addingPropertyThumb(type, e));
    return addedPropThumb;
};

export const getItemsByAuthor = async (type, author) => {
    const params = {
        FilterExpression: `${type}_info.#author = :authorVal`,
        ExpressionAttributeNames: { '#author': 'author' },
        ExpressionAttributeValues: marshall({ ':authorVal': author }),
    };
    const result = await utils.scanOrQueryItemDynamodb(type, 'scan', params);
    if (!result.length) return false;
    const sortedResult = [...result].map((e) =>
        type === 'article' ? utils.sortingArticle(e) : utils.sortingRecipe(e)
    );
    const addedPropThumb = [...sortedResult].map((e) => utils.addingPropertyThumb(type, e));
    return addedPropThumb;
};

export const getItemsByCategory = async (type, category) => {
    const params = {
        FilterExpression: `${type}_info.#category = :categoryVal`,
        ExpressionAttributeNames: { '#category': 'category' },
        ExpressionAttributeValues: marshall({ ':categoryVal': category }),
    };
    const result = await utils.scanOrQueryItemDynamodb(type, 'scan', params);
    if (!result.length) return false;
    const sortedResult = [...result].map((e) =>
        type === 'article' ? utils.sortingArticle(e) : utils.sortingRecipe(e)
    );
    const addedPropThumb = [...sortedResult].map((e) => utils.addingPropertyThumb(type, e));
    return addedPropThumb;
};

export const getItemsByUploadYear = async (type, year) => {
    const params = {
        FilterExpression: `contains(${type}_info.#date, :yearVal)`,
        ExpressionAttributeNames: { '#date': 'date' },
        ExpressionAttributeValues: marshall({ ':yearVal': year }),
    };
    const result = await utils.scanOrQueryItemDynamodb(type, 'scan', params);
    if (!result.length) return false;
    const sortedResult = [...result].map((e) =>
        type === 'article' ? utils.sortingArticle(e) : utils.sortingRecipe(e)
    );
    const addedPropThumb = [...sortedResult].map((e) => utils.addingPropertyThumb(type, e));
    return addedPropThumb;
};
