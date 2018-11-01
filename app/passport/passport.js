const passport = require('passport');
const jwtStatergy = require('passport-jwt').Strategy;
const  { ExtractJwt } = require('passport-jwt');
const localStatergy =   require('passport-local').Strategy;
const { JWT_SECRET } = require(__base + 'app/config/index');
const Account =  require(__base + 'app/models/account');


// json web token statergy
passport.use(new jwtStatergy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async ( payload, done) => {

    try {

        //find account specified in the token
        const account = await Account.findById(payload.sub);
        console.log(payload.sub);
        //if account doesn't exisit handle it 
        if(!account)
        {
            return done(null , false);
        }

        //otherwise return the account
        done(null , account);

    } catch (error) {
       done(error , false); 
    }
})); 


// local statergy

passport.use(new localStatergy({
    usernameField: 'email'
}, async (email , password, done) =>{
    
    try {

        // find the account  from given email
        const account = await Account.findOne({ email });
    
        // if not found  handle it 
        if(!account)
        {
            return done(null , fasle);
        }
    
        // if account found check  password is correct
        const isMatch = await account.isValidPassword(password); 
        if(!isMatch)
        {
            return done(null , false);
        }
    
        // otherwise , return the account 
         done(null , account);
        
    } catch (error) {
        done(error , false);
    }
    
}));