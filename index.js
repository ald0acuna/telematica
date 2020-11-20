var express = require('express');
const { fstat } = require('fs');
const mysql = require('mysql');
var httpserver = express();
var server = require('http').Server(httpserver);
const io = require('socket.io')(server);
const path = require('path');


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

httpserver.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/casos.html'));
});

httpserver.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/img/background.jpg'));
});
httpserver.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/img/logoUninorte.png'));
});
httpserver.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/js/jquery.js'));
});
httpserver.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/js/jquery-3.5.1.min.js'));
});
httpserver.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/js/registro.js'));
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

    socket.on('datosPaciente', msg=>{
        nombre = msg[0];
        apellido = msg[1];
        cc = msg[2];
        sexo = msg[3];
        fNaci = msg[4];
        resid = msg[5];
        trabajo = msg[6];
        rExamen = msg[7];
        fExamen = msg[8];

        pacientdata = {Nombre:nombre, Apellido:apellido, Cédula:cc, Sexo:sexo, FechadeNacimiento:fNaci, 
            DirecciónResidencia: resid, DirecciónTrabajo:trabajo, ResultadoExamen: rExamen, FechaExamen:fExamen}
        let sql = 'INSERT INTO Casos SET ?';
        let query = database.query(sql,pacientdata,(err,result) =>{
            if(err) throw err;
        });

    });

    socket.on('validar', msg=>{
        username = msg[0];
        password = msg[1];

        var vd = `SELECT ROL FROM Usuarios WHERE User =  '${username}' AND Password =  '${password}'`;
        console.log(vd);
        database.query(vd, function (err, result) {
            
            if (err) throw err;
            /* console.log(result); */
            socket.emit('loginResp', result);
            console.log("res: "+result); 
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