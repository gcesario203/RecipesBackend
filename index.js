const app = require('express')()
const port = 3333
const consign = require('consign')
const admin = require('./config/admin')
const db = require('./config/db')

app.db = db
app.admin = admin

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/global.js')
    .then('./api/users/controllers')
    .then('./api/users/routes')
    .then('./api/auth/controllers')
    .then('./api/auth/routes')
    .then('./api/categories/controllers')
    .then('./api/categories/routes')
    .into(app)

app.listen(port, ()=>{
    console.log('Backend iniciado')
})