import {Router} from 'express';

const endpoint = "/data";

const router = Router();

// GET /data/businesses
// Get all businesses
// Response: { businesses: Business[] }

router.get(endpoint + '/businesses', (req, res) => {
    res.send('Hello World!');
});

export default router;