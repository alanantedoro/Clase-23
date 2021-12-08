import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import config from './config.js'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import authWebRouter from './routers/web/auth.js'
import homeWebRouter from './routers/web/home.js'
import productosApiRouter from './routers/api/productos.js'

import addProductosHandlers from './routers/ws/productos.js'
import addMensajesHandlers from './routers/ws/mensajes.js'


const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

io.on('connection', async socket => {
    addProductosHandlers(socket, io.sockets)
    addMensajesHandlers(socket, io.sockets)
});


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('view engine', 'ejs');

// const advancedOptions = {
//     useNewUrlParser: true,
//     userUnifiedTopology: true,
// }

app.use(session({
    // store: MongoStore.create({
    //     mongoUrl: 'mongodb+srv://USER:PASSWORD@cluster0.pkmwi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    //     mongoOptions: advancedOptions
    // }),

    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 
    }
}))

app.use(productosApiRouter)

app.use(authWebRouter)
app.use(homeWebRouter)

const connectedServer = httpServer.listen(config.PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
