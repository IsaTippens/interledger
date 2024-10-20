import {Router} from 'express';

const endpoint = "/payment";
const paymentRouter = Router();

// POST /payment/start
// Start the payment process
// Request body: { businessId: number, userWalletAddress: string }
// Response: { confirmationLink: string,  }

paymentRouter.post("/start", (req, res) => {
    let { businessId, userWalletAddress } = req.body;
    if (typeof businessId !== 'number' || typeof userWalletAddress !== 'string') {
        res.status(400).send('Invalid input');
        return;
    }
});


// POST /payment/complete
// Complete the payment process
// Request body: { businessId: number, userWalletAddress: string }
// Response: { message: string }

paymentRouter.post("/complete", (req, res) => {
    let { businessId, userWalletAddress } = req.body;
    if (typeof businessId !== 'number' || typeof userWalletAddress !== 'string') {
        res.status(400).send('Invalid input');
        return;
    }
});

export default paymentRouter;