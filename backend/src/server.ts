import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { initUsersTable } from './models/User';
import { initAnswersTable } from './models/Answer';
import { initEssaysTable } from './models/Essay';
import { initQuestionsTable } from './models/Question';
import { initResultsTable } from './models/Result';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

app.use('/api', apiRoutes);

const startServer = async () => {
  try {
    await initUsersTable();
    await initAnswersTable();
    await initEssaysTable();
    await initQuestionsTable();
    await initResultsTable();
    
    console.log('Database initialized successfully');
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

startServer(); 