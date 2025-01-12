const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jwt.verify(token, process.env.SECRET);

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'Token missing or invalid' });
        }

        const loggedInUser = await User.findById(decodedToken.id);
        if (!loggedInUser) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = loggedInUser;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Failed to authenticate' });
    }
};

module.exports = { verifyToken };
