const Account =  require(__base + 'app/models/account');
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require(__base + 'app/config/index');

signToken = account => {console.log(JWT_SECRET);
    // generate token
    return  JWT.sign({
            iss:'nodeapp',
            sub:  account._id,
            iat:   new Date().getTime(), // current time 
            exp: new  Date().setDate(new Date().getDate() + 1) //current time + 1 day
        }, JWT_SECRET);
}

module.exports = {
    getAccounts: async (req, res, next) => {
        console.log('account controller get accounts called');
        res.status(200).send({message:'success'});
    },

    signUp : async (req, res, next) => {
        console.log('contents of req.value.body', req.value.body);
        const { email,password } =  req.value.body;

        // check is an account with same email exisit already
        const  foundAccount =  await Account.findOne({email});
        if(foundAccount)
        {
            return res.status(403).json({error : 'Email already in use'});
        }

        // create new user if does not exists
        const newAccount = new  Account({ email, password });
        await newAccount.save();

        // generare token 
        const token = signToken(newAccount);  

        // resopnd with token
        res.status(200).json({ token });
    },
    

    signIn:(req, res, next) => {
        //generate token by passing req.user which here gives loggedin account
        const token =  signToken(req.user);
        res.status(200).json({ token });
    },

     secret:(req, res, next) => {
        console.log('I manage to get here');
       // res.status(200).send({message:'I managed to get here'});
    },
}