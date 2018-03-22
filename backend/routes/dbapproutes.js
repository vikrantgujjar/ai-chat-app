const fs = require('fs');
var requestify = require('requestify'); 

var mysql = require('mysql');
var connection;
//DEV
// const alltablesDef = 'tables';
// const hiddentablesDef = 'hiddentables';
// const relationshipDef = 'table_relationship';
// const menutableDef = 'main_menu';
// const menuitemsDef = 'menu_items';
// const allschemasDef = 'all_schemas';
// const headingsDef = 'headings';
// const IN_PRODUCTION_DEF = false;
// const sysDatabase = 'system_settings';
// const defUserDatabase = 'demoapp';


//PROD
const alltablesDef = 'tables';
const hiddentablesDef = 'hiddentables';
const relationshipDef = 'table_relationship';
const menutableDef = 'main_menu';
const menuitemsDef = 'menu_items';
const allschemasDef = 'all_schemas';
const headingsDef = 'headings';
const IN_PRODUCTION_DEF = true;
const sysDatabase = 'system_settings';
const defUserDatabase = 'default';


var defaultTables = '[{"Name": "Customers","Fields": [{ "Name": "Name","Type": "String"\
                                            },\
                                            {\
                                                "Name": "Address",\
                                                "Type": "String "\
                                            },\
                                            {\
                                                "Name": "Phone",\
                                                "Type": "String"\
                                            }\
                                        ]\
                                    },\
                                    {\
                                        "Name": "Products",\
                                        "Fields": [{\
                                                "Name": "Name",\
                                                "Type": "String"\
                                            },\
                                            {\
                                                "Name": "Price",\
                                                "Type": "String"\
                                            },\
                                            {\
                                                "Name": "Unit",\
                                                "Type": "String"\
                                            },\
                                            {\
                                                "Name": "Supplier",\
                                                "Type": "String"\
                                            }\
                                        ]\
                                    },\
                                    {\
                                        "Name": "Sales",\
                                        "Fields": [{\
                                                "Name": "CustomerID",\
                                                "Type": "ID"\
                                            },\
                                            {\
                                                "Name": "ProductID",\
                                                "Type": "ID"\
                                            },\
                                            {\
                                                "Name": "Qty",\
                                                "Type": "Integer"\
                                            }\
                                        ]\
                                    },\
                                    {\
                                        "Name": "Transactions",\
                                        "Fields": [{\
                                                "Name": "CustomerID",\
                                                "Type": "ID"\
                                            },\
                                            {\
                                                "Name": "Total",\
                                                "Type": "Currency"\
                                            },\
                                            {\
                                                "Name": "Method",\
                                                "Type": "String"\
                                            }\
                                        ]\
                                    },\
                                    {\
                                        "Name": "Transaction_items",\
                                        "Fields": [{\
                                                "Name": "TransactionID",\
                                                "Type": "ID"\
                                            },\
                                            {\
                                                "Name": "ProductID",\
                                                "Type": "ID"\
                                            },\
                                            {\
                                                "Name": "Qty",\
                                                "Type": "Integer"\
                                            }\
                                        ]\
                                    },\
                                    {\
                                        "Name": "Resources",\
                                        "Fields": [{\
                                                "Name": "Title",\
                                                "Type": "String"\
                                            },\
                                            {\
                                                "Name": "Author",\
                                                "Type": "String"\
                                            },\
                                            {\
                                                "Name": "Publisher",\
                                                "Type": "String"\
                                            },\
                                            {\
                                                "Name": "Year",\
                                                "Type": "Integer"\
                                            },\
                                            {\
                                                "Name": "Subject",\
                                                "Type": "String"\
                                            },\
                                            {\
                                                "Name": "ISBN",\
                                                "Type": "String"\
                                            },\
                                            {\
                                                "Name": "Dewy",\
                                                "Type": "String"\
                                            },\
                                            {\
                                                "Name": "Copy_number",\
                                                "Type": "Integer"\
                                            }, {\
                                                "Name": "Resource_type",\
                                                "Type": "String"\
                                            }\
                                        ]\
                                    },\
                                    {\
                                        "Name": "Resource_types",\
                                        "Fields": [{\
                                            "Name": "Name",\
                                            "Type": "ID"\
                                        }]\
                                    },\
                                    {\
                                        "Name": "Loans",\
                                        "Fields": [{\
                                            "Name": "CustomerID",\
                                            "Type": "ID"\
                                        }]\
                                    },\
                                    {\
                                        "Name": "Loan_items",\
                                        "Fields": [{\
                                                "Name": "LoanID",\
                                                "Type": "ID"\
                                            },\
                                            {\
                                                "Name": "ResourceID",\
                                                "Type": "ID"\
                                            },\
                                            {\
                                                "Name": "Status",\
                                                "Type": "string"\
                                            }\
                                        ]\
                                    }\
                                ]';
