import * as services from '../services/service.js';
import * as utils from '../utils/helper.util.js';

const TYPE = 'recipe';

export const getInformationOfRecipe = async (req, res, next) => {
    try {
        const result = await services.getInformation(TYPE);
        res.status(200).json({
            status: true,
            message: 'Success get information of recipes',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllRecipes = async (req, res, next) => {
    try {
        const { limit } = req.query;
        const recipes = [...(await services.getAllItems(TYPE, parseInt(limit, 10)))];
        res.status(200).json({
            status: true,
            message: 'Success get recipes',
            total_data: recipes.length,
            data: recipes,
        });
    } catch (err) {
        next(err);
    }
};

export const getRecipeById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const recipe = await services.getItemById(TYPE, id);
        if (!recipe) {
            next({
                message: `Recipe with id (${id}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get recipe by id',
            data: recipe,
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
                message: `Recipe thumb with id (${id}) not found`,
                statusCode: 404,
            });
            return;
        }
        next(err);
    }
};

export const getRecipeByKeyword = async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const recipe = await services.getItemByKeyword(TYPE, keyword);
        if (!recipe) {
            next({
                message: `Recipe with keyword (${keyword}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get recipe by keyword',
            data: recipe,
        });
    } catch (err) {
        next(err);
    }
};

export const getRecipesByTags = async (req, res, next) => {
    try {
        const tagNames = req.params.tags.replace(/_/g, ' ').split('-');
        const recipes = await services.getItemsByTags(TYPE, tagNames);
        if (!recipes) {
            next({
                message: `Recipe with tags (${tagNames}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get recipes by tags',
            total_data: recipes.length,
            data: recipes,
        });
    } catch (err) {
        next(err);
    }
};

export const getRecipesByAuthor = async (req, res, next) => {
    try {
        const author = req.params.author.replace(/_/g, ' ');
        const recipes = await services.getItemsByAuthor(TYPE, author);
        if (!recipes) {
            next({
                message: `Recipe with author (${author}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get recipes by author',
            total_data: recipes.length,
            data: recipes,
        });
    } catch (err) {
        next(err);
    }
};

export const getRecipesByCategory = async (req, res, next) => {
    try {
        const category = req.params.category.replace(/_/g, ' ');
        const recipes = await services.getItemsByCategory(TYPE, category);
        if (!recipes) {
            next({
                message: `Recipe with author (${category}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get recipes by category',
            total_data: recipes.length,
            data: recipes,
        });
    } catch (err) {
        next(err);
    }
};

export const getRecipesByUploadYear = async (req, res, next) => {
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
        const recipes = await services.getItemsByUploadYear(TYPE, year);
        if (!recipes) {
            next({
                message: `Recipe with year (${year}) not found`,
                statusCode: 404,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Success get recipes by upload year',
            total_data: recipes.length,
            data: recipes,
        });
    } catch (err) {
        next(err);
    }
};

export const helper = async (req, res) => {
    const { originalUrl } = req;
    if (originalUrl === '/recipes/image') {
        res.json({ message: '/recipes/image/:id | please enter id as param' });
    } else {
        res.json({
            message: 'go to /recipes/info to get list of items, or /docs to view documentation',
        });
    }
};
