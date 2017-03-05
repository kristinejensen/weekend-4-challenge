var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = {
  database: 'phi',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

router.get('/', function(req, res){
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM tasks;', function(errorMakingQuery, result){
        done();
        if(errorMakingQuery){
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
          console.log(result.rows);
        }
      });
    }
  }); // end of pool.connect
}); // end of router.get

router.post('/new', function(req, res){
  var newTask = req.body;

  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      client.query('INSERT INTO tasks (task_name, details, due_date, complete) VALUES ($1, $2, $3, $4);',
      [newTask.taskName, newTask.taskDetails, newTask.dueDate, newTask.complete],
      function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
}); // end of router post function


// router.put('/complete/:id', function(req, res){
//   var taskID = req.params.id;
//   var taskObject = req.body;
//   console.log('the task object is: ', taskObject);
//   console.log('id of task to save: ', taskID);
//   pool.connect(function(errorConnectingToDatabase, client, done){
//     if(errorConnectingToDatabase) {
//       console.log('Error connecting to database: ', errorConnectingToDatabase);
//       res.sendStatus(500);
//     }else{
//     client.query('UPDATE tasks SET ')
//     }
//   });
// }); // end of router put function



module.exports = router;
