module.exports = app =>{
    const authSecret = 'ALSBJHjbksnkldfjknajbk1¨¨%!¨&@2lç3JBA'

    function existOrError(value, msg){
        if(!value) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg
    }

    function notExistOrError(value, msg){
        try {
            existOrError(value,msg)
        } catch (msg) {
            return
        }
        throw msg
    }

    function equalsOrError(a,b,msg){
        if(a!==b) throw msg
    }

    function validEmail(value,msg){
        const defaultEmailRegex = /^[a-z0-9\.\-\_]+\@[a-z]+(.com.br|.com)$/i

        let validateValue = defaultEmailRegex.exec(value)

        if(!validateValue) throw msg
    }

    function validPassword(value, msg){
        const defaultPasswordRegex = /^[a-z0-9]{8,15}$/i

        let validatePassword = defaultPasswordRegex.exec(value)

        if(!validatePassword) throw msg
    }

    function validId(value,msg){
        const defRegex = /^[0-9]+$/

        let validId = defRegex.exec(value)

        if(!validId) throw msg
    }

    function checkSql(value,msg){
        const defRegex = /^(and|or|union|select|delete|insert|update|join)+$/i
        
        let checkValue = defRegex.exec(value)

        console.log(value)

        if(checkValue) throw msg
    }

    return {
        existOrError,
        notExistOrError,
        equalsOrError,
        validEmail,
        validPassword,
        validId,
        authSecret,
        checkSql
    }
}