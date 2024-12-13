import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const setCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000,
  });
};

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const { password: _, ...info } = user._doc;
    const token = generateToken(user._id);

    setCookie(res, token);
    res.status(200).json({ user: info, token });
  } catch (error) {
    console.error('Error on login:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { fullname, email, password, gender, address, role } = req.body;

  try {
    if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters long" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      fullname, 
      email, 
      password: hashedPassword, 
      gender, 
      address, 
      role,
    });
    await newUser.save();

    const { password: _, ...info } = newUser._doc;

    res.status(201).json({ user: info });
  } catch (error) {
    console.error('Error on register:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logged out" });
};