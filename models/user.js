var mongoose= require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    createdAt: {type:Date, required:true}, 
    bio:{type:String, required:true},
    preferences:{type:Array, default:[]}
})

schema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

schema.methods.isValid = function(hashedPasssword){
    return bcrypt.compareSync(hashedPasssword, this.password);
}

module.exports = mongoose.model('User',schema)