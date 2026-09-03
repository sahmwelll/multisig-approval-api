import express from 'express';
import proposalRoutes from './routes/proposals';
import signatureRoutes from './routes/signatures';

const app = express();
app.use(express.json());

app.use('/proposals', proposalRoutes);
app.use('/signatures', signatureRoutes);

app.get('/health', (req, res) => res.send('OK'));

export default app;