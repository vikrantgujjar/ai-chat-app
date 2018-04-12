import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import appConfig from './../config/appConfig';
import DbAppTableRow from './DbAppTableRow.js';
const style = {
  margin: 12,
};

const colWidth = {
    
};

class DbAppTable extends Component {

	constructor(props){
		super(props);
		this.state={
				 formComponent:[],
				 open: false,
				 dialogForm:[],
				 updateIt:'s',
				 currentedit: []
				}
		this.handleOpen = this.handleOpen.bind(this);
		this.topElementClick = this.topElementClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.deleteRow = this.deleteRow.bind(this);
		this.filterRow = this.filterRow.bind(this);
		this.handleColumnDblClick = this.handleColumnDblClick.bind(this);
	}
	topElementClick(event){
		var self =this;
		var openedEditColumn = ReactDOM.findDOMNode(self.refs.openedEditColumn);
		var clickedElementIs = event.target;
		console.log(clickedElementIs);
		console.log(openedEditColumn);
		if(clickedElementIs == openedEditColumn){
			console.log('clicked in.....');
		}else{
			console.log('clicked out.....');
		}
	}

	handleSubmit(event) {

	    event.preventDefault();
	    var self = this;
		var thisTable = self.props.table;
		var uploadScreenCont = self.props.uploadScreenCont;
		var thisTableShema = thisTable.schema;
	    const form = event.target;
	    var thisFormData = new FormData(form);
	    var buildData = [];
	    for (let name of thisFormData.keys()) {
	      buildData[name] = thisFormData.get(name);
	    }
	    // console.log(buildData);
	    var buildDataobj = {...buildData};
		var payload ={
						table: thisTable.name,
						schema: thisTableShema,
						formData: buildDataobj
					}
		axios.post(appConfig.apiBaseUrl+'addNewRow', payload, {withCredentials: true})
		 .then(function (response2) {
			if(response2.data.success === true || response2.data.code ===200){
				uploadScreenCont.reloadTables();
				alert('Row Created'+response2.data.insertedRowId);
			}
			else if(response2.data.code === 400){
					alert('error');
			}
			else{
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	filterRow(event,rowID){

	}
	deleteRow(event,rowID){
		const clickedButton = event.currentTarget;
		const closestTr = clickedButton.closest("tr");
	    var self = this;
	    var uploadScreenCont = self.props.uploadScreenCont;
		var thisTable = self.props.table;
		var thisTableShema = thisTable.schema;
		var rowID = rowID;
		var payload ={
						table: thisTable.name,
						schema: thisTableShema,
						rowId: rowID
					}
		axios.post(appConfig.apiBaseUrl+'deleteRow', payload, {withCredentials: true})
		 .then(function (response2) {
			if(response2.data.success === true || response2.data.code ===200){
				 uploadScreenCont.reloadTables();
				// clickedButton.style.visibility = "hidden";
				// closestTr.style.visibility = "hidden";
				alert('Row Deleted');
			}
				else if(response2.data.code === 400){
					alert(response2.data.message);
			}
			else{
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	handleOpen(){
		this.setState({open: true});
		var dialogFormHtml = [];
    	var self = this;
		var thisTable = self.props.table;
		if(thisTable.blocktype=='table'){
			var thisTableFields = thisTable.columns;
			var thisTableShema = thisTable.schema;
			var thisTableData = thisTable.data;
			var colCount = thisTableFields.length;
			var colLoopCount = 0;
			// console.log(colCount);
			thisTableFields.forEach(function(oneField,key){
				colLoopCount++;
				if (oneField.foreignColumn &&  typeof oneField.foreignColumn !== "undefined") {
					let foreignTableName = oneField.foreignTable;
					var payload ={
									class:'',
									id: '',
									name: oneField.name,
									schema: thisTableShema,
									foreignTable: oneField.foreignTable,
									field: oneField.foreignColumn
								}
					axios.post(appConfig.apiBaseUrl+'foreignFormSelect', payload, {withCredentials: true})
					 .then(function (response2) {
						if(response2.data.success === true || response2.data.code ===200){
							// dialogFormHtml.push(
							// 	response2.data.formString
							// );
							var primaryValueArray = response2.data.primaryValues;
							dialogFormHtml.push(
								<div className="formgroup">
									<select className="" name={oneField.name}>
									<option>Choose {oneField.name}</option>
									{
										primaryValueArray.map((optionData) =>
																<option value={optionData.id}>{optionData.value}</option>
															)
									}
									</select>
								</div>
							);
							if(colLoopCount ==colCount){
									// console.log('should be last');
									self.setState({dialogForm: dialogFormHtml});
							}
						}
							else if(response2.data.code === 400){
						}
						else{
						}
					})
					.catch(function (error) {
						console.log(error);
					});

				}else{
					if(oneField.name != 'id' && oneField.name != 'date'){
						dialogFormHtml.push(
							<div  className="formgroup">
								<input  type="text" placeholder={oneField.name} name={oneField.name} required />
							</div>
							);
					}

					if(colLoopCount ==colCount){
							self.setState({dialogForm: dialogFormHtml});
							
					}
				}
			});

		}
  	}
  	handleClose() {
		this.setState({open: false});
	};
	componentWillMount(){
		var self = this;
		var thisTable = self.props.table;
		if(thisTable.blocktype=='table'){
			var thisTableFields = thisTable.columns;
			let asdfg =thisTableFields;
			asdfg.sort(function(a, b){
			    return a.ord - b.ord;
			});
			self.props.table.columns = asdfg;
			var thisTableShema = thisTable.schema;
			var thisTableData = thisTable.data;
			var fieldloopcount = 0;
			var fieldloopMax = thisTableFields.length;
			thisTableFields.forEach(function(oneField,key){
				if (oneField.foreignColumn  &&  typeof oneField.foreignColumn !== "undefined" ) {
					thisTableData.forEach(function(row,key2){
						let preFieldNamelength = oneField.name.length - 2
						let newFieldNamelength = oneField.tableColumn.length - preFieldNamelength
						let makeFieldName = oneField.tableColumn.slice(-newFieldNamelength);
						var payload ={
										table: oneField.name.substring(0, oneField.name.length - 2)+'s',
										schema: thisTableShema,
										id: row[oneField.name],
										field: makeFieldName
									}
						axios.post(appConfig.apiBaseUrl+'foreignColumnValue', payload, {withCredentials: true})
						 .then(function (response2) {
							if(response2.data.success === true || response2.data.code ===200){
								self.props.table.data[key2][oneField.name] = response2.data.fieldValue;
								fieldloopcount++;
								if(fieldloopcount==fieldloopMax){
									let funkything = self.state.updateIt+' callsuccess';
									self.setState({updateIt:funkything});
									self.forceUpdate();
								}
							}else if(response2.data.code === 400){
								fieldloopcount++;
								if(fieldloopcount==fieldloopMax){
									let funkything = self.state.updateIt+' callnorecord';
									self.setState({updateIt:funkything});
								}
							}
							else{
								fieldloopcount++;
								if(fieldloopcount==fieldloopMax){
									let funkything = self.state.updateIt+' callfail';
									self.setState({updateIt:funkything});
								}
							}
						})
						.catch(function (error) {
							console.log(error);
						});
					});

				}else{
					fieldloopcount++;
					if(fieldloopcount==fieldloopMax){
						let funkything = self.state.updateIt+' nocall';
						self.setState({updateIt:funkything});
					}
				}
			});
		}
	}

	dbappPostData(apiroute, postData){
		var self = this;
		var payload={
						"postData":postData
					}
		axios.post(appConfig.apiBaseUrl+apiroute, payload, {withCredentials: true})
		 .then(function (response) {
			// console.log(response);
			if(response.data.success === true || response.data.code ===200){
				
			 }
			 else if(response.data.code === 400){
				 // console.log(response.data);
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

	handleCellClick(e){
		 console.log('cell click');
	}
	handleColumnDblClick(e){
		console.log('dbl click');
		var self = this;
		var clickedTd = e.target;
		var thisColumnData = clickedTd.textContent;
		var thisColumnIndex = clickedTd.dataset.columnOrd;
		var thisColumnField = '';

		var thisTable = self.props.table;
		var thisTableShema =thisTable.schema;
		var thisColumn = thisTable.columns[thisColumnIndex-1];
		if(thisColumn.name=="id" || thisColumn.name=="date"){
			return;
		}
		console.log(thisColumn);
		if(thisColumn.foreignColumn  &&  typeof thisColumn.foreignColumn !== "undefined" ){
			console.log('is foreign');
			let foreignTableName = thisColumn.foreignTable;
			var payload ={
							class:'',
							id: '',
							name: thisColumn.name,
							schema: thisTableShema,
							foreignTable: thisColumn.foreignTable,
							field: thisColumn.foreignColumn
						}
			axios.post(appConfig.apiBaseUrl+'foreignFormSelect', payload, {withCredentials: true})
			 .then(function (response2) {
				if(response2.data.success === true || response2.data.code ===200){
					// dialogFormHtml.push(
					// 	response2.data.formString
					// );
					var primaryValueArray = response2.data.primaryValues;
					thisColumnField='<select ref="openedEditColumn" className="" name="' + thisColumn.name + '">';
					primaryValueArray.forEach(function(optionData,key){
						let selectdVar ='';
						if(optionData.value==thisColumnData){
							selectdVar ='selected';
						}
						thisColumnField+='<option value='+optionData.id+' '+selectdVar+'>'+optionData.value+'</option>';
					});
					thisColumnField +='</select>';

						clickedTd.innerHTML = thisColumnField;

				}
					else if(response2.data.code === 400){
				}
				else{
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		}else{
			thisColumnField ='<input type="text"  ref="openedEditColumn" name="'+thisColumn.name+'"  value="'+thisColumnData+'"/>'
			clickedTd.innerHTML = thisColumnField;
		}

		
	}

	render() {
		const {table} = this.props;
		 const actions = [
		      <FlatButton
		        label="Cancel"
		        primary={true}
		        onClick={this.handleClose}
		      />
		    ];
		return (
			<div className={` ${table.ishidden ? "hidden" : ""}`}>
				{table.blocktype=='table' &&
					<div onClick={(event) => this.topElementClick(event)}>
						<div className="DBappTablepanelheading clearfix">
							<span className="resTableSchema"> 
								{ appConfig.defschema !==table.schema
				          			 && table.schema
				       			}
			       			</span>
			       			<span className="resTableTitle"> {table.name} </span>
			       			<div className="resTableAction"><RaisedButton label="Add Row" secondary={true} onClick={this.handleOpen} /></div>
		       			</div>
						<div className="resTableContainer">
							<table multiSelectable='true' onCellClick={(event) => this.handleCellClick(event)} bodyStyle={{overflow:'visible'}}>
								<thead className={this.state.updateIt}>
									<tr>
										{
											table.columns.map((field) =>
												<th   style={ colWidth }>{field.tableColumn ? field.tableColumn : field.name}</th>
											)
										}
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{
										table.data.map((row) =>
											  <tr>
												{
													table.columns.map((field) =>
																<td data-column-name={field.name} data-column-ord={field.ord} onDoubleClick={(e) =>this.handleColumnDblClick(e)} style={ colWidth }>{row[field.name]}</td>
															)
												}
												<td>
													<RaisedButton label="Delete" success={true} onClick={(event) => this.deleteRow(event,row["id"])} />
													<RaisedButton label="Filter" primary={true} onClick={(event) => this.filterRow(event,row["id"])} />
									    		</td>
											  </tr>
										)
									}
								</tbody>
							</table>
						</div>
						<div>
							<Dialog
							title={'Add New '+table.name.slice(0, -1)+''}
							actions={actions}
							modal={false}
							open={this.state.open}
							onRequestClose={this.handleClose}
							>
								<form onSubmit={this.handleSubmit}>
									{this.state.dialogForm}
									<button>Send data!</button>
								</form>
							</Dialog>
						</div>
					</div>
				}

				{table.blocktype=='heading' &&
					<div className="DBappHeadingPanelhead textCenter ">
		       			<span className={`resHeadingText ${table.isbold ? "headingBold" : ""}`}> {table.heading} </span>
	       			</div>

				}

			</div>
		);
	}
}
export default DbAppTable;