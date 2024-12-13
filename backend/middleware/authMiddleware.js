import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


export const authMiddleware = async (req, res, next) => {
    let token;
  
    try {
      // Check if Authorization header exists and starts with "Bearer"
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        // Extract the token
        token = req.headers.authorization.split(' ')[1];
  
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Attach user information to the request
        req.user = await User.findById(decoded.id).select('-password');
  
        next(); // Move to the next middleware or route handler
      } else {
        res.status(401);
        throw new Error('Not authorized, token missing');
      }
    } catch (error) {
      console.error('error on protect:', error.message);
      res.status(401);
      throw new Error('Not authorized, token invalid');
    }
  };
  
  // Middleware to check admin role
export  const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // User is admin, proceed
    } else {
      res.status(403);
      throw new Error('Access denied, not an admin');
    }
  };
  