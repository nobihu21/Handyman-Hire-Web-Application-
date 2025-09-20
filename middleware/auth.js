const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware to check if user is admin
module.exports.isAdmin = function(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

// Middleware to check if user is handyman
module.exports.isHandyman = function(req, res, next) {
    if (req.user.role !== 'handyman') {
        return res.status(403).json({ message: 'Access denied. Handyman only.' });
    }
    next();
};

// Middleware to check if user is customer
module.exports.isCustomer = function(req, res, next) {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Access denied. Customer only.' });
    }
    next();
}; 