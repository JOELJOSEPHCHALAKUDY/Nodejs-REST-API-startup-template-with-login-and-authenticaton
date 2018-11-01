const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
//create a schema
const accountSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique : true,
        lowercase : true
    },
    password: {
        type : String,
        required : true
    }
});

// before save  
accountSchema.pre('save', async function(next) {
    try {

        // generate salt
        const salt =  await  bcrypt.genSalt(10);
        
        // generate the password hash (salt + password)
        const passwordHash = await bcrypt.hash(this.password, salt);

        // re-assign  hashed  version  over original , plain text password
        this.password = passwordHash;
        next();
        
    } catch (error) {
        next(error);
    }
});

accountSchema.methods.isValidPassword = async function(newPassword){
    try {
      
        //compare 
         return  await bcrypt.compare(newPassword , this.password);

    } catch (error) {
        throw new Error(error);
    }
}    

//create model
const Account = mongoose.model('account', accountSchema);

// export the model
module.exports = Account;