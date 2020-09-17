module.exports = app =>{
    const {save} = app.api.users.controllers.userController
    const {signIn,validateToken} = app.api.auth.controllers.authController

    app.post('/signup', save)
    app.post('/signin', signIn)
    app.post('/validateToken', validateToken)

}