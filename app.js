const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 8080;
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: '' }));
app.set('view engine', '.hbs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const fs = require('fs');

app.get('/', (req, res) => {
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cargar los datos de productos');
        }

        const products = JSON.parse(data);

        const dataToSend = {
            products: products
        };

        res.render('home', dataToSend);
    });
});

app.get('/realtimeproducts', (req, res) => {
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cargar los datos de productos');
        }

        const products = JSON.parse(data);

        const dataToSend = {
            products: products
        };

        res.render('realTimeProducts', dataToSend);
    });
});

app.post('/realtimeproducts', (req, res) => {
    const { title, price } = req.body;

    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cargar los datos de productos');
        }

        const products = JSON.parse(data);

        const newProduct = { title, price };
        products.push(newProduct);

        const updatedData = JSON.stringify(products, null, 2);

        fs.writeFile('productos.json', updatedData, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al agregar el nuevo producto');
            }

            io.emit('actualizarProductos', newProduct);

            res.redirect('/realtimeproducts');
        });
    });
});

const server = http.createServer(app);
const io = socketIo(server); 

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('agregarProducto', (newProduct) => {
        io.emit('actualizarProductos', newProduct);
    });
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
