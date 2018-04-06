import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import LoginScreen from './Loginscreen';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import Message from './components/Message.js';
import DbAppMenu from './components/DbAppMenu.js';
import DbAppTable from './components/DbAppTable.js';
import axios from 'axios';
import appConfig from './config/appConfig';

class UploadScreen extends Component {


	constructor(props){
		super(props);
		this.state={
			inputmessage:'',
			filename:'Filename',
			filecontent:'',
			toggleClassRightArea:'righttArea float-col-3 hidden',
			toggleClassDbAppRightArea:'dbApprighttArea float-col-3',
			toggleClassCenterArea:'dbappCentertArea float-col-3 ',
			chats: [],
			isChatActive: false,
			username: '',
			DbMenus: [{item:'pidf'},{item:'pidfl'}],
			activemenu: false,
			showtables:'',
			tablesdata:[]
		}

		this.submitMessage = this.submitMessage.bind(this);
		this.dbappPostData = this.dbappPostData.bind(this);
	}


	componentWillMount(){
		var self = this;
		axios.get(appConfig.apiBaseUrl+'getUserData', {withCredentials: true})
		 .then(function (response) {
			 if(response.data.code === 200){
					self.setState({username: response.data.user.first_name})
			 }
			 else if(response.data.code === 204){
			 }
			 else{
				 console.log('unexpected error');
			 }
		 })
		 .catch(function (error) {
			 console.log(error);
		 });


		axios.get(appConfig.apiBaseUrl+'getMenu', {withCredentials: true})
		 .then(function (response) {
			if(response.data.code === 200){
				 self.setState({DbMenus:response.data.menus}, () => {
							// ReactDOM.findDOMNode(self.refs.msg).value = "";
					});
				 

				 self.state.DbMenus.map((menu) => {
					    if(menu.current){
					    	self.setState({showtables: menu.tableId});
					    }
					});
				 self.reloadTables();
				 console.log(self.state.showtables);
			 }
			 else if(response.data.code === false){
				 console.log("Email password do not match");
				 // self.setState({filecontent:'error occured '+response.data.output})
			 }
			 // else{
			 //   console.log("Email does not exists");
			 //   alert("Email does not exist");
			 // }
		 })
		 .catch(function (error) {
			 console.log(error);
		 });
	}

	reloadTables(){
		var self = this;

		var payload={
				tables:self.state.showtables
			}
		axios.post(appConfig.apiBaseUrl+'getTables',payload, {withCredentials: true})
		 .then(function (response) {
			if(response.data.code === 200){

				let asdfg =response.data.tables;
				asdfg.sort(function(a, b){
				    return a.tableId - b.tableId;
				});
				 self.setState({tablesdata:asdfg}, () => {
							// ReactDOM.findDOMNode(self.refs.msg).value = "";
					});
				 
				 console.log(asdfg);
			 }
			 else if(response.data.code === false || response.data.code === 400){
				 console.log("Email password do not match");
				 console.log(response.data);
				 // self.setState({filecontent:'error occured '+response.data.output})
			 }
			 // else{
			 //   console.log("Email does not exists");
			 //   alert("Email does not exist");
			 // }
		 })
		 .catch(function (error) {
			 console.log(error);
		 });
	}

	componentDidMount() {
			this.scrollToBot();
	}

	componentDidUpdate() {
			this.scrollToBot();
	}

