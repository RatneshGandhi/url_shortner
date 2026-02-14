import {validateUserToken} from'../utils/token.js'
export function authenetication(req,res,next){
    const authHeader=req.header('authorization')
    if(!authHeader) return next();

    if(!authHeader.startsWith('Bearer')){
        return res.status(400).json({message:'Invalid token'})
    }

    const [_,token]=authHeader.split(" ")

    const payload=validateUserToken(token)
    req.user=payload

    next();

}

export function ensureAuthenticated(req,res,next){
    if(!req.user || !req.user.id){
         return res.status(401).json({ message: 'Not authenticated' })
    }

    next();
}