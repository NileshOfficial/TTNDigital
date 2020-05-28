import express from 'express';
import cors from 'cors';
import mongoose, { ConnectionOptions } from 'mongoose';
import { PORT } from './serve.conf';
import { authRouter } from './routes/auth.routes';
import { buzzRouter } from './routes/buzz.routes';
import { complaintsRouter } from './routes/complaints.routes';
import { adminRouter } from './routes/admin.routes';
import * as genericMidwares from './controllers/generic.midwares';
import { dbConnectionUri } from './uris.conf';
import * as authMidwares from './controllers/auth.midware';

const app = express();
const HTTP_PORT: number = Number(process.env['PORT']) || PORT;

app.use(express.json());
app.use(cors());
app.use('/images', express.static('buzzUploads'));
app.use('/auth', authRouter);
app.use('/buzz', authMidwares.retrieveAuthHeadersMidware, authMidwares.verifyTokenMidware, buzzRouter);
app.use('/complaints', authMidwares.retrieveAuthHeadersMidware, authMidwares.verifyTokenMidware, authMidwares.validateIdTokenMidware, complaintsRouter);
app.use('/admin', authMidwares.retrieveAuthHeadersMidware, authMidwares.verifyTokenMidware, authMidwares.validateIdTokenMidware, adminRouter);
app.use(genericMidwares.handleWildCardRequests);
app.use(genericMidwares.errorHandlingMidware);


const connectOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}
mongoose.connect(dbConnectionUri, connectOptions);

mongoose.connection.on('error', err => {
  console.log(err);
  process.exit(1);
});

mongoose.connection.on('connected', (err, res) => {
  console.log("mongoose is connected");

  app.listen(HTTP_PORT, () => {
    console.log(`SERVER LISTENING ON PORT: ${HTTP_PORT}`);
  });
});