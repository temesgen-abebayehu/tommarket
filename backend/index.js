import express from 'express';
import dotenv from 'dotenv';

import AuthRouter from './routes/auth.route.js';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", AuthRouter);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});