import express from "express";
import bodyParser from "body-parser";
import accountRouter from "./routers/account.js";

const app = express();
app.use(bodyParser.json());

app.use('/account', accountRouter);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

