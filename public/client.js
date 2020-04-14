clientSocket = io();
console.log("hello world");
let vidCont = document.getElementById("theVid")
clientSocket.on("handshake", (data)=>{
  console.log(data);
})

clientSocket.on('vidData', function(data){

})
