const express = require('express')
const app = express()

const bodyParser = require("body-parser");
var direccion="0xd5437Bbe234147BB2fb86FDe4234373D4ADDb63d";
app.use(express.static(__dirname + '/View'));
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', function(req, res) {//para la primera llamada
	
	res.sendFile('index.html');
	
	
   /* if(req.query != null && req.query.ID != null && req.query.lector != null){
        
        //Hemos obtenido el mensaje del arduino y lo tenemos almacenado en: req.query.msg
        
        res.send('ID: '+req.query.ID+ ' Lector: '+req.query.lector);   
		console.log('GET: El servidor ha recibido: '+req.query.ID);
    } else res.send('No se ha especificado bien los parametros') ; */
} );

app.get('/usuario', function(req, res) {//para los datos 
	
	console.log('Entre1 ');
	
	
	if(req.query != null && req.query.add != '' ){
		console.log('Estoy añadiendo' + req.query.add);
		
		TFGAlonso.methods.setClientes(req.query.add).send({ from : web3.eth.defaultAccount });
        
	res.sendFile(__dirname + '/View/index.html');
	}
	else if(req.query != null && req.query.find != '' ){
		 console.log('Llamando a findCliente con address: '+ req.query.find);
		TFGAlonso.methods.findCliente(req.query.find).call( function(err, res){
			if (!err){
			console.log(res);
			}
			else{
			console.log(err);
			}
		});
	
		res.sendFile(__dirname + '/View/index.html');
	}else if(req.query != null && req.query.info != '' ){
		console.log('Estoy buscando el objeto de ID' + req.query.info);
		TFGAlonso.methods.getInfo(req.query.info).call( function(err, res){
			if (!err){
			console.log(res);
			}
			else{
			console.log(err);
			}
		});
		res.sendFile(__dirname + '/View/index.html');
	}else res.send('Nope') ;



} );

app.post('/', function(req, res) {
	       //console.log('POST: El servidor ha recibido algo:' +req.body);
    if(req.body != null && req.body.ID != null && req.body.lector != null){

        //Hemos obtenido el mensaje del arduino y lo tenemos almacenado en: req.query.msg
		TFGAlonso.methods.setID(req.body.ID,req.body.lector).send({ from : web3.eth.defaultAccount, gas:200000 });
        
		
		
        res.send('ID: '+req.body.ID+ ' Lector: '+req.body.lector);   
		console.log('POST: El servidor ha recibido: '+req.body.ID);
    } else res.send('No se ha especificado bien los parametros') ;
});

app.listen(3000, () => console.log('Servidor en puerto 3000. Envía un GET o POST con información en los parámetro "ID" y "Lector"; y este servidor la devolverá'))//aqui digo que escucho por el puerto 3000 de mi ordenador.


/***************    CONNECTION WITH THE SMART CONTRACT*************/
/*var http = require('http'); 
var url = require('url');
var fs = require('fs');

*/

var Web3 = require('web3');// Import the web3 module
if(typeof web3 !== 'undefined'){
	web3 = new Web3(web3.currentProvider);
}
else{
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
	//web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));
}


 web3.eth.getAccounts((err,accounts)=> {
	if (err) return
		web3.eth.defaultAccount = accounts[1];
}); // used to define the default acccount. this account will pay for the transactions


var TFGAlonso = new web3.eth.Contract(  [ //pones lo que genera el Smart Contract al compilarlo con truffle (archivo json)
    {
   "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "direccion",
          "type": "address"
        }
      ],
      "name": "setClientes",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "direccion",
          "type": "address"
        }
      ],
      "name": "findCliente",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "ID_arduino",
          "type": "string"
        },
        {
          "name": "lector_arduino",
          "type": "string"
        }
      ],
      "name": "setID",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "q",
          "type": "string"
        }
      ],
      "name": "getInfo",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ], '0xF4131E7088a980E5636D1827c80E8417f6477f4d');//la que de el ganache