const User = require('../models/user');
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router()

usersRouter.post('/', async (req, res) => {
        try {
        const { name, email, username, password } = req.body;
        
        if (!name || !email || !username || !password) {
            return res.status(400).json({ error: 'Missing fields in request' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            username,
            passwordHash
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

usersRouter.get('/', async (req, res) => {
    
    const users = await User.find({})
    res.json(users)
})

module.exports = usersRouter;