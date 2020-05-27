const express = require('express');
const bodyParser = require('body-parser');
let chats=[];
const app = express();
const socket=require('socket.io');
const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27018/chat_realtime_db',{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open',()=>{
    console.log('Successfully connected!');
}).on('error',()=>{console.log('something went wrong! :-(')});

const users= mongoose.model('users',{name:String, password:String});
const chats_model= mongoose.model('chats',{speaker:String, chat:String});

app.use('/',express.static('./assets'));

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req,res)=>{
    res.render('login');
})
app.get('/chat',(req,res)=>{
    //console.log(req.query.id);
    res.render('chat',{id:req.query.id});
})
app.post('/chats',(req,res)=>{
    let name="sorry";
    //console.log(req.body.id);
    let chats=[];
    chats_model.find().then((chats_)=>{
        chats=chats_;
    });
    users.findOne({_id: req.body.id}).then((user)=>{
            name=user.name;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({user:name, chats:chats}));
    });
});
app.post('/login',(req,res)=>{
    const body=req.body;
    users.find({name: body.name}).then((user)=>{
        if(user.length===0 || (user[0].password!==body.password)){
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({status: 'Check your user name and password'}));
        }
        else{
            let id=user[0]._id.toString();
            res.redirect(301,'chat?id='+id);
        }
    })
});

const server=app.listen(4000,'127.0.0.1');

const io = socket(server);

io.on('connection',(client)=>{
    client.on('send',(data)=>{
        io.sockets.emit('received',data);
        chat_instant= new chats_model(data);
        chat_instant.save();
    });
});