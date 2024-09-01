import express from 'express';
import { connectDB } from './config/database';
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
