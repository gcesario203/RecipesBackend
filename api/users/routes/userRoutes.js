module.exports = app =>{
    const { authenticate } = app.config.passport
    const {save,get,getById,remove,getUserByName} = app.api.users.controllers.userController
    const {saveFavorite,getFavorite,getFavoriteById,removeFavorite} = app.api.users.controllers.favController

    app.route('/usuarios')
        .get(get)
        .post(authenticate())
        .post(app.admin(save))

    app.route('/usuarios/:id')
        .all(authenticate())
        .get(app.admin(getById))
        .put(app.admin(save))
        .delete(app.admin(remove))

    app.route('/usuarios/salvar-favorito')
        .post(authenticate())
        .post(saveFavorite)

    app.route('/usuarioPorNome')
        .get(authenticate())
        .get(getUserByName)
        
    app.route('/usuarios/buscar-favoritos')
        .post(getFavorite)

    app.route('/usuarios/buscar-favorito/:id')
        .post(getFavoriteById)

    app.route('/usuarios/remover-favorito/:id')
        .post(authenticate())
        .post(removeFavorite)
        

}