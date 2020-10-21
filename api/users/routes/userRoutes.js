module.exports = app =>{
    const { authenticate } = app.config.passport
    const {save,get,getById,remove} = app.api.users.controllers.userController
    const {saveFavorite,getFavorite,getFavoriteById,removeFavorite} = app.api.users.controllers.favController

    app.route('/usuarios')
        .all(authenticate())
        .post(app.admin(save))
        .get(app.admin(get))

    app.route('/usuarios/:id')
        .all(authenticate())
        .get(app.admin(getById))
        .put(app.admin(save))
        .delete(app.admin(remove))

    app.route('/usuarios/salvar-favorito')
        .post(authenticate())
        .post(saveFavorite)
        
    app.route('/usuarios/buscar-favoritos')
        .post(getFavorite)

    app.route('/usuarios/remover-favorito/:id')
        .all(authenticate())
        .delete(removeFavorite)
        

}