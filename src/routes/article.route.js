import express from 'express';
import * as articleController from '../controllers/article.controller.js';

const router = express.Router();

router.get('/articles', articleController.getAllArticles);
router.get('/articles/info', articleController.getInformationOfArticle);
router.get('/articles/tags/:tags', articleController.getArticlesByTags);
router.get('/articles/author/:author', articleController.getArticlesByAuthor);
router.get('/articles/category/:category', articleController.getArticlesByCategory);
router.get('/articles/keyword/:keyword', articleController.getArticleByKeyword);
router.get('/articles/year/:year', articleController.getArticlesByUploadYear);
router.get('/articles/image/:id', articleController.getImageById);
router.get(
    ['tags', 'author', 'category', 'year', 'image'].map((e) => `/articles/${e}`),
    articleController.helper
);
router.get('/articles/:id', articleController.getArticleById);

export default router;
