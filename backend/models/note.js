const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const noteSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    title: { type: String, required: true},
    author: {
        name: { type: String, required: true},
        email: { type: String , required: true}
    },
    content: { type: String, required: true }
});

noteSchema.plugin(mongoosePaginate);
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
