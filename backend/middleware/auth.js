const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 10;
const secret = process.env.JWT_SECRET;

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};

function generateAccessToken(validData) {
    const payload = {
        user: validData.user._id
    };
    
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.sendStatus(401);
    }

    const result = verifyAccessToken(authHeader);

    if (!result.success) {
        return res.status(403).json({ error: result.error });
    }

    req.user = result.data;
    next();
}

module.exports = { hashPassword, authenticateToken, verifyAccessToken, generateAccessToken };
