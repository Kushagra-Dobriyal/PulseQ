import redis from "../config/redis.js";


const MAX = parseInt(process.env.RATE_LIMIT_MAX || '10', 10);
const WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '60', 10);

interface RateLimit {
    allowed: boolean;
    remaining?: number; 
    retryAfter?: number; 
    count: number;
}

export async function checkRateLimit(ip: string): Promise<RateLimit> {
    const key = `rateLimit:${ip}`; 
    const count = await redis.incr(key);

    // If this is their first request, start the 60-second timer!
    if (count === 1) {
        await redis.expire(key, WINDOW);
    }

    if (count > MAX) {
        const ttl = await redis.ttl(key);
        return { allowed: false, retryAfter: ttl, count };
    }

    return { allowed: true, remaining: MAX - count, count }; 
}