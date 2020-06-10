import express from 'express';
import cors from 'cors';
import mongoose, { ConnectionOptions } from 'mongoose';
import { PORT } from './serve.conf';
import { dbConnectionUri } from './uris.conf';
import { globalRouter } from './routes/index.routes';

const app = express();
const HTTP_PORT: number = Number(process.env['PORT']) || PORT;

app.use(express.json());
app.use(cors());
app.use('/images', express.static('buzzUploads'));
app.use(globalRouter);

const connectOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}
mongoose.connect(dbConnectionUri, connectOptions)
  .then(() => {
    console.log("mongoose is connected");
    app.listen(HTTP_PORT, () => {
      console.log(`SERVER LISTENING ON PORT: ${HTTP_PORT}`);
    });
  }, err => {
    console.log(err);
    process.exit(1);
  });