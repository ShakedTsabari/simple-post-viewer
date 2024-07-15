const fs = require('fs');
const path = require('path');

const requestLogger = (req, res, next) => {
  const logEntry = `
    Time: ${new Date()}
    Method: ${req.method}
    Path: ${req.path}
    Body: ${JSON.stringify(req.body)}
    ---`;


  const logFilePath = path.join(__dirname, 'log.txt');
  fs.appendFile(logFilePath, logEntry + '\n', (err) => {
    if (err) {
      console.error('Error logging request:', err);
    }
  });

  next();
};

module.exports = requestLogger;

