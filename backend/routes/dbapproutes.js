const fs = require('fs');
var requestify = require('requestify'); 

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/aics');

var MainMenu = require('../model/MainMenu');

exports.getMenu = function(req,res){
    MainMenu.find({}, function(err, menus) {
      res.send({
           "code":200,
           "success":"Menu fetcched",
           "menus":menus
             });
    });
}


exports.createMenu =  function(req, res){
  var today = new Date();
  var menu = new MainMenu();
  menu.item='purchases';
  menu.schemaName='cdn';
  menu.current=true;
  menu.tabelCount='9';
  menu.tableId=[44];
  menu.save(function(error) {
     if (error) {
     console.log("error ocurred",error);
     res.send({
       "code":400,
       "failed":"error ocurred"+error
     })
     }else{
       console.log('menu created');
             res.send({
           "code":200,
           "success":"user registered sucessfully"
             });
     }
   });

}