const User = require('../models/user');
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router()

usersRouter.post('/users', async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        
        // if (!name || !email || !username || !password) {
        //     return res.status(400).json({ error: 'Missing fields in request' });
        // }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            email: email,
            username: username,
            passwordHash: passwordHash
        });

        const newUser = await User.create(user);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

module.exports = usersRouter;