module.exports = app =>{
    const {save,get,getById,remove} = app.api.users.controllers.userController

    app.route('/usuario')
        .post(save)
        .get(get)

    app.route('/usuario/:id')
        .get(getById)
        .delete(remove)
}