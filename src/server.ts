import express, { json } from 'express';
import cors from 'cors';
import listingRoutes from './routers/listing';
import foodRouter from './routers/food.router'
import userRouter from './routers/user.router';
import dotenv from 'dotenv';
import { authMiddleware } from './authmidddleware';
dotenv.config();
import { dbconnect } from './configs/database.config';

dbconnect();

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors(
    {
        credentials: true,
        origin: ["http://localhost:4200"]
    }
));

// app.use("/api/foods", foodRouter)
// app.use("/api/users", userRouter)
app.use("/api/listings",listingRoutes);
app.use('/api/users', userRouter);
app.get('/api/protected', authMiddleware, (req, res) => {
  res.send({ message: 'You are authorized', user: (req as any).user });
});


const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});