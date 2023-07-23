import express, {Express, Request} from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import {MainRouter} from './routes';
dotenv.config();

const app: Express = express();
const port: string = process.env.PORT;

app.use(cors<Request>())
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use('/api', MainRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})