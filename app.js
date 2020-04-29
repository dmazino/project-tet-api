const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send('Hey there I\'m running express server!\n')
})

app.listen(3000)