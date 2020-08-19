const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000
const path = require('path');
app.set( 'view engine', 'ejs' );
app.use('/static',express.static( path.join( __dirname, 'public' )));

app.get('/',(req,res) => {
    res.render('index');
})

app.listen(PORT,()=> console.log(`Listening on port ${PORT}`));