import express from 'express';
import cors from 'cors';
import { PORT } from './serve.conf';
import { authRouter } from './routes/auth.routes';

const app = express();
const HTTP_PORT: number = Number(process.env['PORT']) || PORT;

app.use(express.json());
app.use(cors());
app.use('/auth', authRouter);

app.listen(HTTP_PORT, () => {
  console.log(`SERVER LISTENING ON PORT: ${HTTP_PORT}`);
});