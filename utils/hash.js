import { createHmac, randomBytes } from 'node:crypto';

export function hashedPasswordWithSalt(password,usersalt=undefined){
    const salt=usersalt ?? randomBytes(256).toString('hex')
    const hashedPassword=createHmac('sha256',salt)
                         .update(password)
                        .digest('hex')

    return {salt,password:hashedPassword}
}