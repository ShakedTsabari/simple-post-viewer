const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const Note = require('./models/note');
const User = require('./models/user');
const { use } = require('express/lib/application');

dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        //seedDatabase();
        seedUsers();
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

    // const seedDatabase = async () => {
    //     const notes = [];
    //     const numberOfNotes = 100; 

    //     for (let i = 1; i <= numberOfNotes; i++) {
    //         notes.push({
    //             id: i,
    //             title: `Note ${i}`,
    //             author: { 
    //                 name: `Author ${i}`, 
    //                 email: `author${i}@example.com` 
    //             },
    //             content: `Content of note ${i}.`
    //         });
    //     }

    const seedUsers = async () => {
        const users = [];
        const numberOfUsers = 3;

        for (let i = 1; i <= numberOfUsers; i++) {
            users.push({
                name: `Author ${i}`,
                email: `author${i}`,
                username: `author${i}`,
                passwordHash: `password${i}`
            });
        }

    try {
        //await Note.insertMany(notes);
        //console.log(`${numberOfNotes} notes seeded!`);
        await User.insertMany(users);
        console.log(`${numberOfUsers} users seeded!`);
        console.log('Database seeded!');
    } catch (err) {
        console.error('Failed to seed database', err);
    } finally {
        mongoose.connection.close();
    }
};
