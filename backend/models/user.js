const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String , required: true},
    username: { type: String, required: true },
    passwordHash: { type: String, required: true }
});

userSchema.plugin(mongoosePaginate);
const User = mongoose.model('User', userSchema);

module.exports = User;