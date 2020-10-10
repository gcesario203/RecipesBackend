module.exports = app =>{
    const { authenticate } = app.config.passport
    const {save,get,getById,remove} = app.api.users.controllers.userController

    app.route('/usuarios')
        .all(authenticate())
        .post(app.admin(save))
        .get(app.admin(get))

    app.route('/usuarios/:id')
        .all(authenticate())
        .get(app.admin(getById))
        .put(app.admin(save))
        .delete(app.admin(remove))
}