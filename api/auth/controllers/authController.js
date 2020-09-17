const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const { authSecret } = require('../../../.env')

module.exports = app =>{
    const signIn = async (req,res) =>{
        const usuarioParametro = {...req.body}
        if(!usuarioParametro.email || !usuarioParametro.senha){
            return res.status(400).send('Informe o usuário e a senha')
        }

        const usuarioDb = await app.db('usuarios')
                                    .where({email:usuarioParametro.email})
                                    .first()

        if(!usuarioDb) return res.status(400).send('Usuário não encontrado')

        const isMatch = bcrypt.compareSync(usuarioParametro.senha,usuarioDb.senha)

        if(!isMatch) return res.status(401).send('Email/Senha invalido')

        const now = Math.floor(Date.now()/1000)

        const payload ={
            id:usuarioDb.id,
            username:usuarioDb.username,
            email:usuarioDb.email,
            admin:usuarioDb.admin,
            iat:now,
            exp:now+(60*60*24*10)
        }

        res.json({
            ...payload,
            token:jwt.encode(payload.authSecret)
        })
    }

    const validateToken = async (req,res) =>{
        const userData = {...req.body} || null
        try {
            if(userData){
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp*1000>new Date())){
                    return res.send(true)
                }
            }
        } catch (err) {
            res.send(false)
        }
    }

    return {
        signIn,
        validateToken
    }
}