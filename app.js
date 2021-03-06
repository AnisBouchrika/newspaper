const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const articles = require('./routes/articlesRoute.js');
const users = require('./routes/usersRoute.js');

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://projet:project@cluster0.zooko.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

/* mongoose.connect('mongodb://localhost:27017/Public-newspaper', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}); */
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (error) => {
    console.log(error);
});

let app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
     if (req.method === 'OPTIONS') {
         res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
         return res.status(200).json({});
     }
     next();
});

app.use('/api/articles', articles);
app.use('/api/users', users);
app.use('/', express.static(path.join(__dirname, '/client/build')));



app.get('*', function (req, res) {
    const index = path.join(process.env.PWD, '/build/index.html');
    res.sendFile(index);
  })

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});
