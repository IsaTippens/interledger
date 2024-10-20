import {Router} from 'express';

import client from '../../db/sqlite/database'
import { BusinessRepository } from '../../db/sqlite/repository/business'
import { Database } from 'sqlite';


const router = Router();

// GET /data/businesses
// Get all businesses
// Response: { businesses: Business[] }

router.get('/businesses', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');

    const businessRepo = new BusinessRepository(client);
    businessRepo.getBusinesses().then((businesses) => {
        res.json({ businesses });
    });
});

export default router;