import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import AuthRouter from './routes/auth.route.js';
import connectDB from './config/db.js';
import ProductRouter from './routes/product.route.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});