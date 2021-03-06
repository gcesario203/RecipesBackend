module.exports = app =>{
    const { authenticate } = app.config.passport
    const {save,get,getById,remove,getByCatName} = app.api.categories.controllers.categoryController

    app.route('/categorias')
        .get(get)
        .post(authenticate())
        .post(app.admin(save))

    app.route('/categoriaPorNome')
        .get(authenticate())
        .get(getByCatName)
        

    app.route('/categorias/:id')
        .all(authenticate())
        .get(app.admin(getById))
        .put(app.admin(save))
        .delete(app.admin(remove))
}