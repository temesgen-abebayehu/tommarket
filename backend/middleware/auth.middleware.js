import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const authMiddleware = async (req, res, next) => {
    let token;
  
    try {
        // Extract the token
        token = req.cookies.token;
  
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Attach user information to the request
        req.user = await User.findById(decoded.id).select('-password');
  
        next(); // Move to the next middleware or route handler
      
    } catch (error) {
      console.error('error on authMiddleware:', error.message);
      res.status(401).json({ message: error.message });
    }
  };
  
  // Middleware to check admin role
export  const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // User is admin, proceed
    } else {
      res.status(403).json({ message: 'Not authorized as an admin' });
    }
  };
  