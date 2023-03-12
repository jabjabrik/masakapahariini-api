import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import morgan from 'morgan';
import cors from 'cors';
import * as routes from './src/routes/index.js';
import * as middlewares from './src/middlewares/index.js';
import config from './src/configs/index.js';

const app = express();
const { PORT } = config;
const swaggerDocument = YAML.load('./src/docs/swagger.yaml');

// * middlewares
app.use(morgan('dev'));
app.use(cors());

// * endpoints
app.use('/', routes.rootRoute);
app.use('/', routes.articleRoute);
app.use('/', routes.recipeRoute);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// * error handler
app.use(middlewares.notFoundMiddleware);
app.use(middlewares.errorHandlerMiddleware);

// * app
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`App Running on Port ${PORT}`));
