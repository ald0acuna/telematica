var express = require('express');
const { fstat } = require('fs');
//var socketio = require('socket.io');


const mysql = require('mysql');
var httpserver = express();

//var server = require('http').Server(httpserver);       
//var io = socketio.listen(server);

//const socket = dgram.createSocket('udp4');

var server = require('http').Server(httpserver);
//const server = require('http').createServer();
const io = require('socket.io')(server);
//var io = socketio.listen(server);

const path = require('path');
//var socket = io.connect('http://54.198.215.111:4500/', { 'forceNew': true });

//Settings
httpserver.set('port', process.env.PORT || 4500);


httpserver.use(express.static('public'));


//Conexión a la base de datos
const database = mysql.createConnection({
    host: 'database1.ctncp24axruk.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '2147qwer',
    database: 'Covid19'
});





httpserver.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});


httpserver.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/registro.html'));
});


io.on('connection', function(socket) {

    socket.on('datosUsuario', msg => {
        nombre = msg[0];
        apellido = msg[1];
        cc = msg[2];
        idRol= msg[3];
        username= msg[4];
        password= msg[5];


        userdata = {Nombre: nombre, Apellido: apellido, CC_User: cc, ROL: idRol, User: username, Password:password }
        console.log(userdata);
        let sql = 'INSERT INTO Usuarios SET ?';
        let query = database.query(sql,userdata,(err,result) =>{
            if(err) throw err;
        }); 
    });

});


database.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to DB');

});

server.listen(4500, function() {
    console.log('Servidor ejecutandose en el puerto 4500')
});