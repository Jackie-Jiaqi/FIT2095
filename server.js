var express = require('express');
var app = express();
const morgan = require('morgan');
let bodyParser = require('body-parser');
var db
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';
MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log('Err  ', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db('fi2095tabe');
    }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())
app.use(morgan('tiny'));
//Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//Setup the static assets directories
app.use(express.static('images'));
app.use(express.static('css'));
app.get('/', function (req, res) {
    res.render('index.ejs', {
        title: "FIT2095",
    });
});

app.get('/create', function (req, res) {
    res.render('new.ejs');
});
app.post('/create',function(req,res){
    var taskname = req.body.taskname;
    var assign = req.body.assign;
    var duedate = req.body.duedate;
    var status = req.body.status;
    var description = req.body.description;
    db.collection('task').insertOne({taskname:taskname,assign:assign,duedate:duedate,status:status,description:description});
    res.redirect('/list');
    console.log(db);
})
app.get('/list',function(req,res){
    db.collection('task').find({}).toArray(function (err, data) {
    res.render('list.ejs', { db: data });
    });
});
app.get('/delete',function(req,res){
    db.collection('task').find({}).toArray(function (err, data) {
        res.render('delete.ejs', { db: data });
        });
})
app.post('/delete',function(req,res){
    var id = req.body.id;
    console.log(id,'id');
    db.collection('task').deleteOne({_id:new mongodb.ObjectID(id)});
    res.redirect('list');
})
app.get('/delete_status',function(req,res){
    db.collection('task').find({}).toArray(function (err, data) {
        res.render('delete_status.ejs', { db: data });
        });
})
app.post('/delete_status',function(req,res){
    db.collection('task').deleteMany({status:'Complete'})
        res.redirect('list');
})
app.get('/update',function(req,res){
    db.collection('task').find({}).toArray(function (err, data) {
        res.render('update.ejs', { db: data });
        });
})
app.post('/update',function(req,res){
    var id = req.body.id
    var status = req.body.status
    db.collection('task').updateOne({_id:new mongodb.ObjectID(id)},{$set:{status:status}})
    res.redirect('list');
})
app.listen(5678);