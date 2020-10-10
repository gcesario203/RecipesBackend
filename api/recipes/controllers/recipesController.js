module.exports = app =>{
    const {notExistOrError,existOrError,countItensInCollections,validId,checkIfItemExists} = app.api.global

    const save = async(req,res)=>{
        const recipe = {...req.body}
        
        if(req.params.id) recipe.receita_id = req.params.id

        try{
            existOrError(recipe.nome_receita,"nome da receita não informado")
            existOrError(recipe.modo_preparo,"modo de preparo da receita não informado")
            existOrError(recipe.local_origem,"local de origam da receita não informado")
            existOrError(recipe.tempo_preparo,"modo de preparo receita não informado")
            existOrError(recipe.usuario_id,"criador da receita não informado")
        }catch(msg){
            return res.status(400).send(msg)
        }

        if (recipe.receita_id) {
            app.db('receitas')
                .update(recipe)
                .where({ receita_id: recipe.receita_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('receitas')
                .insert(recipe)
                .then(_ => res.status(201).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const limit = 3

    const get = async(req,res) =>{
        const page = req.query.page || 1

            const result = await countItensInCollections('receitas','receita_id')
            const count = parseInt(result.count)
    

        app.db('receitas')
            .select('receita_id', 'nome_receita', 'modo_preparo','local_origem','tempo_preparo','usuario_id')
            .limit(limit).offset(page * limit - limit)
            .then(receitas => res.json({ data: receitas, count, limit }))
            .catch(err => res.status(500).send(err))
    }

    const getById = async(req,res)=>{
        try {
            validId(req.params.id, "Id invalido")

            const existId = await checkIfItemExists('receitas',req.params.id)
            
            existOrError(existId,'Receita inexistente')
        } catch (err) {
            return res.status(400).send(err)
        }

        app.db('receitas')
        .select('receita_id', 'nome_receita', 'modo_preparo','local_origem','tempo_preparo','usuario_id')
            .where({receita_id: req.params.id})
            .then(receita=> res.status(200).json({
                data:receita
            }))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req,res) =>{
        try {
            validId(req.params.id, "ID invalido")
            const rowsDeleted = await app.db('receitas')
                .where({ receita_id: req.params.id })
                .del()

            try {
                existOrError(rowsDeleted, 'receita não encontrada')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            res.status(204).send()
        } catch (msg) {
            return res.status(500).send(msg)
        }
    }

    return{
        save,
        get,
        getById,
        remove
    }
}