import express from 'express';
import cors from 'cors';
import { PORT } from './serve.conf';
import { router } from './routes/routes';

const app = express();
const HTTP_PORT: number = Number(process.env['PORT']) || PORT;

app.use(express.json());
app.use(cors());
app.use('/', router);

app.listen(HTTP_PORT, () => {
  console.log(`SERVER LISTENING ON PORT: ${HTTP_PORT}`);
});