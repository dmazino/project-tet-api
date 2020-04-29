const express = require('express')
const app = express()

app.get('/', function (req, res) {

    let response = {
        name: 'Dadamuga Mazino',
        age: 18, location: 'Nazareth',
        message: "Hey there I'm running express server!"
    }

    res.send(response);
});

app.listen(3000)