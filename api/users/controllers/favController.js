module.exports = app =>{
    const {notExistOrError,existOrError,countItensInCollections,validId,checkIfItemExists} = app.api.global

    const saveFavorite = async(req,res)=>{
        const idReceita = req.body.receita_id
        const idUsuario = req.body.usuario_id

        try{
            validId(idReceita, "Id da receita invalido")
            

            const checkRecipe  = await app.db("receitas")
                                            .where({receita_id:idReceita}).first()

            const checkUser = await app.db("usuarios").where({usuario_id:idUsuario}).first()

            existOrError(checkRecipe,"Receita inválida")
            existOrError(checkUser, "Necessario estar autenticado para realizar esta operação")
        }
        catch(err){
            return res.status(404).send(err)
        }

        await app.db("favoritos")
                 .insert({receita_id:idReceita,usuario_id:idUsuario})
                 .then(()=>res.status(200).send("Receita favoritada com sucesso"))
                 .catch( err => res.status(500).send("Houve um erro,"+err))
    }

    const limit = 3

    const getFavorite = async(req,res) =>{
        const page = req.query.page || 1
        const idUser = req.body.usuario_id

        try{
            const checkUser = await app.db("usuarios").where({usuario_id:idUser}).first()

            existOrError(checkUser, "Necessario estar autenticado para realizar esta operação")
        }catch(err){
            return res.status(404).send(err)
        }

        const result = await app.db('favoritos')
            .where({usuario_id:idUser})
            .count()
            .first()

        const count = JSON.parse(JSON.stringify(result))
        let total = 0;

        for (var value in count) {
            total = count[value]
        }

        await app.db('favoritos')
                 .select(
                    "receitas.receita_id",
                    "receitas.nome_receita",
                    "receitas.modo_preparo",
                    "receitas.local_origem",
                    "receitas.receita_img_url",
                    "receitas.tempo_preparo",
                    "usuarios.usuario_id",
                    "usuarios.username"
                 )
                 .innerJoin('receitas','receitas.receita_id','favoritos.receita_id')
                 .innerJoin('usuarios','usuarios.usuario_id','favoritos.usuario_id')
                 .where({'favoritos.usuario_id':idUser})
                 .limit(limit)
                 .offset(page*limit-limit)
                 .then(async receitaFavorita => {
                    for (let receita in receitaFavorita) {
                        await app.db('ingredientes')
                            .select(
                                "ingredientes.nome_ingrediente",
                                "ingredientes.medida"
                            )
                            .where({ receita_id: receitaFavorita[receita].receita_id })
                            .then(ingredientes => {
                                const parsedIngredientes = JSON.parse(JSON.stringify(ingredientes))
                                receitaFavorita[receita] = { ...receitaFavorita[receita], ingredientes: parsedIngredientes }
                            })
                    }
    
                    res.status(200).json({
                        data:receitaFavorita,
                        total,
                        limit
                    })
                })
                .catch(err => res.status(500).send(err))
    }

    const getFavoriteById = async(req,res)=>{
        const idUser = req.body.usuario_id
        const idReceita = req.params.id

        try{
            const checkUser = await app.db("usuarios").where({usuario_id:idUser}).first()
            const checkRecipe = await app.db("favoritos").where({receita_id:idReceita,usuario_id:idUser}).first()

            existOrError(checkUser,"É preciso estar autenticado para realizar esta operação")
            existOrError(checkRecipe, "Receita não se encontra na lista deste usuário")
        }catch(err){
            return res.status(404).send(err)
        }

        await app.db('favoritos')
                 .select()
                 .innerJoin('receitas','receitas.receita_id','favoritos.receita_id')
                 .innerJoin('usuarios','usuarios.usuario_id','favoritos.usuario_id')
                 .where({'favoritos.usuario_id':idUser,'favoritos.receita_id':idReceita})
                 .then(async receitaFavorita => {
                    for (let receita in receitaFavorita) {
                        await app.db('ingredientes')
                            .select(
                                "ingredientes.nome_ingrediente",
                                "ingredientes.medida"
                            )
                            .where({ receita_id: receitaFavorita[receita].receita_id })
                            .then(ingredientes => {
                                const parsedIngredientes = JSON.parse(JSON.stringify(ingredientes))
                                receitaFavorita[receita] = { ...receitaFavorita[receita], ingredientes: parsedIngredientes }
                            })
                    }
    
                    res.status(200).json({
                        data:receitaFavorita
                    })
                })
                .catch(err => res.status(500).send(err))
    }

    const removeFavorite = async (req,res) =>{
        const idReceita = req.params.id
        const idUsuario = req.body.usuario_id

        try{
            const checkUser = await app.db("usuarios").where({usuario_id:idUsuario}).first()
            const checkRecipe = await app.db("favoritos").where({receita_id:idReceita,usuario_id:idUsuario}).first()

            existOrError(checkUser,"É preciso estar autenticado para realizar esta operação")
            existOrError(checkRecipe, "Receita não se encontra na lista deste usuário")
        }catch(err){
            return res.status(404).send(err)
        }

        await app.db("favoritos")
                 .where({receita_id:idReceita,usuario_id:idUsuario})
                 .del()
                 .then(()=>res.status(200).send("Receita favorita removida com sucesso"))
                 .catch( err => res.status(500).send("Houve um erro,"+err))
    }

    return{
        saveFavorite,
        getFavorite,
        getFavoriteById,
        removeFavorite
    }
}