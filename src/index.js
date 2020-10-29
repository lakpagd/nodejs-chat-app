const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
// Variable 'server' is created.
// In 'http' librrary, 'createServer' method allows us to create
// new WebServer. We are passing our Express app 'app' in 'createServer'. 
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection...');
    
    // Send 'Welcome' message to current connection
    socket.emit('message', 'Welcome!!!')
    // this will Emit/Send to everybody but that current connection
    socket.broadcast.emit('message', 'New user has joined.')
    
    // Listen/Capture Event named 'sendMessage' from Client
    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()

        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!')
        }
        // Emit/Display the message captured from client to every connection
        io.emit('message', msg)
        callback()
    })

    // Listen/Capture Event name 'sendLocation' from Client
    socket.on('sendLocation', (location, acknowledge) => {
        io.emit('message', `https://google.com/maps?q=${location.lat},${location.lng}`)
        acknowledge()
    })

    // 
    socket.on('disconnect', () => {
        // Emits message when the connection is disconnected
        io.emit('message', 'A User has left!')
    })
})

// 'server.listen' is used instead of 'app.listen' to start-up
// our http Server 'createServer'.
server.listen(port, () => {
    console.log(`Server is up on PORT: ${port}!`)
})