import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import { evaluateHandler } from './routes/evaluate';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Setup Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Routes
app.post('/evaluate', upload.single('file'), evaluateHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
