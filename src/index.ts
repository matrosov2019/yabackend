import express, {Express} from 'express';
import dotenv from 'dotenv';
import {MainRouter} from './routes';
dotenv.config();

const app: Express = express();
const port: string = process.env.PORT;

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