function handleDisconnect() {

	// connection = mysql.createConnection({
	// 								host     : 'localhost',
	// 								user     : 'root',
	// 								password : '',
	// 								database : sysDatabase,
	// 								insecureAuth: false
	// 							});
	connection = mysql.createConnection({
									host     : 'localhost',
									user     : 'root',
									password : 'root',
									database : sysDatabase,
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
			 "message":"error ocurred"+error
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


exports.hideBlock = function(req,res){
	var hideDesc = req.body.postData;
	var blockName = hideDesc.blockName;
	var hideBlockType = hideDesc.hideBlockType;
	var schema = hideDesc.schema;
	var hideAll = false;
	if (schema=='' ) {
        hideAll = true;
        if (hideBlockType=='heading') {
            hideAll = false;
            schema = sysDatabase;
        }else{
            schema = defUserDatabase;
        }
    }

    if (blockName=='*' ) {
    	if (hideAll && hideBlockType=='all') {
			connection.query("UPDATE "+alltablesDef+" SET ishidden=true WHERE 1=1", function (error,blocks) {
				if (error) {
					    res.send({
							"code":400,
							"message":"Error occured getting all blocks testcode=0001",
							"error" : error
						});
				}else{

					res.send({
						 "code":200,
						 "message":"All Tables and headings hidden"
					});

				}
			});
    	}else{
    		var toHideSqlNew = "UPDATE "+alltablesDef+" SET ishidden=true ";
    		if (!hideAll) {
                toHideSqlNew += " where schema_name='"+schema+"'";
            }
            if (hideBlockType !='all') {
                if (hideAll) {
                   toHideSqlNew += " where ";
                }else{
                    toHideSqlNew += " AND ";
                }
                toHideSqlNew += " block_type='"+hideBlockType+"'";
            }
            connection.query(toHideSqlNew, function (error,blocks) {
				if (error) {
					    res.send({
							"code":400,
							"message":"Error occured hidden command line testcode=0002",
							"error" : error
						});
				}else{
					var responseMessage ='';
					if(hideBlockType=='all'){
						responseMessage = "All tables and headings in shema "+schema+" hidden";
					}else{
						responseMessage = "All "+hideBlockType+" hidden"
					}
					res.send({
						 "code":200,
						 "message":responseMessage
							 });

				}
			});

    	}
    }else{
    	var hideQueryAllSchema = "UPDATE "+alltablesDef+" SET ishidden=true WHERE tablename='"+blockName+"'";
    	if(!hideAll){
    		hideQueryAllSchema += " AND schema_name='"+schema+"'";
    	}
    		connection.query(hideQueryAllSchema, function (error,blocks) {
				if (error) {
					    res.send({
							"code":400,
							"message":"Error occured getting all blocks testcode=0001",
							"error" : error
						});
				}else{

					res.send({
						 "code":200,
						 "message":"table "+blockName+" hidden"
					});

				}
			});
    }
}
exports.foreignColumn = function(req,res){
	var columnName = req.body.column;
	var schema = req.body.schema;
	var foreignTable = columnName+'s';

	connection.query('SELECT * FROM '+alltablesDef+' where tablename="'+foreignTable+'" AND schema_name="'+schema+'"', function (error, tabledata, fields) {
		if (error) {
			console.log("error ocurred inside table"+tablename + "  ---",error);
			res.send({
				"code":400,
				"message":"error ocurred"
			})
		}else{
			if(tabledata.length >= 1){
				connection.query("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='"+schema+"' AND `TABLE_NAME`='"+foreignTable+"'", function (error, columns, fields) {
					if (error) {
						console.log("error ocurred inside table"+tablename + "  ---",error);
						res.send({
							"code":400,
							"message":"error ocurred"
						})
					}else{

							var fieldName = columnName+' id';
							columns.every(function(column, index) {
								let loopcolname = column.COLUMN_NAME;
								if(loopcolname.toLowerCase().trim()=='name'){
									fieldName = columnName+' name';
									return false;
								}else if(loopcolname.toLowerCase().trim()=='title'){
									fieldName = columnName+' name';
									return false;
								}else{
									return true;
								}
							});
							res.send({
							 "code":200,
							 "success":true,
							 "fieldName":fieldName
							});
					}
				});
			}else{
				res.send({
						"code":400,
						"message":"NO table found"
					})
			}
		}
	});


}
exports.foreignColumnValue = function(req,res){
	var rowId = req.body.id;
	var schema = req.body.schema;
	var foreignTable = req.body.table;
	var field = req.body.field;
	field = field.toLowerCase().trim();

	connection.query('SELECT * FROM '+schema+'.'+foreignTable+' where id='+rowId, function (error, tabledata, fields) {
		if (error) {
			console.log("error ocurred inside table"+tablename + "  ---",error);
			res.send({
				"code":400,
				"message":"error ocurred"
			})
		}else{
			if(tabledata.length >= 1){
				res.send({
				 "code":200,
				 "success":true,
				 "fieldValue":tabledata[0][field]
				});
			}else{
				res.send({
						"code":400,
						"message":"NO Data found",
						"fieldValue" : 'Not Found'
					})
			}
		}
	});


}
exports.foreignFormSelect = function(req,res){
	var classNameAttr = req.body.class;
	var idNameAttr = req.body.id;
	var nameAttr = req.body.name;
	var schema = req.body.schema;
	var foreignTable = req.body.foreignTable;
	var field = req.body.field;
	field = field.toLowerCase().trim();

	connection.query('SELECT * FROM '+schema+'.'+foreignTable, function (error, tabledata, fields) {
		if (error) {
			console.log("error ocurred inside table"+tablename + "  ---",error);
			res.send({
				"code":400,
				"message":"error ocurred"
			})
		}else{
			var primaryValues = [];
			var formSelectString = '<select className="'+classNameAttr+'" name="'+nameAttr+'">';
			tabledata.forEach(function(row){
				let primaryValue={};
				primaryValue.id = row.id;
				primaryValue.value = row[field];
				primaryValues.push(primaryValue);
				formSelectString += '<option value="'+row.id+'">'+row[field]+'</option>';
			});
			console.log(primaryValues);
			formSelectString += '</select>';
				res.send({
				 "code":200,
				 "success":true,
				 "formString":formSelectString,
				 "primaryValues":primaryValues
				});
		}
	});


}
exports.showBlock = function(req,res){
	var hideDesc = req.body.postData;
	var blockName = hideDesc.blockName;
	var hideBlockType = hideDesc.hideBlockType;
	var schema = hideDesc.schema;
	var hideAll = false;
	if (schema=='' ) {
        hideAll = true;
        if (hideBlockType=='heading') {
            hideAll = false;
            schema = sysDatabase;
        }else{
            schema = defUserDatabase;
        }
    }

    if (blockName=='*' ) {
    	if (hideAll && hideBlockType=='all') {
			connection.query("UPDATE "+alltablesDef+" SET ishidden=false WHERE 1=1", function (error,blocks) {
				if (error) {
					    res.send({
							"code":400,
							"message":"Error occured getting all blocks testcode=0001",
							"error" : error
						});
				}else{

					res.send({
						 "code":200,
						 "message":"All Tables and headings shown"
					});

				}
			});
    	}else{
    		var toHideSqlNew = "UPDATE "+alltablesDef+" SET ishidden=false ";
    		if (!hideAll) {
                toHideSqlNew += " where schema_name='"+schema+"'";
            }
            if (hideBlockType !='all') {
                if (hideAll) {
                   toHideSqlNew += " where ";
                }else{
                    toHideSqlNew += " AND ";
                }
                toHideSqlNew += " block_type='"+hideBlockType+"'";
            }
            connection.query(toHideSqlNew, function (error,blocks) {
				if (error) {
					    res.send({
							"code":400,
							"message":"Error occured hidden command line testcode=0002",
							"error" : error
						});
				}else{
					var responseMessage ='';
					if(hideBlockType=='all'){
						responseMessage = "All tables and headings in shema "+schema+" hidden";
					}else{
						responseMessage = "All "+hideBlockType+" shown"
					}
					res.send({
						 "code":200,
						 "message":responseMessage
							 });

				}
			});

    	}
    }else{
    	var showQueryAllSchema = "UPDATE "+alltablesDef+" SET ishidden=false WHERE tablename='"+blockName+"'";
    	if(!hideAll){
    		showQueryAllSchema += " AND schema_name='"+schema+"'";
    	}
    		connection.query(showQueryAllSchema, function (error,blocks) {
				if (error) {
					    res.send({
							"code":400,
							"message":"Error occured getting all blocks testcode=0001",
							"error" : error
						});
				}else{

					res.send({
						 "code":200,
						 "message":hideBlockType+" "+blockName+" shown"
					});

				}
			});
    }
}

function mysql_real_escape_string_cut (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}
exports.createTables =  function(req, res){
	var tableData = req.body.postData;
	var tableName = tableData.table;
	tableName = mysql_real_escape_string_cut(tableName);
	tableName = tableName.toLowerCase();
	var schemaName = tableData.schema;
	if (schemaName=='') {
    	schemaName = defUserDatabase;
    }
	for (var key in tableData) {
        if (key == 'table' || key == 'schema') {
            delete tableData[key];
        }
    }
    // console.log(tableData);
    if (typeof tableData.foreign !== 'undefined' && !(Object.keys(tableData.foreign).length === 0 && tableData.foreign.constructor === Object)  ) {
    	var eachForeignTableLoop = Object.keys(tableData.foreign).length;//  must be 0 to finish loop
		Object.keys(tableData.foreign).forEach(function(key) {
			eachForeignTableLoop--;
			foreignTable = tableData.foreign[key];
			var foreignTableName = foreignTable.table;
			foreignTableName =mysql_real_escape_string_cut(foreignTableName);
			var foreignFieldsValue = '';
			for (var key in foreignTable) {
        		if (key == 'table' || key == 'schema') {
            		delete foreignTable[key];
        		}else{
        			foreignFieldsValue += "('"+foreignTable[key].trim()+"'),";
        		}
    		}
    		foreignFieldsValue = foreignFieldsValue.slice(0, -1);

    		connection.query('CREATE SCHEMA IF NOT EXISTS '+schemaName, function (error) {
				if (error) {
					    res.send({
							"code":400,
							"message":"Error occured validating schema, name -"+schemaName,
							"error" : error
						});
				}else{
					var thisSubTableSql = "CREATE TABLE "+schemaName+'.'+foreignTableName+" ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, date TIMESTAMP)";
					connection.query(thisSubTableSql, function (error) {
						if (error) {
							res.send({
								"code":400,
								"message":"Error occured while creating subtable, saubtable name- "+foreignTableName,
								"error" : error
							});
						}else{
							var updateAllTableSql = "INSERT INTO "+alltablesDef+" (tablename,schema_name) VALUES ('"+foreignTableName+"','"+schemaName+"')";
							connection.query(updateAllTableSql, function (error, queryResponse) {
								if (error) {
									res.send({
										"code":400,
										"message":"Error occured while adding subtable to all tables, subtable name- "+foreignTableName,
										"error" : error
									});
								}else{
									var thisSubTableId = queryResponse.insertId;
									connection.query("SELECT * FROM "+menutableDef+" where current=1", function (error, mQueryResponse) {
										if (error) {
											res.send({
												"code":400,
												"message":"Error occured while getting current menu, on file dbapproutes,  line 331 ",
												"error" : error
											});
										}else{
											var currentMenuId = mQueryResponse.insertId;
											connection.query("INSERT INTO "+menuitemsDef+" (menu_id,tables_id) VALUES  ('"+thisSubTableId+"','"+currentMenuId+"')", function (error, miqueryResponse) {
												if (error) {
													res.send({
														"code":400,
														"message":"Error occured while adding subtable-'"+foreignTableName+"' to current menu, on file dbapproutes,  line 340 ",
														"error" : error
													});
												}else{
													connection.query("INSERT INTO "+schemaName+"."+foreignTableName+" (name) VALUES  "+foreignFieldsValue, function (error, subTableInsertQueryResponse) {
														if (error) {
															res.send({
																"code":400,
																"message":"Error occured while inserting data value="+foreignFieldsValue+" to subtable-'"+foreignTableName+"' , on file dbapproutes,  line 351 ",
																"error" : error
															});
														}else{
															if(eachForeignTableLoop==0){
																delete tableData['foreign'];
																var mainTableSql = "CREATE TABLE "+schemaName+'.'+tableName+" ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,";
																if(Object.keys(tableData).length === 0 && tableData.constructor === Object){
																	defaultTableObj = JSON.parse(defaultTables);
														            defaultFound = false;
														            Object.keys(defaultTableObj).forEach(function(key){
														            	var deftable = defaultTableObj[key];
														                var thisTableName = deftable.Name;
														                thisTableName = thisTableName.toLowerCase();
														                thisTableName = thisTableName.trim();
														                if(thisTableName==tableName){
														                    Object.keys(deftable.Fields).forEach(function(key){
														                    	var deftablefield= deftable.Fields[key];
														                        switch(deftablefield.Type){
														                            case 'String':
														                                mainTableSql += deftablefield.Name+" VARCHAR(100) NOT NULL, ";
														                                break;
														                            case 'ID':
														                                mainTableSql += deftablefield.Name+" INT NOT NULL, ";
														                                break;
														                            case 'Integer':
														                                mainTableSql += deftablefield.Name+" INT NOT NULL, ";
														                                break;
														                            case 'Currency':
														                                mainTableSql += deftablefield.Name+" float NOT NULL, ";
														                                break;
														                            default:
														                                mainTableSql += deftablefield.Name+" VARCHAR(100) NOT NULL, ";
														                                break;
														                        }
														                    });
														                }
														            });

														            mainTableSql += " date TIMESTAMP)";
														            // console.log(mainTableSql);
																}else{
																	Object.keys(tableData).forEach(function(key) {
																		eachForeignTableLoop--;
																		mainTableField = tableData[key].toLowerCase();
																		mainTableField = mysql_real_escape_string_cut(mainTableField);
																		if(mainTableField=='id' || mainTableField=='date'){

														                }
														                else if (mainTableField=='quantity' || mainTableField =='qty' || mainTableField =='number' || mainTableField =='count') {
														                    mainTableSql += mainTableField+" integer(30) NOT NULL,";
														                }
														                else if (mainTableField=='status' || mainTableField =='done' || mainTableField =='check') {
														                    mainTableSql += mainTableField+" boolean NOT NULL,";
														                }
														                else if (mainTableField=='height' || mainTableField =='weight' || mainTableField =='mass' || mainTableField =='volume' || mainTableField =='measurement' || mainTableField =='size' || mainTableField =='length' || mainTableField =='depth') {
														                    mainTableSql += mainTableField+" float NOT NULL,";
														                }
														                else if (mainTableField=='body' || mainTableField =='text' || mainTableField =='info') {
														                    mainTableSql += mainTableField+" text NOT NULL,";
														                }
														                else if (mainTableField=='date' || mainTableField =='time' || mainTableField =='datetime') {
														                    mainTableSql += mainTableField+" datetime NOT NULL,";
														                }
														                else if (mainTableField=='price' || mainTableField =='cost' || mainTableField =='total' || mainTableField =='sub-total' || mainTableField =='grand-total' || mainTableField =='tax' || mainTableField =='ex-tax' || mainTableField =='inc-tax' || mainTableField =='retail' || mainTableField =='wholesale') {
														                    mainTableSql += mainTableField+" float NOT NULL,";
														                }else{
														                    mainTableSql += mainTableField+" VARCHAR(100) NOT NULL,";
														                }
																	});
																	mainTableSql += " date TIMESTAMP)";
																}
																connection.query(mainTableSql, function (error) {
																	if (error) {
																		res.send({
																			"code":400,
																			"message":"Error occured while creating mainTable, btable name- "+tableName,
																			"error" : error
																		});
																	}else{
																		var updateAllTableSql = "INSERT INTO "+alltablesDef+" (tablename,schema_name) VALUES ('"+tableName+"','"+schemaName+"')";
																		connection.query(updateAllTableSql, function (error, queryResponse) {
																			if (error) {
																				res.send({
																					"code":400,
																					"message":"Error occured while adding mainbtable to all tables, mainbtable name- "+tableName,
																					"error" : error
																				});
																			}else{
																				var thisSubTableId = queryResponse.insertId;
																				connection.query("SELECT * FROM "+menutableDef+" where current=1", function (error, mQueryResponse) {
																					if (error) {
																						res.send({
																							"code":400,
																							"message":"Error occured while getting current menu, on file dbapproutes,  line 331 ",
																							"error" : error
																						});
																					}else{
																						var currentMenuId = mQueryResponse.insertId;
																						connection.query("INSERT INTO "+menuitemsDef+" (menu_id,tables_id) VALUES  ('"+thisSubTableId+"','"+currentMenuId+"')", function (error, miqueryResponse) {
																							if (error) {
																								res.send({
																									"code":400,
																									"message":"Error occured while adding subtable-'"+tableName+"' to current menu, on file dbapproutes,  line 340 ",
																									"error" : error
																								});
																							}else{
																										res.send({
																											"code":20,
																											"message":"Table Created successfully",
																											"error" : error
																										});

																							}
																						});

																					}
																				});

																			}
																		});

																	}
																});

															}

														}
													});

												}
											});

										}
									});

								}
							});

						}
					});
				}
			});

			

		});
	}else{
		delete tableData['foreign'];
		// console.log(tableData);
		var mainTableSql = "CREATE TABLE "+schemaName+'.'+tableName+" ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,";
		if(Object.keys(tableData).length === 0 && tableData.constructor === Object){
			defaultTableObj = JSON.parse(defaultTables);
            defaultFound = false;
            Object.keys(defaultTableObj).forEach(function(key){
            	var deftable = defaultTableObj[key];
                var thisTableName = deftable.Name;
                thisTableName = thisTableName.toLowerCase();
                thisTableName = thisTableName.trim();
                if(thisTableName==tableName){
                    Object.keys(deftable.Fields).forEach(function(key){
                    	var deftablefield= deftable.Fields[key];
                        switch(deftablefield.Type){
                            case 'String':
                                mainTableSql += deftablefield.Name+" VARCHAR(100) NOT NULL, ";
                                break;
                            case 'ID':
                                mainTableSql += deftablefield.Name+" INT NOT NULL, ";
                                break;
                            case 'Integer':
                                mainTableSql += deftablefield.Name+" INT NOT NULL, ";
                                break;
                            case 'Currency':
                                mainTableSql += deftablefield.Name+" float NOT NULL, ";
                                break;
                            default:
                                mainTableSql += deftablefield.Name+" VARCHAR(100) NOT NULL, ";
                                break;
                        }
                    });
                }
            });

            mainTableSql += " date TIMESTAMP)";
            // console.log(mainTableSql);
		}else{
			Object.keys(tableData).forEach(function(key) {
				eachForeignTableLoop--;
				mainTableField = tableData[key].toLowerCase();
				mainTableField = mysql_real_escape_string_cut(mainTableField);
				if(mainTableField=='id' || mainTableField=='date'){

                }
                else if (mainTableField=='quantity' || mainTableField =='qty' || mainTableField =='number' || mainTableField =='count') {
                    mainTableSql += mainTableField+" integer(30) NOT NULL,";
                }
                else if (mainTableField=='status' || mainTableField =='done' || mainTableField =='check') {
                    mainTableSql += mainTableField+" boolean NOT NULL,";
                }
                else if (mainTableField=='height' || mainTableField =='weight' || mainTableField =='mass' || mainTableField =='volume' || mainTableField =='measurement' || mainTableField =='size' || mainTableField =='length' || mainTableField =='depth') {
                    mainTableSql += mainTableField+" float NOT NULL,";
                }
                else if (mainTableField=='body' || mainTableField =='text' || mainTableField =='info') {
                    mainTableSql += mainTableField+" text NOT NULL,";
                }
                else if (mainTableField=='date' || mainTableField =='time' || mainTableField =='datetime') {
                    mainTableSql += mainTableField+" datetime NOT NULL,";
                }
                else if (mainTableField=='price' || mainTableField =='cost' || mainTableField =='total' || mainTableField =='sub-total' || mainTableField =='grand-total' || mainTableField =='tax' || mainTableField =='ex-tax' || mainTableField =='inc-tax' || mainTableField =='retail' || mainTableField =='wholesale') {
                    mainTableSql += mainTableField+" float NOT NULL,";
                }else{
                    mainTableSql += mainTableField+" VARCHAR(100) NOT NULL,";
                }
			});
			mainTableSql += " date TIMESTAMP)";
		}
		connection.query(mainTableSql, function (error) {
			if (error) {
				res.send({
					"code":400,
					"message":"Error occured while creating mainTable, btable name- "+tableName,
					"error" : error
				});
			}else{
				var updateAllTableSql = "INSERT INTO "+alltablesDef+" (tablename,schema_name) VALUES ('"+tableName+"','"+schemaName+"')";
				connection.query(updateAllTableSql, function (error, queryResponse) {
					if (error) {
						res.send({
							"code":400,
							"message":"Error occured while adding mainbtable to all tables, mainbtable name- "+tableName,
							"error" : error
						});
					}else{
						var thisSubTableId = queryResponse.insertId;
						connection.query("SELECT * FROM "+menutableDef+" where current=1", function (error, mQueryResponse) {
							if (error) {
								res.send({
									"code":400,
									"message":"Error occured while getting current menu, on file dbapproutes,  line 331 ",
									"error" : error
								});
							}else{
								var currentMenuId = mQueryResponse.insertId;
								connection.query("INSERT INTO "+menuitemsDef+" (menu_id,tables_id) VALUES  ('"+thisSubTableId+"','"+currentMenuId+"')", function (error, miqueryResponse) {
									if (error) {
										res.send({
											"code":400,
											"message":"Error occured while adding subtable-'"+tableName+"' to current menu, on file dbapproutes,  line 340 ",
											"error" : error
										});
									}else{
										
												res.send({
													"code":20,
													"message":"Table Created successfully",
													"error" : error
												});

										

									}
								});

							}
						});

					}
				});

			}
		});
	}
	// tableData.forEach(function(commandLine) {

	// });
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
	superhero = 0;
	connection.query('SELECT * FROM '+alltablesDef, function (error, tables, fields) {
		if (error) {
			console.log("error ocurred",error);
			res.send({
				"code":400,
				"message":"error ocurred"
			})
		}else{
			var issuperher = true;
			tables.forEach(function(table) {
				issuperher = false;
				var tablename = table.tablename;
				var tableschema = table.schema_name;
				var tablesishidden = table.ishidden;
				// console.log(table);
				if(table.block_type == 'table'){
					connection.query('SELECT * FROM '+tableschema+'.'+tablename, function (error, tabledata, fields) {
						if (error) {
							console.log("error ocurred inside table"+tablename + "  ---",error);
							res.send({
								"code":400,
								"message":"error ocurred"
							})
						}else{

							connection.query("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='"+tableschema+"' AND `TABLE_NAME`='"+tablename+"'", function (error, columns, fields) {
								if (error) {
									console.log("error ocurred inside table"+tablename + "  ---",error);
									res.send({
										"code":400,
										"message":"error ocurred"
									})
								}else{

										prepitem = {};
										fields= [];
										columns.forEach(function(column){
											let colForLoop = {};
											colForLoop.name = column.COLUMN_NAME
											fields.push(colForLoop);
										});
										prepitem.blocktype = 'table';
										prepitem.name = tablename;
										prepitem.tableId = table.id;
										prepitem.ishidden = tablesishidden;
										prepitem.columns = fields;
										prepitem.schema = tableschema;
										prepitem.data = tabledata;
										alltables.push(prepitem);
										// tables.forEach(function(table) {
										// });

										superhero+= 1;
										if (superhero==tables.length) {
											// console.log(alltables);
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
				}else if(table.block_type == 'heading'){
					connection.query('SELECT * FROM '+headingsDef+' WHERE id='+tablename, function (error, headings, fields) {
						if (error) {
							console.log("error ocurred inside table"+tablename + "  ---",error);
							res.send({
								"code":400,
								"message":"error ocurred while fetching heading, id-"+tablename,
								"error" : error
							})
						}else{
							prepitem = {};
							prepitem.blocktype = 'heading';
							prepitem.name = tablename;
							prepitem.tableId = table.id;
							prepitem.heading = headings[0].heading;
							prepitem.isbold = headings[0].bold;
							prepitem.ishidden = tablesishidden;
							prepitem.schema = tableschema;
							alltables.push(prepitem);
							superhero+= 1;
							if (superhero==tables.length) {
								// console.log(alltables);
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
			if(issuperher){
				res.send({
					 "code":200,
					 "success":true,
					 "tables":alltables
						 });
			}
		}
	});




}