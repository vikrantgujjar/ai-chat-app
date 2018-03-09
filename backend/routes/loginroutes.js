var mysql = require('mysql');
// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: '*****@gmail.com',
//     pass: '******@1'
//   }
// });
// var bcrypt = require('bcrypt');
// var jsonfile = require('jsonfile');
const fs = require('fs');
var requestify = require('requestify'); 

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'clstdb',
//   insecureAuth: false
// });

// connection.connect(function(err){
// if(!err) {
//     console.log("Database is connected ... nn");
// } else {
//     console.log("Error connecting database ... nn",err);
// }
// });


var connection;

function handleDisconnect() {

  connection = mysql.createConnection({
                  host     : 'localhost',
                  user     : 'root',
                  password : 'root',
                  database : 'clstdb',
                  insecureAuth: false
                });

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
       // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

exports.register = function(req,res){
  // console.log("req",req.body);
  var today = new Date();
  // bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
   //save to db
   var users={
     "first_name":req.body.first_name,
     "last_name":req.body.last_name,
     "email":req.body.email,
     "password":req.body.password,
     "created":today,
     "modified":today
   }
   connection.query('INSERT INTO musers SET ?',users, function (error, results, fields) {
   if (error) {
     console.log("error ocurred",error);
     res.send({
       "code":400,
       "failed":"error ocurred"+error
     })
   }else{
    //  console.log('The solution is: ', results);

    //send verification email
    // var mailOptions = {
    //   from: 'vikrant08081992@gmail.com',
    //   to: 'vikrant.rise@gmail.com',
    //   subject: 'Sending Email using Node.js',
    //   text: 'That was easy!'
    // };

    // transporter.sendMail(mailOptions, function(error, info){
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     // console.log('Email sent: ' + info.response);
       
    //   }
    // });

      res.send({
         "code":200,
         "success":"user registered sucessfully"
           });
   }
   });
  // });


}

exports.login = function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  var role = req.body.role;
  var rememberme = req.body.rememberme;
  connection.query('SELECT * FROM musers WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    // console.log('The solution is: ', results[0].password,req.body.password,req.body.role);
    if(results.length >0){
      if(results[0].password == req.body.password){
        console.log(rememberme);
          if(rememberme=== true){
            req.session.user = results[0];
          }
          res.send({
            "code":200,
            "success":"login sucessfull"
          })
      }
      else{
        // code 200 for testing actul code 204 for error
        res.send({
             "code":20,
             "success":"Email and password does not match "
        })
      }

    }
    else{
      res.send({
        "code":204,
        "success":"Email does not exits"
      });
    }


  }
  });
}



exports.islogin = function(req,res){
  // console.log('Cookies: ', req.cookies);
  // console.log(req.session);
  if (req.session.user) {
      res.send({
        "code":200,
        "success":"logged in"+req.cookies
        });
    } else {
        res.send({
          "code":204,
          "success":"Not logged in"
        });
    }
}
exports.getUserData = function(req,res){
  // console.log('Cookies: ', req.cookies);
  console.log(req.session);
  if (req.session.user) {
      res.send({
        "code":200,
        "success":true,
        "user" : req.session.user
        });
    } else {
        res.send({
          "code":204,
          "success":"Not logged in"
        });
    }
}
exports.sendmessage = function(req,res){

  var optionshttp = {
  host: '138.68.50.25',
  port: 80,
  path: '/api/chat',
  method: 'POST'
};
console.log('active ------------- ');

requestify.post('http://138.68.50.25/api/chat', {
    "input":req.body.input,
        "session_number":10
  })
  .then(function(response) {
    // Get the response body (JSON parsed or jQuery object for XMLs)
    response.getBody();
    console.log(response.getBody());
    res.send(response.getBody());
    // Get the raw response body
    response.body;
  });
console.log('END ------------- ');
      // res.send({
      //       "input": "I like fish because my father was a fisherman",
      //       "match_score": 1.2289277777777778,
      //       "output": "effect\t\tI like fish\t\t12.2666666667\t\tpA:like = oB, pA.spro = I, oB.opro = fish\n\t\tbecause\t\t200.0\t\t<because>\ncause\t\tmy father was fisherman\t\t3.65\t\tpA.isa = fisherman, pB:has = pA, pB.ppro = my",
      //       "session_number": 10,
      //       "success": true
      //     });
}
exports.readfile = function(req,res){
  var filename= req.body.filename;
  var url = '../files/'+filename+'.htm';
  var terror = false;
  var tdata = '';

  fs.readFile(url,'utf8', (err, fd) => {
    if (err){
     terror=err;
     console.log('Cookies: ', err);
     res.send({
          "output": ""+terror,
          "success": false
        });
    }else{
      terror = false;
      tdata = fd;
      // console.log('Cookies: ', fd);
              res.send({
            "output": fd,
            "success": true
          });
    }
  });

}
exports.logout = function(req,res){
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        res.send({
          "code":204,
          "success":"Error"
          });
      } else {
          res.send({
            "code":200,
            "success":"logout sucessfull"
          })
      }
    });
  }
}