import express, { Request, Response } from 'express';
import router from './routes/data';
import paymentRouter from './routes/payment';
import {} from 'cors';

const app = express();
const port = 3000;

app.use("/data", router);
app.use("/payment", paymentRouter);

app.get('/', (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');

    res.send('Hello World!');
}
)
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});