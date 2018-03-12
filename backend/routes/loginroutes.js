const fs = require('fs');
var requestify = require('requestify'); 

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/aics');

var Muser = require('../model/musers');

exports.register = function(req,res){
  var today = new Date();
  var muser = new Muser();
  muser.first_name=req.body.first_name;
  muser.last_name=req.body.last_name;
  muser.email=req.body.email;
  muser.password=req.body.password;
  muser.created=today;
  muser.modified=today;
  muser.save(function(error) {
     if (error) {
     console.log("error ocurred",error);
     res.send({
       "code":400,
       "failed":"error ocurred"+error
     })
     }else{
             res.send({
           "code":200,
           "success":"user registered sucessfully"
             });
     }
   });
}

exports.login = function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  var role = req.body.role;
  var rememberme = req.body.rememberme;

   Muser.find({email: email}, function(error, muser) {
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
          // console.log('The solution is: ', muser);
          // console.log('The solution length is: ', muser[0].password);
          if(muser.length >0){
            if(muser[0].password == req.body.password){
              // console.log(rememberme);
                if(rememberme=== true){
                  req.session.user = muser[0];
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
  // console.log(req.session);
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
  var url = '../docs/'+filename+'.htm';
  var terror = false;
  var tdata = '';

  fs.readFile(url,'utf8', (err, fd) => {
    if (err){
     terror=err;
     // console.log('Cookies: ', err);
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