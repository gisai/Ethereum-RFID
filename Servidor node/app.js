const express = require('express')
const app = express()

const bodyParser = require("body-parser");

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', function(req, res) {
	
    if(req.query != null && req.query.ID != null && req.query.lector != null){
        
        //Hemos obtenido el mensaje del arduino y lo tenemos almacenado en: req.query.msg
        
        res.send('ID: '+req.query.ID+ ' Lector: '+req.query.lector);   
		console.log('GET: El servidor ha recibido: '+req.query.ID);
    } else res.send('No se ha especificado el parámetro msg') ;
});

app.post('/', function(req, res) {
	       //console.log('POST: El servidor ha recibido algo:' +req.body);
    if(req.body != null && req.body.ID != null && req.body.lector != null){

        //Hemos obtenido el mensaje del arduino y lo tenemos almacenado en: req.query.msg
        
        res.send('ID: '+req.body.ID+ ' Lector: '+req.body.lector);   
		console.log('POST: El servidor ha recibido: '+req.body.ID);
    } else res.send('No se ha especificado el parámetro POST') ;
});

app.listen(3000, () => console.log('Servidor en puerto 3000. Envía un GET con información en el parámetro "msg" y este servidor la devolverá'))