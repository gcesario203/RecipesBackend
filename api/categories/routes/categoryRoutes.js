module.exports = app =>{
    const { authenticate } = app.config.passport
    const {save,get,getById,remove} = app.api.categories.controllers.categoryController

    app.route('/categorias')
        .all(authenticate())
        .post(app.admin(save))
        .get(app.admin(get))

    app.route('/categorias/:id')
        .all(authenticate())
        .get(app.admin(getById))
        .put(app.admin(save))
        .delete(app.admin(remove))
}