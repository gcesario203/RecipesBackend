module.exports = app =>{
    const {notExistOrError,existOrError,countItensInCollections,validId,checkIfItemExists} = app.api.global

    const save = async(req,res)=>{
    }

    const limit = 3

    const get = async(req,res) =>{
    }

    const getById = async(req,res)=>{
    }

    const remove = async (req,res) =>{
    }

    return{
        save,
        get,
        getById,
        remove
    }
}