const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized access. Please log in." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(403).json({ message: "Forbidden. Invalid or expired token." });
    }
}

module.exports = verifyToken;
