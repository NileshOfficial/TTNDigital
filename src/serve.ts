import express from 'express';

const app = express();

app.listen(3000, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${3000}`);
});