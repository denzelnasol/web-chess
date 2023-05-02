import express from "express";
import bodyParser from "body-parser";
import accountRouter from "./routers/account.js";
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const apiRouter = express.Router();
apiRouter.use('/account', accountRouter);
app.use('/api', apiRouter);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

