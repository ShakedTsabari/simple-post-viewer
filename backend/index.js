const express = require('express');
const logger = require('./middleware/logger');
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Note = require('./models/note');
const User = require('./models/user');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(logger);

//Get all notes
mongoose.connect(process.env.MONGODB_CONNECTION_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

    app.post('/users', async (req, res) => {
        try {
            const { name, email, username, password } = req.body;
            
            if (!name || !email || !username || !password) {
                return res.status(400).json({ error: 'Missing fields in request' });
            }

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
        res.status(404).json({ error: 'Failed to fetch note' });
    }
});

// Create a new note
app.post('/notes', async (req, res) => {
    const { content } = req.body;
    console.log("server got: " + content);   
    if (!content) {
        return res.status(400).json({ error: 'Missing fields in the request' });
    }
    const maxId = await Note.find().sort({ id: -1 }).limit(1);
    const newId = maxId[0].id + 1;


    const note = new Note({
        id: newId,
        title: "new note",
        author: {
            name: "new author",
            email: "new@"
        },
        content: content,
    });


    try {
        const newNote = await Note.create(note);
        console.log('inserted note');
        res.status(200).json({note: newNote});
    } catch (err) {
        console.log('failed to insert note');
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// Update the i'th note
app.put('/notes/:id', async (req, res) => {
    const { content, id } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Missing fields in request' });
    }
    try {
        const note = await Note.findOneAndUpdate({ id: id }, { content : content }, { new: true });
        if (!note) 
            return res.status(404).json({ error: 'Note not found' });
        res.status(201).json({note: note});
    } catch (err) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// Delete the i'th note
app.delete('/notes/:id', async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ id: req.params.id });
        if (!note) 
            return res.status(404).json({ error: 'Note not found' });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
