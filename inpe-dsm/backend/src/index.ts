import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dataRoutes from './routes/data';
import uploadRoutes from './routes/upload';
import cacheRoutes from './routes/cache';
import variablesRoutes from './routes/variables';
import exportRoutes from './routes/export';

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

app.use('/api/data', dataRoutes);
app.use('/api/data', uploadRoutes);
app.use('/api/cache', cacheRoutes);
app.use('/api/data', exportRoutes);
app.use('/api', variablesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
