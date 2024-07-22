const jwt = require('jsonwebtoken')
const logoutRouter = require('express').Router()

logoutRouter.post('/', async (request, response) => {
    const token = request.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    
    response.status(200).json({ message: 'logged out' })
    })

module.exports = logoutRouter;