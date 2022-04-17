const userController = require("../controller/userController");

// * array users how joins room
// const c_users = [];
//*  Send User to db
const join_User = (connectionId, nickname, roomNumber) => {
  const p_user = { connectionId, nickname, roomNumber };
  userController.createUser(connectionId, nickname, roomNumber);
  // c_users.push(p_user);
  return p_user;
};
//* Get user id & return particular user
// const get_Current_User = (id) => {
// return c_users.find((p_user) => p_user.id === id);
// };
//* Deleted from array user disconnect
const user_Disconnect = async(connectionId) => {
  const p_user = await userController.deleteUser(connectionId);
  return p_user;
  // const index = c_users.filter((p_user) => p_user.id !== id);
  // const p = c_users.find((p_user) => p_user.id === id);
  // c_users.splice(id, 1);
};
//* Send Message to db
const save_Message = (connectionId, roomNumber,message) => {
  const u_messag = { connectionId, roomNumber,message };
  userController.storageMessages(connectionId, roomNumber,message);
  return u_messag;
};

module.exports = {
  join_User,
  user_Disconnect,
  save_Message,
};
