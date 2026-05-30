import { Worker, Job } from "bullmq";
import redis from "../config/redis.js";


// dummy testing code  await new Promise((res) => setTimeout(res, delay));
async function processJob(job: Job): Promise<unknown> {
    const delay = Math.floor(Math.random() * 300) + 200;

    // main testing dummy thing->>>
    await new Promise((res) => setTimeout(res, delay)); // new promise with random timeout meaning: (This will not hinder the flow of exectution and mark the process as promice i.e will be done adn revert back in few unit of time till then can do other work after a random delay time the process will come back with response)
    if (Math.random() < 0.2) {
        // simulting the casual job failure....
        throw new Error(`Job ${job.id} failed intentionally`); // no matter what the promise was juse terminate this instance as this req met some errors and is discarded ,
    }
    return {
        processed: true,
        input: job.data,
        duation: delay,
        timeStamp: Date.now(),
    };
}

// make an object of worker 
// soncole that it is started 
// call the operation with the given data and wait for the result
// after getting the result just add it to redis that the work is done come and take it express
//  close this object code
// ,{ NEW CODE }
// set concurrecny (How many jobs will be send of (Basically sending jobs in fixed size batches to handle multiple jobs))
// also  have to define the connection with concurreny same as we did in redis

const worker = new Worker(
    'jobs',
    async (job: Job) => {
        console.log(`[Worker] picked up job ${job.id} attempt ${job.attemptsMade + 1}`)

        const result = await processJob(job);

        // now store the result in Redis so GET /job/:id can reutrn it

        await redis.set(
            `result: ${job.id}`,
            JSON.stringify({
                status: 'completed',
                result
            }),
            'EX',
            300
        );

        console.log(`[Worker] completed job ${job.id}`);
        return result;
    },
    {
        concurrency: 5,   // process 5 jobs at the same time per worker
        connection: {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: parseInt(process.env.REDIS_PORT || '6379'),
        },
    }
);

worker.on('completed',(job)=>{
    console.log(`[Worker] job ${job.id} done `)
});

worker.on('failed',(job,err:Error)=>{
    console.error(`[Worker] job  ${job?.id} failed - ${err.message}`)
});



