import { errorHandler } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, 'Unauthorized'));

    // Replace JWT verification with direct token comparison
    const staticToken = "7b7d4a8299f196edccda84a070714a095bc3befd8c9feb6ec57a75fd7fc8318b1b4a3b241cea67492e2993d8495d76b0a44b2c734bc2e0691b48a34a48ad794b";
    
    if (token !== staticToken) return next(errorHandler(403, 'Forbidden'));

    // Assign a mock user object for further middleware
    req.user = {
        id: "admin",      // Replace with real user ID if applicable
        role: "admin"          // Set role to "admin" for privileged access
    };

    next();
};
