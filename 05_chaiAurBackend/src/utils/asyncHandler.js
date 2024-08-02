const asyncHandler=(requesHandler) =>{
    (req,res,next)=>{
        Promise.resolve(requesHandler(req,res,next))
        .catch((err)=>next(err))
    }
}

export {asyncHandler}

// const asyncHandler=(requestHandler)=>async (req,res,next)=>{ //Higher order arrow functions. This  is the try catch syntax.
//     try{
//         await requestHandler(req,res,next)
//     }catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }