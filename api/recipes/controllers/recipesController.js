module.exports = app => {
    const {  existOrError, validId } = app.api.global

    const save = async (req, res) => {
        const recipe = { ...req.body.receita }
        const ingredientes = [...req.body.ingredientes]
        const categorias = [...req.body.categoria_id]

        if (req.params.id) recipe.receita_id = req.params.id

        try {
            existOrError(recipe.nome_receita, "Nome da receita não informado")
            existOrError(recipe.modo_preparo, "Modo de preparo da receita não informado")
            existOrError(recipe.local_origem, "Local de origam da receita não informado")
            existOrError(recipe.tempo_preparo, "Tempo de preparo não informado receita não informado")
            existOrError(recipe.usuario_id, "Criador da receita não informado")
            existOrError(ingredientes, "Receita precisa de ingredientes")
            existOrError(categorias, "A receita precisa de uma categoria")
        } catch (msg) {
            return res.status(400).send(msg)
        }

        let catArray = [];

        for (let categoria in categorias) {
            await app.db("categorias")
                .select('categoria_id')
                .where({ categoria_id: categorias[categoria] })
                .first()
                .then(ctr => { catArray.push(ctr.categoria_id) }

                )
                .catch(err => err)
        }

        if (recipe.receita_id) {
            await app.db.transaction(async trx => {
                await app.db('receitas')
                    .transacting(trx)
                    .where({ receita_id: recipe.receita_id })
                    .update(recipe)
                    .then(async () => {
                        await app.db("categorizar")
                            .del()
                            .where({ receita_id: recipe.receita_id })
                            .then(async () => {
                                for (let categoriaId in catArray) {
                                    await app.db("categorizar")
                                        .transacting(trx)
                                        .insert({ categoria_id: catArray[categoriaId], receita_id: recipe.receita_id })
                                }
                                await app.db("ingredientes")
                                    .del()
                                    .where({ receita_id: recipe.receita_id })
                                    .then(async () => {
                                        for (let lIngredient in ingredientes) {
                                            await app.db("ingredientes")
                                                .transacting(trx)
                                                .insert({ ...ingredientes[lIngredient], receita_id: recipe.receita_id })
                                        }
                                    })
                            })
                    })
                    .then(trx.commit)
                    .catch(trx.rollback)
            })
                .then(() => res.status(200).send("Receita atualizada com sucesso"))
                .catch(() => res.status(500).send("Falha ao atualizar receita"))
        } else {
            await app.db.transaction(async trx => {
                await app.db('receitas')
                    .transacting(trx)
                    .insert(recipe)
                    .then(async receitaId => {
                        for (let categoriaId in catArray) {
                            await app.db("categorizar")
                                .transacting(trx)
                                .insert({ categoria_id: catArray[categoriaId], receita_id: receitaId[0] })
                                .then(() => {
                                    for (let lIngredient in ingredientes) {
                                        app.db("ingredientes")
                                            .transacting(trx)
                                            .insert({ ...ingredientes[lIngredient], receita_id: receitaId[0] })
                                    }
                                })
                        }
                    })
                    .then(trx.commit)
                    .catch(trx.rollback)
            })
                .then(() => res.status(200).send("Receita cadastrada com sucesso"))
                .catch(err => res.status(500).send(err))
        }
    }

    const limit = 3

    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('receitas')
            .count()
            .first()

        const count = JSON.parse(JSON.stringify(result))
        let total = 0;

        for (var value in count) {
            total = count[value]
        }

        await app.db('categorizar')
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
            .innerJoin('receitas', 'receitas.receita_id', 'categorizar.receita_id')
            .innerJoin('usuarios', 'usuarios.usuario_id', 'receitas.usuario_id')
            .limit(limit)
            .offset(page * limit - limit)
            .then(async receitas => {
                for (let receita in receitas) {
                    await app.db('ingredientes')
                        .select(
                            "ingredientes.nome_ingrediente",
                            "ingredientes.medida"
                        )
                        .where({ receita_id: receitas[receita].receita_id })
                        .then(ingredientes => {
                            const parsedIngredientes = JSON.parse(JSON.stringify(ingredientes))
                            receitas[receita] = { ...receitas[receita], ingredientes: parsedIngredientes }
                        })

                    await app.db('categorizar')
                        .select(
                            "categorias.categoria_id",
                            "categorias.nome_categoria"
                        )
                        .innerJoin('categorias', 'categorias.categoria_id', 'categorizar.categoria_id')
                        .where({ receita_id: receitas[receita].receita_id })
                        .then(categorias => {
                            const parsedCategorias = JSON.parse(JSON.stringify(categorias))
                            receitas[receita] = { ...receitas[receita], categorias: parsedCategorias }
                        })
                }
                res.status(200).json({ data: receitas, total, limit })
            })
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {
        try {
            validId(req.params.id, "Id invalido")

            const existId = await app.db('receitas')
                .where({ receita_id: req.params.id })
                .first()

            existOrError(existId, 'Receita inexistente')
        } catch (err) {
            return res.status(400).send(err)
        }

        await app.db('receitas')
            .select('receita_id', 'nome_receita', 'modo_preparo', 'local_origem', 'tempo_preparo', 'usuario_id')
            .where({ receita_id: req.params.id })
            .then(receita => res.status(200).json({
                data: receita
            }))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
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

    return {
        save,
        get,
        getById,
        remove
    }
}