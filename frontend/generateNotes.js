const fs = require('fs');
const path = require('path');

function generate(num) {
    const notes = [];
    for (let i = 1; i <= num; i++) {
        notes.push({
            id: i,
            title: `Note ${i}`,
            author: {
                name: `Author ${i}`,
                email: `mail_${i}@gmail.com`
            },
            content: `Content for note ${i}`
        });
    }
    return { notes };
}

const filePath = path.join(__dirname, 'data', 'notes.json');
const numNotes = parseInt(process.argv[2], 10);
const notes = generate(numNotes);

// Convert notes object to JSON string
const jsonString = JSON.stringify(notes, null, 2);

// Ensure the directory exists
const dirPath = path.dirname(filePath);
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFile(filePath, jsonString, function (err) {
    if (err) throw err;
    console.log('Replaced!');
});