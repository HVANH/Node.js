const express = require('express');//viet goi api
const bodyParser = require('body-parser');//can de truy cap url localhost:3000/10/ no lay dc "10" tuc parameter ra
const app = express();
const fs = require('fs');   //doc file
var path = require('path'); //duong dan
var lodash = require('lodash'); 
var  JSONStream = require('JSONStream');    //can de cai stream day la json
var engines = require('consolidate');

app.engine('hbs',engines.handlebars);   //su dung views handlebars
app.set('view engine', 'hbs')
    //set the view engine ejs
//app.set('view engine','ejs')
app.set('views','./views');
app.use('/profilepics', express.static('images'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use (bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true}));
app.get('/',(req,res)=>{
   let users = [];
   fs.readdir('users',function(err, files) {
       if(err) throw err;
       files.forEach(function(file) {
           fs.readFile(path.join(__dirname,'users',file),{endcoding: 'utf8'},function(err,data) {  //doc tung file, dirname tro den thu muc goc
                if(err) throw err;
                const user = JSON.parse(data);
                user.name.full = lodash.startCase(user.name.first + ' ' + user.name.last);
                users.push(user);
                if(users.length === files.length)
                   // res.send(users);
                 res.render('index', {users: users})
                })
        })  // het 1 function
   })
})

app.get('/:username', function(req, res){
    var username = req.params.username
    var user = getUser(username)
   // res.send(user);
    res.render('user', {
        user: user,
        address: user.location
    })
 })

app.put('/:username',(req, res)=>{
     var username = req.params.username
     var user = getUser(username)
    // res.location = req.body
     saveUser(username, req.body)
    // res.end()
    //res.send(req.body)
})

function getUser(userName)
{
    var user = JSON.parse(fs.readFileSync(getUserFilePath(userName),{endcoding: 'utf8'}))
    user.name.full = lodash.startCase(user.name.first + ' ' + user.name.last)
    lodash.keys(user.location).forEach(function(key){
    user.location[key] = lodash.startCase(user.location[key])    
    })
    return user
}

function saveUser (username, data){
    var fp = getUserFilePath(username)
    fs.unlinkSync(fp) // delete the file
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), {endcoding: 'utf8'})
}

function getUserFilePath(userName){
    return path.join(__dirname, 'users', userName) + '.json';
}

app.listen(3000,()=>{console.log("App running at port 3000");})