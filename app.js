const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const app = http.createServer(function(req,res){   
    let pathname = url.parse(req.url).pathname;
	pathname = pathname == '/' ? '/rain.html' : pathname;	
	let realPath = path.join(__dirname, 'public' + pathname);
    fs.readFile(realPath,'utf8',(err,result)=>{              
        res.end(result);   
    });    
});
//   websocket :  https://www.runoob.com/html/html5-websocket.html

// 软件通信有七层结构，下三层结构偏向与数据通信，上三层更偏向于数据处理，中间的传输层则是连接上三层与下三层之间的桥梁，每一层都做不同的工作，上层协议依赖与下层协议。基于这个通信结构的概念。
// Socket 其实并不是一个协议，是应用层与 TCP/IP 协议族通信的中间软件抽象层，它是一组接口。当两台主机通信时，让 Socket 去组织数据，以符合指定的协议。TCP 连接则更依靠于底层的 IP 协议，IP 协议的连接则依赖于链路层等更低层次。
// WebSocket 则是一个典型的应用层协议。
// 总的来说：Socket 是传输控制层协议，WebSocket 是应用层协议。

// socket详解https://blog.csdn.net/weixin_39634961/article/details/80236161
// 第一次握手：客户端需要发送一个syn j 包，试着去链接服务器端，于是客户端我们需要提供一个链接函数
// 第二次握手：服务器端需要接收客户端发送过来的syn J+1 包，然后在发送ack包，所以我们需要有服务器端接受处理函数
// 第三次握手：客户端的处理函数和服务器端的处理函数
// 三次握手只是一个数据传输的过程，但是，我们传输前需要一些准备工作，比如将创建一个套接字，收集一些计算机的资源，将一些资源绑定套接字里面，以及接受和发送数据的函数等等，这些功能接口在一起构成了socket的编程

//创建一个socket服务
const ws= require('socket.io');
const io =ws(app);
let i =0;
let j=0;
let nr='';
io.on('connection',function(socket){  
    console.log('有用户进入');
    i++;
    console.log(i); 
    //服务器通过onmessage事件进行数据交互
    socket.on('message', function(mes){
        j++;
        console.log(mes); 
        nr+=j+":"+mes+"\n";
        fs.writeFile('./data.txt', nr, err => {
            if (err != null) {
                console.log(err);
                return;
            }      
        })       
        io.emit('message',mes);//发消息事件
    })    
});
app.listen('3000');
console.log('服务器连接成功','http://192.168.73.195:3000');

// const io = require('socket.io')(app);
// io.on('connection',client=>{
//     client.on('event',data=>{});
//     client.on('disconnect',()=>{});
// })

// io.on('connection', socket => {
//     socket.emit('request', /* … */); // emit an event to the socket
//     io.emit('broadcast', /* … */); // emit an event to all connected sockets
//     socket.on('reply', () => { /* … */ }); // listen to the event
//   });