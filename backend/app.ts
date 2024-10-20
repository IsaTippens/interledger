import express, { Request, Response } from 'express';
import router from './routes/data';
import paymentRouter from './routes/payment';

const app = express();
const port = 3000;

app.use("/data", router);
app.use("/payment", paymentRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
}
)
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});