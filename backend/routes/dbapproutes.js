const fs = require('fs');
var requestify = require('requestify'); 

var mysql = require('mysql');
var connection;
function handleDisconnect() {

	// connection = mysql.createConnection({
	// 								host     : 'localhost',
	// 								user     : 'root',
	// 								password : '',
	// 								database : 'demoapp',
	// 								insecureAuth: false
	// 							});
	connection = mysql.createConnection({
									host     : 'localhost',
									user     : 'root',
									password : 'root',
									database : 'default',
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

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/aics');

var MainMenu = require('../model/mainMenu');
var alltables = require('../model/alltables');

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
exports.getTables =  function(req, res){
	var today = new Date();
	var showtables = req.body.showtables;
	if(!showtables){
		MainMenu.find({}, function(err, menus) {
			// res.send({
			// 		 "code":200,
			// 		 "success":"Menu fetcched",
			// 		 "menus":menus
			// 			 });
		});
	}
	alltables= [];
	aalltables= 'i am hero';
	superhero = 0;
	connection.query('SELECT * FROM system_settings.tables where block_type="table"', function (error, tables, fields) {
		if (error) {
			console.log("error ocurred",error);
			res.send({
				"code":400,
				"failed":"error ocurred"
			})
		}else{
			tables.forEach(function(table) {
				var tablename = table.tablename;
				var tableschema = table.schema_name;

				connection.query('SELECT * FROM '+tableschema+'.'+tablename, function (error, tabledata, fields) {
					if (error) {
						console.log("error ocurred inside table"+tablename + "  ---",error);
						res.send({
							"code":400,
							"failed":"error ocurred"
						})
					}else{

						connection.query("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='"+tableschema+"' AND `TABLE_NAME`='"+tablename+"'", function (error, columns, fields) {
							if (error) {
								console.log("error ocurred inside table"+tablename + "  ---",error);
								res.send({
									"code":400,
									"failed":"error ocurred"
								})
							}else{
								prepitem = {};
								fields= [];
								columns.forEach(function(column){
									fields.push(column.COLUMN_NAME);
								});
								prepitem.name = tablename;
								prepitem.columns = fields;
								prepitem.schema = tableschema;
								prepitem.data = tabledata;
								alltables.push(prepitem);
								// tables.forEach(function(table) {
								// });

								superhero+= 1;
								if (superhero==tables.length) {
									console.log(alltables);
									res.send({
										 "code":200,
										 "success":true,
										 "tables":alltables
											 });
								} else {

								}
							}
						});
					}
				});
				// console.log("alltables ========",aalltables);

			});
			// console.log("alltables ========",alltables);
		}
	});



	// connection.query('SELECT * FROM musers WHERE email = ?',[email], function (error, results, fields) {
	// if (error) {
	// 	console.log("error ocurred",error);
	// 	res.send({
	// 		"code":400,
	// 		"failed":"error ocurred"
	// 	})
	// }else{
	// 	// console.log('The solution is: ', results[0].password,req.body.password,req.body.role);
	// 	if(results.length >0){
	// 		if(results[0].password == req.body.password){
	// 			console.log(rememberme);
	// 				if(rememberme=== true){
	// 					req.session.user = results[0];
	// 				}
	// 				res.send({
	// 					"code":200,
	// 					"success":"login sucessfull"
	// 				})
	// 		}
	// 		else{
	// 			// code 200 for testing actul code 204 for error
	// 			res.send({
	// 					 "code":20,
	// 					 "success":"Email and password does not match "
	// 			})
	// 		}

	// 	}
	// 	else{
	// 		res.send({
	// 			"code":204,
	// 			"success":"Email does not exits"
	// 		});
	// 	}


	// }
	// });

}