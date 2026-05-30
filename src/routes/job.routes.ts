import { type Request, type Response } from "express";
import  express,{ Router } from "express";
import { checkRateLimit } from '../services/ratelimit.service.js'
import { getCache, setCache } from "../services/cache.service.js";

const router:Router=express.Router();

router.post('/', async (req: Request, res: Response) => {
    const ip = req.ip ?? 'unknown';
    const payload = req.body;

    

    const limit = await checkRateLimit(ip);

    if (!limit.allowed) {
        res.set('Retry-After', String(limit.retryAfter));
        return res.status(429).json({
            error: 'Too many requests',
            retryAfter: limit.retryAfter
        });
    }

    const cache = await getCache(payload);
    if (cache) {
        return res.json({ source: 'cache', result: cache });
    }

    const result = {
        processed: true,
        input: payload,
        timeStamp: Date.now(),
    };

    await setCache(payload, result);

    return res.json({ source: 'fresh', result });
});

router.get('/:id', async (req: Request, res: Response) => {
    res.json({ status: 'pending', jobId: req.params.id });
});


export default router ;