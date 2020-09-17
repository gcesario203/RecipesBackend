const app = require('express')()
const port = 3333
const consign = require('consign')
const db = require('./config/db')

app.db = db

consign()
    .include('./config')
    .then('./config/middlewares.js')
    .then('./api')
    .into(app)

app.listen(port, ()=>{
    console.log('Backend iniciado')
})