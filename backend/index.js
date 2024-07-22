const express = require('express');
const logger = require('./middleware/logger');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(logger);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

//Get all notes
mongoose.connect(process.env.MONGODB_CONNECTION_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

app.use('/users', usersRouter);
app.use('/login', loginRouter);

const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Note = require('./models/note');

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
    const { content , user , email } = req.body;
    console.log("server got: " + content);   
    if (!content || !user || !email) {
        return res.status(400).json({ error: 'Missing fields in the request' });
    }


    const maxId = await Note.find().sort({ id: -1 }).limit(1);
    const newId = maxId[0].id + 1;

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    //const user = await User.findById(decodedToken.id)

    const note = new Note({
        id: newId,
        title: "new note",
        author: {
            name: user.toString(),
            email: email.toString()
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
    const { content } = req.body;
    const id = parseInt(req.params.id);
    console.log('id: ' + id);

    if (!content) {
        return res.status(400).json({ error: 'Missing fields in request' });
    }
    console.log(req.headers.authorization);


    try {
        //make sure user is the author of the note
        console.log('req.headers: ' + req);
        const token = req.headers.Authorization.split(' ')[1];
        console.log('token: ' + token);
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decodedToken: ' + decodedToken);
        if (!decodedToken.id) {
          return response.status(403).json({ error: 'token invalid' })
        }
        else {
            console.log('valid token');
        }


        console.log('id: ' + id);
        
        const note = await Note.findOneAndUpdate({ id: id }, { content : content }, { new: true });
        console.log('note: ' + note);

        if (!note) 
            return res.status(404).json({ error: 'Note not found' });
        res.status(200).json({note: note});
    } catch (err) {
        res.status(500).json({ error: 'Failed to update note!' });
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
})