const mongoose = require('mongoose');

const {schema} = require('./secure/userValidation');
const userSchema = new mongoose.Schema({
    connectionId:{
        type:String,
        required:true,
    },
    nickname:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:20,
    },
    roomNumber:{
        type: String,
        default: "room1",
        enum: ["room1","room2", "room3"],
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"Room",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.statics.userValidation = function (body) {
    return schema.validate(body,{abortEarly:false});
}

module.exports = mongoose.model("User",userSchema);