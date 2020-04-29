const express = require('express')
const app = express()
const axios = require('axios')

app.get('/', function (req, res) {

    let blob = {
        name: 'Dadamuga Mazino',
        age: 18, location: 'Nazareth',
        message: "Hey there I'm running express server!"
    }

    axios.get('https://api.synthcity.io/synthcity/v1/stats')
        .then(function (response) {
            // handle success
            console.log(response.data)

            res.send({...response.data, ...blob});
        })
        .catch(function (error) {
            // handle error
            console.log(error)
            res.send('something went wrong');
        })

});

app.listen(3000)