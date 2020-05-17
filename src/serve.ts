import express from 'express';
import { PORT } from './serve.conf';

const app = express();
const HTTP_PORT: number = Number(process.env['PORT']) || PORT;
console.log(process.env['PORT'])


app.listen(HTTP_PORT, () => {
  console.log(`SERVER LISTENING ON PORT: ${HTTP_PORT}`);
});