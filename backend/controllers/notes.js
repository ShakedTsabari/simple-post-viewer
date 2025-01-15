const express = require('express');
const Note = require('../models/note');

const router = express.Router();

// Get all notes with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skipIndex = (page - 1) * limit;

        const totalNotes = await Note.countDocuments();
        const notes = await Note.find().sort({ id: 1 }).skip(skipIndex).limit(limit);

        res.status(200).json({ notes, totalNotes });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Get a specific note by ID
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findOne({ id: req.params.id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// Create a new note
router.post('/', async (req, res) => {
    try {
        const { content, name, email } = req.body;

        if (!content || !name || !email) {
            return res.status(400).json({ error: 'Missing fields in request' });
        }

        const maxId = await Note.find().sort({ id: -1 }).limit(1);
        const newId = maxId[0].id + 1;

        const note = new Note({
            id: newId,
            title: "New Note",
            author: { name, email },
            content,
        });

        const newNote = await Note.create(note);
        res.status(201).json({ note: newNote });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// Update a note
router.put('/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const note = await Note.findOne({ id: req.params.id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (note.author.name !== req.user.username) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        note.content = content;
        const updatedNote = await note.save();
        res.status(200).json({ note: updatedNote });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findOne({ id: req.params.id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (note.author.name !== req.user.username) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        await note.remove();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;
