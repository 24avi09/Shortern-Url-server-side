const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const route = require('./route/route')

app.use(bodyparser.json())



mongoose.connect('mongodb+srv://abhi03:UQkqPECmlouMcNjb@cluster1.kwsn7az.mongodb.net/group12Database')
.then( ()=> console.log("MongoDb is connected"))
.catch( err => console.log(err))


app.use('/', route)

app.use((req,res)=> {
    const error = new Error('Path not found')
    return res.status(400).send({status:'Error', error: error.message})
})


app.listen(3000, function () {
    console.log('Express is running on port 3000')
})
