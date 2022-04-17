const mongoose = require('mongoose');

const {schema} = require('./secure/messageValidation');

const messageShema = new mongoose.Schema({
    connectionId:{
        type:String,
        required:true,
    },
    roomNumber:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

messageShema.statics.messageValidation = function (body) {
    return schema.validate(body,{abortEarly:false});
}

module.exports = mongoose.model("Message",messageShema);