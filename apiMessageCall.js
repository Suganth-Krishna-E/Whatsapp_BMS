const express = require('express');
const app1 = express();
const port1 = process.env.PORT || 3008;
const {client, statusConnection} = require('./qrCodeGenerator');


app1.get('/wapicall/:mno/:msg',(req, res) =>{
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


app1.listen(port1, () => {
    console.log( `Example app listening on port ${port1} `);
})