	scrollToBot() {
			ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
	}
	dbappPostData(apiroute, postData){
		var self = this;
		var payload={
						"postData":postData
					}
		axios.post(appConfig.apiBaseUrl+apiroute, payload, {withCredentials: true})
		 .then(function (response) {
			console.log(response);
			if(response.data.success === true || response.data.code ===200){
				ReactDOM.findDOMNode(self.refs.msg).value='';
				console.log("data sent successfull");
				alert(response.data.message);
				self.reloadTables();
			 }
			 else if(response.data.code === 400){
				 console.log(response.data);
				 if(response.data.error.code=="ER_TABLE_EXISTS_ERROR"){
				 	alert("Error ! "+response.data.error.sqlMessage);
				 }else{
				 	alert(response.data.message);
				 }
			 }
			 else{
				 // console.log("Email does not exists");
				 // alert("Email does not exist");
			 }
		 })
		 .catch(function (error) {
			 console.log(error);
		 });
	}
	is_alphanum(string,optionalchar='') {
	    if (optionalchar!='') {
	        optionalchar = optionalchar.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	    }
	    var regex = new RegExp("^[a-zA-Z0-9-=" + optionalchar + " ]*$", "g");
	    // $preg = /^[a-zA-Z0-9-=_ ]*$/;
	    if (regex.test(string) == true ) {
	        return true;
	    }else{
	        return false;
	    }
	}
	in_string(character,string) {
	    if (string.indexOf(character) >= 0) {
	        return true;
	    }else{
	        return false;
	    }
	}
	submitMessage(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			var self = this;
			let inputmsg = ReactDOM.findDOMNode(self.refs.msg).value;
			inputmsg = inputmsg.trim();
			var userCommand = inputmsg.toLowerCase();
			var userCommandBox = ReactDOM.findDOMNode(self.refs.msg);
			if (userCommand=='build dbapp') {
				self.setState({isChatActive:false});
				self.setState({toggleClassRightArea:'righttArea float-col-3 hidden'});
				self.setState({toggleClassDbAppRightArea:'dbApprighttArea float-col-3'});
				self.setState({toggleClassCenterArea:'dbappCentertArea float-col-3 '});
				ReactDOM.findDOMNode(self.refs.msg).value = "";
			}
			if (userCommand=='exit dbapp') {
				self.setState({isChatActive:true});
				self.setState({toggleClassRightArea:'righttArea float-col-3 hidden'});
				self.setState({toggleClassDbAppRightArea:'dbApprighttArea float-col-3 hidden'});
				self.setState({toggleClassCenterArea:'centertArea float-col-3 '});
				ReactDOM.findDOMNode(self.refs.msg).value = "";
			}
			if (userCommand !='build dbapp' && userCommand !='exit dbapp' && !self.state.isChatActive) {
				var schema = '';
				if (userCommand.substring(0,6)=='table:' && userCommand.substring(0,7)!='table: ' ) {
					alert('Table commande error! Please use \ntable: tablename\n >Column1\n>Column2\n>Column3');   //create table error here ... do something good man
				}else if (userCommand.substring(0,7)=='table: ' ) {
					var userCommandLines = userCommand.split("\n");
					var tableName = userCommandLines[0].split("table: ");
					tableName['1'] = tableName['1'].trim();
					if (tableName['1'] == '' || /^[a-zA-Z0-9-_ ]*$/.test(tableName['1'] ) == false ||  /\s/g.test(tableName['1'])) {
						userCommandBox.value = userCommand.replace("\n", "");
                    	alert("Table name is empty or contains illegal characters");
					}else{
						var fieldCount = 0;
						var newField = true;
						var form_data = {};
						form_data['foreign'] = {};
						var errorInField = false;
						userCommandLines.forEach(function(commandLine) {
							if (commandLine.indexOf(">") == 0 ){
								if ((commandLine.match(/>/g) || []).length>1) {
                                	errorInField = true;
                            	}else{
                            		fieldCount++;
                            		var fieldTitle = commandLine.split(">")[1];
                            		fieldTitle = fieldTitle.trim();
                            		if (/^[a-zA-Z0-9-=, ]*$/.test(fieldTitle) == false || (fieldTitle.match(/=/g) || []).length>1) {
	                                    errorInField = true;
	                                }else{
	                                	if (fieldTitle!='' && /^[a-zA-Z0-9- ]*$/.test(fieldTitle) == true) {
	                                		if (/\s/g.test(fieldTitle)) {
                                            	errorInField = true;
	                                        }else{
	                                            form_data['field'+fieldCount] = fieldTitle;
	                                            newField= true;
	                                        }
	                                	}else if(fieldTitle!='' && /^[a-zA-Z0-9-=, ]*$/.test(fieldTitle) == true){
	                                		var foreignTableCount = 0;
	                                		var foreignTable = {};
	                                		var foreignTableDesc = fieldTitle.split("=");
	                                        foreignTableDesc[0] = foreignTableDesc[0].trim();
	                                        form_data['field'+fieldCount] = foreignTableDesc[0]+'id';
	                                        foreignTable['table'] = foreignTableDesc[0]+'s';

	                                        var foreign_table_fields = foreignTableDesc[1].split(",");
	                                        foreign_table_fields.forEach(function(tableCol) {
	                                            if (/^[a-zA-Z0-9- ]*$/.test(tableCol) == false){
	                                                errorInField = true;
	                                            }else{
	                                                foreignTableCount++;
	                                                // foreign_table_field_value = tableCol;
	                                                foreignTable['value'+foreignTableCount] = tableCol;


	                                            }

	                                        });
	                                        form_data['foreign'][foreignTable['table']]=foreignTable;
	                                        newField= true;
	                                	}
	                                    else{
	                                        newField=false;
	                                    }
	                                }

                            	}
							}
						});

	                    if(errorInField){
	                    	userCommandBox.value = userCommand.slice(0,-1);
	                        alert("Table field contains illegal characters")
	                    }
	                    else if (newField) {
	                        userCommandBox.value= (userCommand += '\n>');
	                    }else{
	                        form_data['table'] = tableName['1'];
	                        form_data['schema'] = schema;
	                        if (tableName['1'].indexOf('_') >= 0 ) {
	                            var split_for_schema = tableName['1'].split('_');
	                            form_data['schema'] = split_for_schema[0].trim();
	                            form_data['table'] = split_for_schema[1].trim();
	                        }
	                        self.dbappPostData('createTables',form_data);
	                    }
					}
				}else if(userCommand.substring(0,5)=='hide ' ){
					if (self.is_alphanum(userCommand,'_*') == true ) {
						var hideDesc = userCommand.split("hide ")[1].trim();
						var hide_block_type = 'table';
						var hide_block_name = '';
						if (hideDesc.substring(0,6)=='table ') {
	                        hide_block_name = hideDesc.split("table ")[1].trim();
	                        hide_block_type = 'table';

	                    }else if (hideDesc.substring(0,8)=='heading ') {
	                        hide_block_name = hideDesc.split("heading ")[1].trim();
	                        hide_block_type = 'heading';

	                    }else{
	                        hide_block_name =hideDesc;
	                        hide_block_type = 'all';
	                    }

	                    if (self.in_string('_',hide_block_name)) {
	                        schema = hide_block_name.split('_')[0].trim();
	                        hide_block_name = schema[1].trim();
	                    }
	                    var hide_data = {
	                        'blockName' : hide_block_name,
	                        'hideBlockType' : hide_block_type,
	                        'schema' : schema
	                    };
	                    self.dbappPostData('hideBlock',hide_data);
					}else{
						alert('Illegal Character supplied in command, only alpahnumaric and _ (underscore) and *(astrike) allowed');
					}

				}else if(userCommand.substring(0,5)=='show ' ){
					if (self.is_alphanum(userCommand,'_*') == true ) {
						var hideDesc = userCommand.split("show ")[1].trim();
						var hide_block_type = 'table';
						var hide_block_name = '';
						if (hideDesc.substring(0,6)=='table ') {
	                        hide_block_name = hideDesc.split("table ")[1].trim();
	                        hide_block_type = 'table';

	                    }else if (hideDesc.substring(0,8)=='heading ') {
	                        hide_block_name = hideDesc.split("heading ")[1].trim();
	                        hide_block_type = 'heading';

	                    }else{
	                        hide_block_name =hideDesc;
	                        hide_block_type = 'all';
	                    }

	                    if (self.in_string('_',hide_block_name)) {
	                        schema = hide_block_name.split('_')[0].trim();
	                        hide_block_name = schema[1].trim();
	                    }
	                    var hide_data = {
	                        'blockName' : hide_block_name,
	                        'hideBlockType' : hide_block_type,
	                        'schema' : schema
	                    };
	                    self.dbappPostData('showBlock',hide_data);
					}else{
						alert('Illegal Character supplied in command, only alpahnumaric and _ (underscore) and *(astrike) allowed');
					}

				} else if(1==2){

				} else if(1==2){

				} else if(1==2){

				} else {

				}
			}

			if (userCommand !='build dbapp' && userCommand !='exit dbapp' && self.state.isChatActive) {
				// --------------------------------------------------------------------------------------------------------------
				// --------------------------------------------------------------------------------------------------------------
				// ---------------------------------------------------------------------------Here start chat code -----------//
				// ------------------------------------------------------------------------
				// ----------------------------------------------------------------------------------------------------------------
				if(inputmsg.toLowerCase().substring(0,5) ==='show '){
					this.setState({inputmessage: inputmsg});
					this.setState({chats: this.state.chats.concat([{
											sender: "user",
											input: inputmsg,
											success: true
											}])
									}, () => {
										ReactDOM.findDOMNode(this.refs.msg).value = "";
									});
					var filename=inputmsg.slice(5);
					this.setState({filename:filename+'.htm'})
					var payload={
						"filename":filename,
						"session_number":10
					}
					axios.post(appConfig.apiBaseUrl+'readfile', payload, {withCredentials: true})
					 .then(function (response) {
						 console.log(response);
							if(response.data.success === true){
							 console.log("Login successfull");
							 self.setState({filecontent:response.data.output})
							 self.setState({toggleClassRightArea:'righttArea float-col-3'})
						 }
						 else if(response.data.code === false){
							 console.log("Email password do not match");
							 self.setState({filecontent:'error occured '+response.data.output})
						 }
						 else{
							 // console.log("Email does not exists");
							 // alert("Email does not exist");
						 }
					 })
					 .catch(function (error) {
						 console.log(error);
					 });
					console.log(inputmsg);
				}else{
					this.setState({inputmessage: inputmsg});
					this.setState({
									chats: this.state.chats.concat([{
											sender: "user",
											input: inputmsg,
											success: true
									}])
							}, () => {
									ReactDOM.findDOMNode(this.refs.msg).value = "";
							});
					var payload={
						"input":inputmsg,
						"session_number":10
					}
					axios.post(appConfig.apiBaseUrl+'sendmessage', payload, {withCredentials: true})
					 .then(function (response) {
							if(response.data.success === true){
							 self.setState({
										chats: self.state.chats.concat([{
												sender: "server",
												output: response.data.output,
												success: true
										}])
								}, () => {
										ReactDOM.findDOMNode(self.refs.msg).value = "";
								});
						 }
						 else if(response.data.code === false){
							 console.log("Email password do not match");
							 self.setState({filecontent:'error occured '+response.data.output})
						 }
						 // else{
						 //   console.log("Email does not exists");
						 //   alert("Email does not exist");
						 // }
					 })
					 .catch(function (error) {
						 console.log(error);
					 });
				}
				// --------------------------------------------------------------------------------------------------------------//
				// --------------------------------------------------------------------------------------------------------------//
				// -----------------------------------------------------------------------------here ends chat code--------------//
				// --------------------------------------------------------------------------------------------------------------//
				// --------------------------------------------------------------------------------------------------------------//
			}
		}
	}



	render() {
		const { chats } = this.state;
		const { DbMenus } = this.state;
		const { tablesdata } = this.state;
		const uploadScreenCont = this;
		return (
			<div className="chat clearfix">
					<div>
						<div className="leftArea float-col-5-2">
							Storm
						</div>
						<div className={this.state.toggleClassCenterArea} >
							<div className="shoMessagesArea">
								<ul className="chats" ref="chats">
									<li className="chatmsg servermsg"><p>Hi {this.state.username} </p><p> I'm Storm, you can chat to me . . . . or issue commands . . </p><p> here . . . .</p></li>
										{
												chats.map((chat) => 
														<Message chat={chat}  />
												)
										}
								</ul>
							</div>
							<div className="messageSendDiv">
								<form className="messageForm" onSubmit={(e) => this.submitMessage(e)}  ref="messageFormRef">
									<textarea  className="message" ref="msg" onKeyUp={this.submitMessage}></textarea>
									 <input type="submit" className="submitbutton" value="Submit" />
								</form>
							</div>
						</div>
						<div className={this.state.toggleClassRightArea} ref="rightArea">
							<p className="currentFileName">Docs/<span className="currentFileNameBlue1">{this.state.filename}</span></p>
							<div className="openFileArea"  dangerouslySetInnerHTML={{__html: this.state.filecontent}}>
							</div>
						</div>
						<div className={this.state.toggleClassDbAppRightArea} ref="dbAppRightArea">
							<div className="dbappMenuArea" >
								<ul className="dbappmenu" ref="chats">
									{
											DbMenus.map((menu) => 
													<DbAppMenu menu={menu}  />
											)
									}

									    <li className={`dbAppMenuItem ${DbMenus.length > 0 ? "" : "active"}`}><a href="#" >all</a></li>
								</ul>
							</div>
							<div className="dbapptableswrapper">
								{
											tablesdata.map((table) =>
												<div className="DbAppSingleTable">
													<MuiThemeProvider>
														<DbAppTable table={table}  uploadScreenCont ={uploadScreenCont} />
													</MuiThemeProvider>
												</div>
											)
									}
							</div>
						</div>

					</div>
			</div>
		);
	}
}

const style = {
	margin: 15,
};

export default UploadScreen;