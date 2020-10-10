module.exports = app =>{
    const {notExistOrError,existOrError,countItensInCollections,validId,checkIfItemExists} = app.api.global

    const limit = 3

    const getById = async(req,res)=>{
        
    }

    const remove = async (req,res) =>{
    }

    return{
        getById,
        remove
    }
}