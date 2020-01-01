const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'client/build')))
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 5000;
// retrieve all object 
const util = require('util');
let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true, useUnifiedTopology:true });
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})
let totnum = 1;

// check numbers nd row
let findpara = (skipid, limitid, resactpg, totalobj) =>{ 
    
   
    let returnres = Todo.find().skip(parseInt(skipid)).limit(parseInt(limitid));    
    return returnres;
}
// code return pagination with total row count 
const paginationWithTotalCount = (function(req, res) {

    

    let id = parseInt(req.params.limit);
    let skipid = parseInt(req.params.skip);
    let totalrow;
   if(skipid == 1){
        skipid = 0;
   }
   if(req.params.actpg)
   {
    skipid = parseInt(skipid)-id;   
   }
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            
            Todo.find().exec((derr, tnum)=>{
                
                totnum = tnum.length;
                
            });
            let activpg;
            if(req.params.actpg){
                totalrow = req.params.actpg;
                activpg = req.params.actpg;
            }
            
            let totalobj = {totnum}            
            res.json({todos, totalobj, activpg, totalrow});            
        }
    }).skip(skipid).limit(id);

});

todoRoutes.route('/').get(function(req, res) {
    

    Todo.find().exec((err, tnum)=>{
        
        totnum = tnum.length;
    });;
        
    Todo.find(function(err, todos) {
       
        if (err) {
            console.log(err);
        } else {
           let totalobj = {totnum}
            
            res.json({todos, totalobj});
            
        }
    })
});
todoRoutes.route('/pagination/:skip/:limit').get(function(req, res) {

    paginationWithTotalCount(req, res);
   
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/update/:id').put(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        
        if (!todo){
            res.status(404).send("data is not found");
        }
        else if(!req.body.todo_description){
            res.status(404).send({message: "Data Description not found"});
        }    
        else
        {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
        }   
            todo.save().then(todo => {
                res.json('Tododd updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/:id/:skip/:limit/:actpg').delete(function(req, res){
    Todo.findByIdAndRemove(req.params.id)
    .then(todo=>{
        if(!todo){
            return res.status(404).send({message:"Id not Found = "+req.params.id})
        }
        
       
        Todo.find().exec((derr, tnum)=>{
            // After delete then total Row
                totnum = tnum.length;
                let totalobj = {totnum}
                let skipid = req.params.skip;
                let activpg = parseInt(req.params.actpg);
                let limitid = req.params.limit;
                let resactpg = activpg;
                let limittotnum;
                let totalrow;
               // console.log(totnum+'ddd otla num');
                let getvalu =  findpara(skipid, limitid, resactpg, totalobj).exec(function(err, todos){
                   // console.log((JSON.stringify(todos.length, null, 2))+'deded');
                    if(todos.length == 0)
                    {
                        //console.log('dededed tract');
                        req.params.actpg = parseInt(req.params.actpg) - 1;
                        req.params.id =  limitid;
                        //console.log('dededed tract'+JSON.stringify(req.params, null, 2));
                        paginationWithTotalCount(req, res);
                        
                        // console.log("Fff iside came");
                        // totalrow  = parseInt(req.params.actpg) - 1;
                        // skipid = totalrow*req.params.limit; 
                        // let activpg = totalrow;
                        // totalrow = {totalrow};
                       //return res.status(200).send({activpg, todos, totalrow});
                       
                    }
                    else
                    { 
                     totalrow = parseInt(totnum /  limitid);
                     let calnum = Math.ceil(parseInt(totnum)%limitid);
                     if(calnum != 0){
                        totalrow = totalrow + 1;  
                    }
                     //totalrow = {totalrow};
                    return res.status(200).send({todos, totalobj, activpg, totalrow});
                    //res.json({todos, totalobj, activpg, totalrow});            
                }
                    //res.status({activpg, todos, totalobj}) 
                    
                });
                
                //console.log((JSON.stringify(getresult, null, 2)));    
                
                if(!limittotnum){
                      
                }
                

               
                
                //  getresult = findpara(skipid, limitid, resactpg, totalobj);
                // getresult.exec(function(err, todos){
                //     console.log(JSON.stringify(result, null, 2))
                //     //res.json({todos, totalobj, activpg});                   
                // })
        });
    }).catch(err=>{
        if(err.kind === "objectId" || err.name === "NotFound"){
            console.log(err);
            return res.status(404).send({ message: "Id Not Valid"+req.params.id});    
        }
            return res.status(500).send({ message: "Id Cannot remove"+req.params.id
            })
    })
    
})

app.use('/api', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
