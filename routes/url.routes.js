import express from 'express'

const router=express.Router();

router.post('/shorten',async function(req,res){
    const userID=req.user.id;

    if(!userID){
        return res.status(401).json({message:'Not authenticated'})
    }
    
})


export default router