//creamos una instancia de socket del lado del cliente

const socket = io()

//creo una variable para guardar al usuario
let user;
const chatBox =document.getElementById("chatBox")

//SweetAlert2
//Es una libreria que nos permite crear alerta personalizada
//Swal es un objeto global que nos permite usar los metodos de libreria
//fire: es un metodo que nos permite configurar la libreria

Swal.fire({
    title: "identification",
    input: "text",
    text:"ingresa nombre de usuario para identificarte en el Chat",
    inputValidator: (value)=>{
        return !value && "Necesitas un nombre para continuar"
    },
    allowOutsideClick: false,
}).then(result =>{
    user = result.value;
} )

chatBox.addEventListener("keyup",(event)=>{
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            //trim nos permite sacar los espacios en blanco del principio al final de un strin
            //si el mensaje tiene mas de 0 caracteres, lo enviamos al servidor
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})
//Listener de mensajes


socket.on("message", data => {
    let log = document.getElementById("messagesLogs");
    let messages = data.map(message => {
        return `<div style="margin-bottom: 10px;">
                    <span style="font-weight: bold; color: #007BFF;">${message.user}</span> dice: 
                    <span style="color: #28A745;">${message.message}</span>
                </div>`;
    }).join("");
    log.innerHTML = messages;
});


