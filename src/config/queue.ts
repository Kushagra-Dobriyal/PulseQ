import { Queue } from "bullmq";

export const jobQueue=new Queue('jobs',{
    connection:{
        port:parseInt(process.env.REDIS_PORT || '6379',10),
        host:process.env.REDIS_HOST|| '127.0.0.1'
    },
    defaultJobOptions:{
        attempts:3,
        backoff:{
            type:'exponential',
            delay:1000
        },
        removeOnComplete:{count:100},
        removeOnFail:{count:50}
    }
});

jobQueue.on('error',( err:Error)=>{console.log('[Queue got an error]',err.message)});