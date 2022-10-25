import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';

import swaggerDoc from '../docs/swagger.json';

/**
 * Base URL
 */
const BASE_URL = '/api/v1';
/**
 * Initialize express server
 */
const app = express();

/**
 * Server configuration
 */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  `${BASE_URL}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc)
);

/**
 * Listen on / and return sample response
 */
app.get(`${BASE_URL}/health`, (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is healthy!!' });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`server running on ${PORT}`);
});
