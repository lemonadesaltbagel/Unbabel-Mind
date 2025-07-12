import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import {initUsersTable} from './models/User';
dotenv.config();
const app=express();
const PORT=process.env.PORT||3001;
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{res.json({message:'Backend API is running'});});
app.use('/api',apiRoutes);
const startServer=async()=>{
try{
await initUsersTable();
console.log('Database initialized successfully');
app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`);});
}catch(error){
console.error('Failed to initialize database:',error);
process.exit(1);
}
};
startServer(); 