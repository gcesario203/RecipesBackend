module.exports = app => {
    const { notExistOrError, existOrError, countItensInCollections, validId } = app.api.global

    const save = async (req, res) => {
        const category = { ...req.body }

        try {
            existOrError(category.nome_categoria, "Nome da categoria não informado")

            const categoryFromDb = await app.db('categorias')
                .where({ nome_categoria: category.nome_categoria })
                .first()

            if (!req.params.id) {
                notExistOrError(categoryFromDb, "Categoria ja existente")
            }

            if (req.params.id) {
                app.db('categorias')
                    .update(category)
                    .where({ categoria_id: req.params.id })
                    .then(_ => res.status(202).send('Categoria modificada com sucesso'))
                    .catch(err => res.status(500).send(err))
            } else {
                app.db('categorias')
                    .insert(category)
                    .then(_ => res.status(202).send('Categoria criada com sucesso'))
                    .catch(err => res.status(500).send(err))
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const limit = 3

    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('categorias')
            .count()
            .first()

        const count = JSON.parse(JSON.stringify(result))
        let total = 0;

        for(var value in count){
            total = count[value]
        }

        app.db('categorias')
            .select('categoria_id', 'nome_categoria')
            .limit(limit)
            .offset(page * limit - limit)
            .then(categorias => res.status(200).json({
                data: categorias,
                total,
                limit
            }))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {
        try {
            validId(req.params.id, "Id invalido")

            const existId = app.db('categorias')
                .where({ categoria_id: req.params.id })
                .first()

            existOrError(existId, "Categoria Inexistente")
        } catch (msg) {
            return res.status(500).send(msg)
        }

        app.db('categorias')
            .select('categoria_id', 'nome_categoria')
            .where({ categoria_id: req.params.id })
            .then(categoria => res.status(200).json({
                data: categoria
            }))
            .catch(err => res.status(404).send(err))
    }

    const remove = async (req, res) => {
        try {
            validId(req.params.id, "Id inválido")

            const existId = await app.db('categorias')
                                    .where({categoria_id:req.params.id})
                                    .first()

            existOrError(existId, 'Categoria inexistente')
        } catch (err) {
            return res.status(400).send(err)
        }

        app.db('categorias')
            .where({ categoria_id: req.params.id })
            .del()
            .then(_ => res.status(200).send('Categoria deletada com sucesso'))
            .catch(err => res.status(400).send(err))
    }

    return {
        save,
        get,
        getById,
        remove
    }
}