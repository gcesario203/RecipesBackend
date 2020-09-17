module.exports = app =>{
    const {save,get,getById,remove} = app.api.users.controllers.userController

    app.route('/usuarios')
        .post(save)
        .get(get)

    app.route('/usuarios/:id')
        .get(getById)
        .put(save)
        .delete(remove)
}