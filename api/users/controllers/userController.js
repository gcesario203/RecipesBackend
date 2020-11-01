const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{
    const { 
        existOrError,
        equalsOrError,
        notExistOrError,
        validEmail,
        validPassword,
        validId,
        countItensInCollections
    } = app.api.global

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async(req,res)=>{
        const usuario = {...req.body}

        try{
            existOrError(usuario.username,'Nome não informado')
            existOrError(usuario.email,'Email não informado')
            existOrError(usuario.senha,'Senha não informada')
            existOrError(usuario.confirmSenha,'Senha não informada')
            validEmail(usuario.email,'Email invalido')
            validPassword(usuario.senha, 'Senha invalida')
            equalsOrError(usuario.senha, usuario.confirmSenha, "Senhas não se coincidem")

            const userFromDb = await app.db('usuarios')
                    .where({email:usuario.email})
                    .first()

            if(!req.params.id){
                notExistOrError(userFromDb, 'Usuário ja cadastrado')
            }
        }catch(err){
            return res.status(400).send(err)
        }

        usuario.senha = encryptPassword(usuario.senha)

        delete usuario.confirmSenha

        if(req.params.id){
            app.db('usuarios')
            .update(usuario)
            .where({usuario_id: req.params.id })
            .then(_ => res.status(202).send('usuário modificado com sucesso'))
            .catch(err => res.status(500).send(err))
        }else{
            app.db('usuarios')
            .insert(usuario)
            .then(_ => res.status(201).send('usuário cadastrado com sucesso'))
            .catch(err => res.status(500).send(err))
        }
    }

    const limit = 3

    const get = async (req,res)=>{
        const page = req.query.page || 1

        const result = await app.db('categorias')
            .count()
            .first()

        const count = JSON.parse(JSON.stringify(result))
        let total = 0;

        for(var value in count){
            total = count[value]
        }

        app.db('usuarios')
            .select('id','username','email','admin')
            .limit(limit)
            .offset(page*limit-limit)
            .then(usuarios=> res.status(200).json({
                data:usuarios,
                total,
                limit
            }))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req,res) =>{
        try {
            validId(req.params.id, "Id invalido")

            const existId = await app.db('usuarios')
                                    .where({usuario_id:req.params.id})
                                    .first()
            
            existOrError(existId,'Usário inexistente')
        } catch (err) {
            return res.status(400).send(err)
        }

        app.db('usuarios')
            .select('id','username','email','admin')
            .where({usuario_id: req.params.id})
            .then(usuario=> res.status(200).json({
                data:usuario
            }))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req,res) =>{
        try {
            validId(req.params.id, "Id inválido")

            const existId = await app.db('usuarios')
                                    .where({usuario_id:req.params.id})
                                    .first()

            existOrError(existId, 'Usuário inexistente')
        } catch (err) {
            return res.status(400).send(err)
        }

        app.db('usuarios')
            .where({usuario_id : req.params.id})
            .del()
            .then(_=>res.status(200).send('Usuário deletado com sucesso'))
            .catch(err => res.status(400).send(err))
    }

    return {
        save,
        get,
        getById,
        remove
    }
}