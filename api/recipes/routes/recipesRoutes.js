module.exports = app => {
    const {get,save,getById,remove} = app.api.recipes.controllers.recipesController
    const { authenticate } = app.config.passport

    app.route('/receitas')
        .get(get)
        .post(authenticate(save))

    app.route('/receitas/:id')
        .get(getById)
        .put(authenticate(save))
        .delete(authenticate(remove))
}