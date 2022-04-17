//Soket middleware initialize for client
// const socket = io(
  // {
  // auth:{
  //   token:true,
  // }
// }
// );
//Create Chat Name Space for client side
const chatNamespace = io("/chat");
//Query DOM
const messageInput = document.getElementById("messageInput"),
    chatForm = document.getElementById("chatForm"),
    chatBox = document.getElementById("chat-box"),
    feedback = document.getElementById("feedback"),
    welcome = document.getElementById("show-welcome"),
    onlineUsers = document.getElementById("online-users-list"),
    chatContainer = document.getElementById("chatContainer"),
    pvChatForm = document.getElementById("pvChatForm"),
    pvMessageInput = document.getElementById("pvMessageInput"),
    modalTitle = document.getElementById("modalTitle"),
    pvChatMessage = document.getElementById("pvChatMessage");

// Get localStorage from index.html
const nickname = localStorage.getItem("nickname"),
    roomNumber = localStorage.getItem("chatroom");
let socketId;

//Get  localStorage "nickname" & "roomNumber" Send to server
chatNamespace.emit("login", { nickname, roomNumber });

// Listening to emit events >> "submit" user clicked
// Send user sender value to server with modal
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (messageInput.value) {
      chatNamespace.emit("chat message", {
          message: messageInput.value,
          name: nickname,
          roomNumber,
      });
      messageInput.value = "";
  }
});
//Listening to emit events >> "keypress" user type...
messageInput.addEventListener("keypress", () => {
  chatNamespace.emit("typing", { name: nickname, roomNumber });
});
//pvchat === private chat
//Listening to emit events >> "pvchat"
// Send id,name,message from Sender & id Receiver To Server
pvChatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  chatNamespace.emit("pvChat", {
    message: pvMessageInput.value,
    name: nickname,
    to: socketId,
    from: chatNamespace.id,
  });

  $("#pvChat").modal("hide");
  pvMessageInput.value = "";
});
//Listening to socket emit  >>"online" from server
// Get userId & username & show online user
chatNamespace.on("online", (users) => {
  onlineUsers.innerHTML = "";

  for (const socketId in users) {
      if (roomNumber === users[socketId].roomNumber) {
          onlineUsers.innerHTML += `
          <li >
              <button type="button" class="btn btn-light mx-2 p-2" data-toggle="modal" data-target="#pvChat" data-id=${socketId} data-client=${
              users[socketId].nickname
          }
              ${users[socketId].nickname === nickname ? "disabled" : ""}>
              ${users[socketId].nickname}
                  <span class="badge badge-success"> </span>
              </button>
          </li>
      `;
      }
  }
});
//show Welcom
chatNamespace.on("welcome",(data)=>{
  welcome.innerHTML = `<p class="alert alert-warning w-25"><em> Welcome ${data.nickname} To ${data.roomNumber}  </em></p>`;
});
//show joined
chatNamespace.on("joined",(data)=>{
  welcome.innerHTML = `<p class="alert alert-warning w-25"><em> ${data.text} </em></p>`;
});
//Show Left
chatNamespace.on("status",(data)=>{
  welcome.innerHTML = `<p class="alert alert-warning w-25"><em> ${data.text} </em></p>`;
});
// Listening to sockets emit  >>"chat message" from server
// & send data to ui element
chatNamespace.on("chat message", (data) => {
  feedback.innerHTML = "";
  welcome.innerHTML="";
  chatBox.innerHTML += `
                        <li class="alert alert-light">
                            <span
                                class="text-dark font-weight-normal"
                                style="font-size: 13pt"
                                >${data.name}</span
                            >
                            <span
                                class="
                                    text-muted
                                    font-italic font-weight-light
                                    m-2
                                "
                                style="font-size: 9pt"
                                >ساعت 12:00</span
                            >
                            <p
                                class="alert alert-info mt-2"
                                style="font-family: persian01"
                            >
                            ${data.message}
                            </p>
                        </li>`;
  // scroll page
  chatContainer.scrollTop =
    chatContainer.scrollHeight - chatContainer.clientHeight;
});
//Listening to socket broadcast emit  >>"typing" from server
chatNamespace.on("typing", (data) => {
  if (roomNumber === data.roomNumber)
      feedback.innerHTML = `<p class="alert alert-warning w-25"><em>${data.name} در حال نوشتن است ... </em></p>`;
});
// Listening to socket emit  >>"pvChat" from server
// reciver send Data to reciver
chatNamespace.on("pvChat", (data) => {
  $("#pvChat").modal("show");
  socketId = data.from;
  modalTitle.innerHTML = "دریافت پیام از طرف : " + data.name;
  pvChatMessage.style.display = "block";
  pvChatMessage.innerHTML = data.name + " : " + data.message;
});

//JQuery - show modal dialog for Sender
$("#pvChat").on("show.bs.modal", function (e) {
  var button = $(e.relatedTarget);
  var user = button.data("client");
  socketId = button.data("id");

  modalTitle.innerHTML = "ارسال پیام شخصی به :" + user;
  pvChatMessage.style.display = "none";
});
