import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/error.middleware';
import config from './config';
import routes from './routes';

const port = config.port || 3000;

const app: Application = express();

app.use(morgan('common'));

app.use(bodyParser.json()); //express.json

app.use('/api', routes);

app.get('/', function (_req: Request, res: Response) {
  res.send('Hello World!');
});

app.use(errorMiddleware);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: 'Incorrect URL, kindly check the API docs.',
  });
});

app.listen(3000, function () {
  console.log(`app started on port: ${port}`);
});

export default app;
