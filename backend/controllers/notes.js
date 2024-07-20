// const jwt = require('jsonwebtoken');
// const User = require('./models/user');
// const Note = require('./models/note');

// app.get('/notes', async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = 10 
//         const skipIndex = (page - 1) * limit;

//         const totalNotes = await Note.countDocuments();
//         const notes = await Note.find().sort({ id: 1 }).skip(skipIndex).limit(limit);

//         res.status(200).json({
//             notes: notes,
//             totalNotes: totalNotes,
//         });
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch notes' });
//     }
// });

// // Get the i'th note
// app.get('/notes/:id', async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         const note = await Note.find().sort({ id: 1 }).skip(id-1).limit(1);

//         if (note.length === 0)
//             return res.status(404).json({ error: 'Note not found' });

//         res.status(200).json(note);
//     } catch (err) {
//         res.status(404).json({ error: 'Failed to fetch note' });
//     }
// });

// // Create a new note
// app.post('/notes', async (req, res) => {
//     const { content } = req.body;
//     console.log("server got: " + content);   
//     if (!content) {
//         return res.status(400).json({ error: 'Missing fields in the request' });
//     }
//     const maxId = await Note.find().sort({ id: -1 }).limit(1);
//     const newId = maxId[0].id + 1;

//     const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET) //handle error
//     if (!decodedToken.id) {
//       return response.status(401).json({ error: 'token invalid' })
//     }
//     const user = await User.findById(decodedToken.id)

//     const note = new Note({
//         id: newId,
//         title: "new note",
//         author: {
//             name: user.name.toString(),
//             email: user.email.toString()
//         },
//         content: content,
//     });

//     try {
//         const newNote = await Note.create(note);
//         console.log('inserted note');
//         res.status(200).json({note: newNote});
//     } catch (err) {
//         console.log('failed to insert note');
//         res.status(500).json({ error: 'Failed to create note' });
//     }
// });

// // Update the i'th note
// app.put('/notes/:id', async (req, res) => {
//     const { content, id } = req.body;
//     if (!content) {
//         return res.status(400).json({ error: 'Missing fields in request' });
//     }
//     try {
//         const note = await Note.findOneAndUpdate({ id: id }, { content : content }, { new: true });
//         if (!note) 
//             return res.status(404).json({ error: 'Note not found' });
//         res.status(201).json({note: note});
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to update note' });
//     }
// });

// // Delete the i'th note
// app.delete('/notes/:id', async (req, res) => {
//     try {
//         const note = await Note.findOneAndDelete({ id: req.params.id });
//         if (!note) 
//             return res.status(404).json({ error: 'Note not found' });
//         res.status(204).end();
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to delete note' });
//     }
// });