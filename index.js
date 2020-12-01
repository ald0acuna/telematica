var express = require('express');
const { fstat } = require('fs');
const mysql = require('mysql');
var httpserver = express();
var server = require('http').Server(httpserver);
const io = require('socket.io')(server);
const path = require('path');
require('dotenv').config();


//Settings
httpserver.set('port', process.env.PORT || 4500);
httpserver.use(express.static('public'));


//Conexión a la base de datos
const database = mysql.createConnection({
	host: process.env.HO,
	user: process.env.A,
	password: process.env.PA,
	database: process.env.B
	
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

httpserver.post('/datagrafico', (req, res)=>{
    console.log(req.body);
    const data = req.body;

    var sql = 'SELECT SUM(ResultadoExamen=1) AS p, SUM(ResultadoExamen=2) AS n FROM Casos'

    let query = database.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result)

        var rslt = result
        res.end(JSON.stringify(rslt));
    })

});

httpserver.post('/datagrafico2', (req, res)=>{
    console.log(req.body);
    const data2 = req.body;

    var sql1 = 'SELECT  SUM(EstadoDelPaciente=6) AS c, SUM(EstadoDelPaciente=7) AS m FROM ActualizacionEstado'

    let query2 = database.query(sql1, (err, result1) => {
        if(err) throw err;
        console.log(result1)

        var rslt1 = result1
        res.end(JSON.stringify(rslt1));
    })

});


httpserver.post('/datagrafico3', (req, res)=>{
    console.log(req.body);
    const data3 = req.body;

    var sql2 = 'SELECT SUM(EstadoDelPaciente=3) AS tc, SUM(EstadoDelPaciente=4) AS th, SUM(EstadoDelPaciente=5) AS u, SUM(EstadoDelPaciente=7) AS m FROM ActualizacionEstado'

    let query3 = database.query(sql2, (err, result2) => {
        if(err) throw err;
        console.log(result2)

        var rslt2 = result2
        res.end(JSON.stringify(rslt2));
    })

});

httpserver.post('/datagrafico1', (req, res)=>{
    console.log(req.body);
    const data4 = req.body;

    var sql3 = 'SELECT FechaExamen FROM Casos UNION Select FechaDeEstado FROM ActualizacionEstado order by FechaExamen asc'

    let query1 = database.query(sql3,(err, result3) => {
        if(err) throw err;
        console.log(result3)

        var rslt3 = result3
        res.end(JSON.stringify(rslt3));
    })

});


httpserver.post('/datagrafico4', (req, res)=>{
    console.log(req.body);
    const data4 = req.body;

    var sql4 = 'SELECT FechaExamen, COUNT(idCaso) AS Registros FROM Casos group by FechaExamen'

    let query4 = database.query(sql4, (err, result4) => {
        if(err) throw err;
        console.log(result4)

        var rslt4 = result4
        res.end(JSON.stringify(rslt4));
    })
});

httpserver.post('/datagrafico5', (req, res)=>{
    console.log(req.body);
    const data4 = req.body;

    var sql5 = 'SELECT FechaDeEstado, SUM(EstadoDelPaciente=7) AS Muertes FROM ActualizacionEstado group by FechaDeEstado'

    let query5 = database.query(sql5, (err, result5) => {
        if(err) throw err;
        console.log(result5)

        var rslt5 = result5
        res.end(JSON.stringify(rslt5));
    })
});

io.on('connection', function(socket) {

    

    socket.on('datosUsuario', msg => {//Para registrar usuarios nuevos al sistema 
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

    socket.on('datosPaciente', msg=>{ //Para insertar los datos del paciente en la base de datos 
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
            DireccionResidencia: resid, DireccionTrabajo:trabajo, ResultadoExamen: rExamen, FechaExamen:fExamen}
        let sql = 'INSERT INTO Casos SET ?';
        let query = database.query(sql,pacientdata,(err,result) =>{
            if(err) throw err;
        });

    });

    socket.on('validar', msg=>{//para vcalidar los usuarios que acceden al login
        username = msg[0];
        password = msg[1];

        var vd = `SELECT ROL FROM Usuarios WHERE User =  '${username}' AND Password =  '${password}'`;
        console.log(vd);
        database.query(vd, function (err, result) {
            
            if (err) throw err;
            /* console.log(result); */
            socket.emit('loginResp', result);
        });
    });

    socket.on('mododato',msg=>{ //Para buscar los casos de una persona en la seccion de Gestión
        modo = msg[0];
        dato = msg[1];
        if(modo==1){
            modo= `idCaso`;
        }else if (modo==2) {
            modo = `Nombre`;
        }else{
            modo = `Cédula`;
        }

        var bqda = `SELECT c.idCaso, c.Nombre, c.Apellido, c.Cédula, s.Sexo, c.FechadeNacimiento, c.DireccionResidencia, c.DireccionTrabajo, e.EstadosDelPaciente, c.FechaDeEstado  
        FROM ActualizacionEstado c, Estados e, sexo s
        where ${modo}='${dato}' and c.Sexo=s.idsexo and c.EstadoDelPaciente= e.idEstados
        order by FechaDeEstado DESC;`;
        console.log("busqueda de caso: "+bqda);
        database.query(bqda, function (err, result) {
            
            if (err) throw err;
            /* console.log(result); */
            socket.emit('bqda', result);
        });
    });

    socket.on('estado',msg=>{
        if(msg[4]=='Femenino'){
            sexo = 2;
        }else{
            sexo = 1;
        }
        fest = new Date();
        actdata = {idCaso:msg[0] , Nombre:msg[1], Apellido:msg[2], Cédula:msg[3], Sexo:sexo, FechadeNacimiento:msg[5], 
            DireccionResidencia: msg[6], DireccionTrabajo:msg[7], EstadoDelPaciente: msg[8], FechaDeEstado: fest}
        let sql = 'INSERT INTO ActualizacionEstado SET ?';
        let query = database.query(sql,actdata,(err,result) =>{
            if(err) throw err;
        });


    });

    socket.on('visudato',msg=>{ //Para buscar los casos de una persona en la seccion de Gestión
        modo = msg[0];
        dato = msg[1];
        if(modo==1){
            modo= `idCaso`;
        }else if (modo==2) {
            modo = `Cédula`;
        }else{
           
        }

        /* `SELECT c.idCaso, c.Nombre, c.Apellido, s.Sexo, c.FechadeNacimiento, c.DirecciónResidencia,
        c.DirecciónTrabajo, e.EstadosDelPaciente, c.FechaExamen  
        FROM Casos c, Estados e, sexo s
        where ${modo}='${dato}' and c.Sexo=s.idsexo and c.ResultadoExamen= e.idEstados
        order by FechaExamen DESC;`
        `SELECT * FROM Covid19.Casos WHERE ${modo} =  '${dato}' order by FechaExamen DESC;`
        */
        var bqda = `SELECT c.idCaso, c.Nombre, c.Apellido, c.Cédula, s.Sexo, c.FechadeNacimiento, c.DireccionResidencia, c.DireccionTrabajo, e.EstadosDelPaciente, c.FechaExamen, ae.EstadoDelPaciente 
        FROM Casos c, Estados e, sexo s, ActualizacionEstado ae
        where c.${modo}='${dato}' and c.Sexo=s.idsexo and c.ResultadoExamen= e.idEstados and ae.EstadoDelPaciente=e.idEstados
        order by FechaExamen DESC;`;
        console.log('busqueda: '+bqda);

        database.query(bqda, function (err, result) {
                       
            if (err) throw err;
            /* console.log(result); */
            socket.emit('bqda', result);
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
