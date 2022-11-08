import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response
} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
  expressjwt,
  GetVerificationKey,
  UnauthorizedError
} from 'express-jwt';
import JwksClient from 'jwks-rsa';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';

import routes from './routes';

import swaggerDoc from '../docs/swagger.json';

/**load environment variables */
dotenv.config();

/**
 * Base URL
 */
export const BASE_URL = '/api/v1';

/**
 * Initialize express server
 */
const app = express();

/** Setuo Swagger-UI */
app.use(
  `${BASE_URL}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc)
);

/**
 * Setup Authorization
 */
const jwtCheck = expressjwt({
  secret: JwksClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKURI ?? ''
  }) as GetVerificationKey,
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ['RS256']
});

app.use(jwtCheck as RequestHandler);

/**
 * Server configuration
 */

/** common error handler */
app.use(function (
  err: UnauthorizedError,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: 'Unauthorized!!!' });
  } else {
    next(err);
  }
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes(BASE_URL));

/**
 * Listen on / and return sample response
 */
app.get(`${BASE_URL}/health`, (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is healthy' });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`server running on ${PORT}`);
});
