import {Redis} from "ioredis";  
import dotenv from "dotenv"

dotenv.config();

const redis=new Redis({
    host: (process.env.REDIS_HOST || '127.0.0.1'),
    port:parseInt(process.env.REDIS_PORT || '6379',10),
    lazyConnect:true
})

redis.on('connect',()=>{
    console.log("[Redis] is on")
})

redis.on('error',(err:Error)=>{
    console.log("[Redis got an error]",err.message);
})

export default redis;
