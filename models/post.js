var mongoose= require('mongoose');

var schema = new mongoose.Schema({
    title: {type:String, required:true},
    userid:{type:String, required:true},
    name:{type:String, required:true},
    books: {type:Array, default:[]},
    blogs: {type:Array, default:[]},
    videos: {type:Array, default:[]},
})

module.exports = mongoose.model('Post',schema)