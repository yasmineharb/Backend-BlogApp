const express = require('express')
const articleApi = require('./routes/article')
const authorApi = require('./routes/author')
require('./config/connect')

const app = express(); 
app.use(express.json())


const cors = require('cors');

// Autoriser une origine spécifique
app.use(cors());


// Exposer le dossier de uploads
app.use('/uploads', express.static('uploads'));
app.use('/article', articleApi)
app.use('/author', authorApi)

app.use('getimage', express.static('./uploads'))

app.listen(3000, () => {
    console.log('server working .. ')
})