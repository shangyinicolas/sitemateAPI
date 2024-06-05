// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Dummy product data
let products = [{
        id: 1,
        title: "Product 1",
        description: "Description of product 1"
    },
    {
        id: 2,
        title: "Product 2",
        description: "Description of product 2"
    }
];

// Routes
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedProduct = req.body;
    products = products.map(product => (product.id === id ? updatedProduct : product));
    res.json(updatedProduct);
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    products = products.filter(product => product.id !== id);
    res.send(`Product ${id} deleted.`);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});