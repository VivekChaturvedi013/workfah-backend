import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Incoming body:", req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("Missing fields");
      res.status(400).send({ message: 'Name, email and password are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      res.status(400).send({ message: 'User already exists' });
      return;
    }

    // For now: save raw password (later add bcrypt)
    const user = new User({ name, email, password });
    await user.save();
    console.log("User created:", user);

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: '1h' }
    );

    console.log("Token generated");

    res.status(201).send({
      token,
      user: {
        name: user.name,
        email: user.email,
        roles: user.roles, // ✅ include roles
      },
    });

  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).send({ message: 'Internal server error', error: error.message });
  }
});


// Login
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user?.password) {
      res.status(400).send({ message: 'password missing' });
      return;
    }
    
    console.log("Login request body:", req.body);
    console.log("User from DB:", user);
    console.log("Input password:", password);
    console.log("Stored (hashed) password:", user?.password);
    const valid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", valid);
    if (!valid) {
      res.status(400).send({ message: 'Invalid credentials' });
      return;
    }
console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(201).send({
      token,
      user: {
        name: user.name,
        email: user.email,
        roles: user.roles, // ✅ include roles
      },
    });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
});





export default router;
