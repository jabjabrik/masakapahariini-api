import express from 'express';
import * as recipeController from '../controllers/recipe.controller.js';

const router = express.Router();

router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/info', recipeController.getInformationOfRecipe);
router.get('/recipes/tags/:tags', recipeController.getRecipesByTags);
router.get('/recipes/author/:author', recipeController.getRecipesByAuthor);
router.get('/recipes/category/:category', recipeController.getRecipesByCategory);
router.get('/recipes/keyword/:keyword', recipeController.getRecipeByKeyword);
router.get('/recipes/year/:year', recipeController.getRecipesByUploadYear);
router.get('/recipes/image/:id', recipeController.getImageById);
router.get(
    ['tags', 'author', 'category', 'year', 'image', 'keyword'].map((e) => `/recipes/${e}`),
    recipeController.helper
);
router.get('/recipes/:id', recipeController.getRecipeById);

export default router;
