const express = require('express');
const bodyParser = require('body-parser');

const proxy = require('./api/proxy');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/send', proxy);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});