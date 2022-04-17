const User = require('../model/User');
const Message = require('../model/Message');

//* ADD User
exports.createUser =async(connectionId,nickname, roomNumber)=>{
    try {
        await User.userValidation({connectionId,nickname, roomNumber});
        console.log(connectionId,nickname, roomNumber);
        const user = await User.findOne({connectionId});
        if(user){
            const error = new Error("کاربری با این مشخصات در پایگاه داده موجود است");
            // throw error;
            console.log(error);
        }
        else{
            await User.create({connectionId,nickname, roomNumber});
            console.log("User Created Successfully...");
        }
    } catch (err) {
        console.log(err);
    }
};
//*Deleted User
exports.deleteUser= async(connectionId)=>{
    try {
       const user = await User.findOne({connectionId:connectionId}); 
       await User.findByIdAndRemove({_id:user.id});
       return user;
    } catch (err) {
        console.log(err);
    }
};
//* ADD Message to message_tbl
exports.storageMessages = async(connectionId, roomNumber,message)=>{
    try {
        await Message.messageValidation({message});
        await Message.create({connectionId, roomNumber,message});
        console.log("Message Created Successfully...");
    } catch (err) {
        console.log(err);
    }
};