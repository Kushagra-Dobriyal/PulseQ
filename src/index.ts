import express from 'express'
import dotenv from 'dotenv'
import jobRoutes from './routes/job.routes.js'
import type { Request,Response } from 'express';

dotenv.config();
const app=express();

const PORT=process.env.PORT || 3000;
app.use(express.json()) 

app.use('/job',jobRoutes);

app.get('/',(req:Request,res:Response)=>{
   res.send('F off this is my backend server ');
})
app.get('/health',(req:Request,res:Response)=>{
    res.json({
        "Health_Staus":'ok'
    })
})

app.listen(PORT,()=>{
    console.log("The server is serving now....");
})