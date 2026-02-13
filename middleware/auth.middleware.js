import {validateUserToken} from'../utils/token'
export function authenetication(req,res,next){
    const authHeader=req.header('authorization')
    if(!authHeader) return next();

    if(!authHeader.startsWith('Bearer')){
        return res.status(400).json({message:'Invalid token'})
    }
    
    const [_,token]=authHeader.split(" ")

    const payload=validateUserToken(token)
    req.user=payload



}