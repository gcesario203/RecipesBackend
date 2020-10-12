module.exports = app => {
    const { get, save, getById, remove, recipesByUser } = app.api.recipes.controllers.recipesController
    const { authenticate } = app.config.passport

    app.route('/receitas')
        .get(get)
        .post(authenticate())
        .post(save)

    app.route('/receitas/:id')
        .get(getById)
        .put(authenticate())
        .put(save)
        .delete(authenticate())
        .delete(remove)

    app.route('/receitas/usuario/:id')
        .get(recipesByUser)
}