import colors from 'colors'
import express from 'express'
import { createServer } from 'http'
import {writeFileSync, readFileSync} from 'fs'
import { Server } from 'socket.io'
import path from 'path'

const __dirname = path.resolve()

// express initi 

const app = express()


// make express server to raw server 

const httpServer = createServer(app)

// socket io 

const io = new Server(httpServer)

io.on('connection',(scoket)=>{
    let newChat = JSON.parse(readFileSync(path.join(__dirname, '/db/chat.json')))
   io.sockets.emit('latestChat', newChat)

    scoket.on('chat',({name, photo, msg})=>{
        
        let oldChat =JSON.parse(readFileSync(path.join(__dirname,'/db/chat.json')))
        oldChat.push({name, photo, msg})
        writeFileSync(path.join(__dirname, '/db/chat.json'), JSON.stringify(oldChat))

        let newChat = JSON.parse(readFileSync(path.join(__dirname, '/db/chat.json')))
        

        io.sockets.emit('latestChat', newChat)

    })
    
}) 


// folder static for notification

app.use(express.static(path.join(__dirname,'')))

// folder static

app.get('/',(req, res) =>{
    res.sendFile(path.join(__dirname,"/public/client.html"))
})


// app listening 


httpServer.listen(5050, ()=>{
    console.log('Server is running on port 5050'.bgMagenta.black);
})