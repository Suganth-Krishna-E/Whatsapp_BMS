const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const qrGenL = require('qr-image');

let client;

let statusConnection = 'Not Connected';

app.get('/connect',(req, res) =>{
    console.log("Connect Request Recieved");
    client = new Client();

    client.on('qr', (qr) => {
        console.log("QR is being generated");
        let code = qrGenL.image(qr, { type: 'svg' });
        res.type('svg');
        code.pipe(res);
        console.log("QR sent to client web page");

        //const qrTemp = qrcode.generate(qr, { small: true });
    });


    client.on('ready', () => {
        statusConnection = 'Connected';
        console.log("Client Connected Start sending messages");
    });

    
    client.initialize();
    client.on('error', (err) => {
        statusConnection = err;
        res.send("error"+err);
    });
})


module.exports = { client, statusConnection};


app.listen(port, () => {
    console.log( `Example app listening on port ${port} `);
})
