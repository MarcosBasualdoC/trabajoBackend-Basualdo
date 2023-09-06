const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 8080;
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

////
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs'); 
app.set('views', path.join(__dirname, 'views'));

////
app.use(express.json());

/////
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//////
app.post('/agregar-producto', (req, res) => {
    const { title, price } = req.body;
    ////

    ///
    io.emit('actualizarProductos', { title, price });

    res.redirect('/realtimeproducts'); 
});


const server = http.createServer(app);
const io = socketIo(server); 

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    //////
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
