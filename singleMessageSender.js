const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
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


app.get('/wapicall/:mno/:msg',(req, res) =>{
    console.log(req.params);
    const mno = req.params.mno;
    const msg = req.params.msg;
    try {
        if(mno != "" && msg != ""){
            let mno1 = mno + "@c.us";
            if(statusConnection == 'Connected') {
                try {
                    client.sendMessage(mno1,msg);
                    console.log("Message sent sucessfully");   
                    res.send('<h1>Message sent sucessfully</h1>') 
                }
                catch(err) {
                    console.log("Error in sending whatsapp message: "+err);
                }                    
            }
            else if ( statusConnection == 'Not Connected' ) {
                console.log("Client not connected please connect it");
            }
            else {
                console.log("Error in connecting client :"+statusConnection);
            }
        }
        else {
            console.log("Invalid data from user")
            res.send('<h1>Empty Data</h1>')
        }

    }
    catch(err){
        console.log(err);
        res.send("<h1>Error</h1>")
    }    
})


app.listen(port, () => {
    console.log( `Example app listening on port ${port} `);
})
