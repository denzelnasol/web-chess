import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

// Environment Variables
import * as dotenv from 'dotenv';
dotenv.config();

// Routers
import accountRouter from "./routers/account.js";

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const apiRouter = express.Router();
apiRouter.use('/account', accountRouter);

app.use('/api', apiRouter);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

