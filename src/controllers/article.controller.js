import * as services from '../services/service.js';
import * as utils from '../utils/helper.util.js';

const TYPE = 'article';

export const getInformationOfArticle = async (req, res, next) => {
    try {
        const result = await services.getInformation(TYPE);
        res.status(200).json({
            status: true,
            message: 'Success get information of articles',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllArticles = async (req, res, next) => {
    try {
        const { limit } = req.query;
        const articles = [...(await services.getAllItems(TYPE, parseInt(limit, 10)))];
        res.status(200).json({
            status: true,
            message: 'Success get articles',
            total_data: articles.length,
            data: articles,
        });
    } catch (err) {
        next(err);
    }
};

export const getArticleById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const article = await services.getItemById(TYPE, id);
        if (!article) {
            next({
                message: `Article with id (${id}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get article by id',
            data: article,
        });
    } catch (err) {
        next(err);
    }
};

export const getImageById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const thumb = await utils.getImgFromS3(TYPE, id);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.write(thumb, 'binary');
        res.end(null, 'binary');
    } catch (err) {
        if (err.$metadata.httpStatusCode === 404) {
            next({
                message: `Article thumb with id (${id}) not found`,
                statusCode: 404,
            });
            return;
        }
        next(err);
    }
};

export const getArticleByKeyword = async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const article = await services.getItemByKeyword(TYPE, keyword);
        if (!article) {
            next({
                message: `Article with keyword (${keyword}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get article by keyword',
            data: article,
        });
    } catch (err) {
        next(err);
    }
};

export const getArticlesByTags = async (req, res, next) => {
    try {
        const tagNames = req.params.tags.replace(/_/g, ' ').split('-');
        const articles = await services.getItemsByTags(TYPE, tagNames);
        if (!articles) {
            next({
                message: `Article with tags (${tagNames}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get articles by tags',
            total_data: articles.length,
            data: articles,
        });
    } catch (err) {
        next(err);
    }
};

export const getArticlesByAuthor = async (req, res, next) => {
    try {
        const author = req.params.author.replace(/_/g, ' ');
        const articles = await services.getItemsByAuthor(TYPE, author);
        if (!articles) {
            next({
                message: `Article with author (${author}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get articles by author',
            total_data: articles.length,
            data: articles,
        });
    } catch (err) {
        next(err);
    }
};

export const getArticlesByCategory = async (req, res, next) => {
    try {
        const category = req.params.category.replace(/_/g, ' ');
        const articles = await services.getItemsByCategory(TYPE, category);
        if (!articles) {
            next({
                message: `Article with author (${category}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get articles by category',
            total_data: articles.length,
            data: articles,
        });
    } catch (err) {
        next(err);
    }
};

export const getArticlesByUploadYear = async (req, res, next) => {
    try {
        const { year } = req.params;
        if (typeof year === 'number') {
            next({ message: `Please enter a valid year`, statusCode: 400 });
            return;
        }
        const currentYear = new Date().getFullYear();
        if (year < 2018 || year > currentYear) {
            next({
                message: `Enter the year between 2018 - ${currentYear}`,
                statusCode: 400,
            });
            return;
        }
        const articles = await services.getItemsByUploadYear(TYPE, year);
        if (!articles) {
            next({
                message: `Article with year (${year}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get articles by upload year',
            total_data: articles.length,
            data: articles,
        });
    } catch (err) {
        next(err);
    }
};

export const helper = async (req, res) => {
    const { originalUrl } = req;
    if (originalUrl === '/articles/image') {
        res.json({ message: '/articles/image/:id | please enter id as param' });
    } else {
        res.json({
            message: 'go to /articles/info to get list of items, or /docs to view documentation',
        });
    }
};
