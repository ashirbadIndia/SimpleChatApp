let userName="";
const socket=io.connect("http://127.0.0.1:4000");
const requestChats = async (obj)=>{
    try{
        const response = await fetch('http://127.0.0.1:4000/chats',{
            method: 'POST',
            body: JSON.stringify({ id:obj}),
            headers: {'Content-type': 'application/json',"Accept":"text/html"},
        })
        if(response.ok){
            const jsonResponse= await response.json();
            loadChats(jsonResponse);
        }
        else{
            throw new Error("Request Failed!");
        }
    }
    catch(error){
        console.log(error);
    }
}

const loadChats = (jsonRes)=>{

    userName=jsonRes.user;
    const chatbox=document.getElementById('chatbox');
    jsonRes.chats.forEach(item => {
        const chat= document.createElement('div');
        const speaker= document.createElement('p');
        if(item.speaker===userName){
            chat.setAttribute('class','chat right');
            speaker.innerHTML='You';
        }
        else{
            chat.setAttribute('class','chat left');
            speaker.innerHTML=item.speaker;
        }
        speaker.setAttribute('class','speaker');
        const msg= document.createElement('p');
        msg.setAttribute('class','message');
        msg.innerHTML=item.chat;
        chat.appendChild(speaker);
        chat.appendChild(msg);
        chatbox.appendChild(chat);
    });
}
const urlParams = new URLSearchParams(window.location.search);
const id=urlParams.get('id');
console.log(typeof(id));
requestChats(id);

const send= ()=>{
    const msg=document.querySelector('#field').value;
    if(msg!=='' && msg!==' '){
        try{
            socket.emit('send',{
                speaker: userName,
                chat: msg
            });
            msg.innerHTML=" ";
        }
        catch(error){
            console.log(error);
        }

    }
}
socket.on('received',function(data){
    addChat(data);
})

const addChat=(Obj)=>{
        const chatbox=document.getElementById('chatbox');
        const chat= document.createElement('div');
        const speaker= document.createElement('p');
        if(Obj.speaker===userName){
            chat.setAttribute('class','chat right');
            speaker.innerHTML='You';
        }
        else{
            chat.setAttribute('class','chat left');
            speaker.innerHTML=Obj.speaker;
        }
        speaker.setAttribute('class','speaker');
        const msg= document.createElement('p');
        msg.setAttribute('class','message');
        msg.innerHTML=Obj.chat;
        chat.appendChild(speaker);
        chat.appendChild(msg);
        chatbox.appendChild(chat);
}