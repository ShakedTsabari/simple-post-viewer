const express = require('express');
const logger = require('./middleware/logger');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(logger);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);


//Get all notes
mongoose.connect(process.env.MONGODB_CONNECTION_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

const jwt = require('jsonwebtoken');
const Note = require('./models/note');
const User = require('./models/user');

app.get('/notes', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10 
        const skipIndex = (page - 1) * limit;

        const totalNotes = await Note.countDocuments();
        const notes = await Note.find().sort({ id: 1 }).skip(skipIndex).limit(limit);

        res.status(200).json({
            notes: notes,
            totalNotes: totalNotes,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Get the i'th note
app.get('/notes/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const note = await Note.find().sort({ id: 1 }).skip(id-1).limit(1);

        if (note.length === 0)
            return res.status(404).json({ error: 'Note not found' });

        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// Create a new note
app.post('/notes', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET)
    
        if (!token || !decodedToken.id)   {
            return res.status(401).json({ error: 'Token missing or invalid.' });
        }

        const { content , name , email } = req.body;
        if (!content || !name || !email) {
            return res.status(400).json({ error: 'Missing fields in the request' });
        }

        const loggedInUser = await User.findById(decodedToken.id);
        if (!loggedInUser) {
            return res.status(401).json({ error: 'Unauthorized user' });
        }

        if (loggedInUser.username !== name || loggedInUser.email !== email) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        const maxId = await Note.find().sort({ id: -1 }).limit(1);
        const newId = maxId[0].id + 1;

        const note = new Note({
            id: newId,
            title: "new note",
            author: {
                name: name.toString(),
                email: email.toString()
            },
            content: content,
        });

        const newNote = await Note.create(note);
        res.status(201).json({note: newNote});

    } catch (err) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// Update the i'th note
app.put('/notes/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const id = parseInt(req.params.id);

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id)   {
            return res.status(401).json({ error: 'Token missing or invalid.' });
        }

        // const note1 = await Note.findOne({ id: id });
        // authorUser = await User.findOne({ _id: decodedToken.id });
        // if (!authorUser) {
        //     return res.status(404).json({ error: 'Author not found' });
        // }
        
        // if (authorUser._id.toString() !== decodedToken.id) {
        //     return res.status(403).json({ error: 'Unauthorized to edit note' });
        // }

        if (!content) {
            return res.status(400).json({ error: 'Missing fields in request' });
        }

        const note = await Note.findOne({ id: id });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (note.author.name !== decodedToken.username) {
            return res.status(403).json({ error: 'Forbidden user' });
        }
        const Updatednote = await Note.findOneAndUpdate({ id: id }, { content : content }, { new: true });
        // if (!Updatednote) 
        //     return res.status(404).json({ error: 'Note not found' });

        res.status(200).json({note: Updatednote});
    } catch (err) {
        res.status(500).json({ error: 'Failed to update note!' });
    }
});

// Delete the i'th note
app.delete('/notes/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id)   {
            return res.status(401).json({ error: 'Token missing or invalid.' });
        }
        // const note = await Note.findOneAndDelete({ id: req.params.id });
        // if (!note) 
        //     return res.status(404).json({ error: 'Note not found' });
        const note = await Note.findOne({ id: req.params.id });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (note.author.name !== decodedToken.username) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        await Note.findOneAndDelete({ id: req.params.id });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
