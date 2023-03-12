import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Hello World👋, go to /docs to visit the documentation page',
    });
});

export default router;
