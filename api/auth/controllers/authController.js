const {authSecret} = require('../../../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signIn = async (req, res) => {
        if(!req.body.email || !req.body.senha){
            return res.status(400).send("Informe usuário e senha")
        }

        const user = await app.db('usuarios')
                        .where({email:req.body.email})
                        .first()

        if(!user) return res.status(400).send("usuário não encontrado")

        const isMatch = bcrypt.compareSync(req.body.senha,user.senha)

        if(!isMatch) return res.status(401).send('Email/Senha inválidos')

        const now = Math.floor(Date.now()/1000)

        const payload = {
            id: user.usuario_id,
            usuario: user.username,
            email:user.email,
            admin:user.admin,
            iat:now,
            exp:now+(60*60*24*1000)
        }

        res.json({
            ...payload,
            token:jwt.encode(payload,authSecret)
        })
    }

    const validateToken = async (req,res)=>{
        const userData = req.body || null

        try {
            if(userData){
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp*1000>new Date())){
                    return res.send(true)
                }
            }
        } catch (msg) {
            res.send(false)
        }
    }

    return {signIn, validateToken}
}