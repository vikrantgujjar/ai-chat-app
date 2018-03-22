import React, { Component } from 'react';
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
import axios from 'axios';
import appConfig from './../config/appConfig';
const style = {
  margin: 12,
};

const colWidth = {
    
};

class DbAppTable extends Component {

	constructor(props){
		super(props);
		this.state={
				 formComponent:[]
				}
	}
	componentWillMount(){
		var self = this;
		var thisTable = self.props.table;
		if(thisTable.blocktype=='table'){
			var thisTableFields = thisTable.columns;
			var thisTableShema = thisTable.schema;
			var thisTableData = thisTable.data;
			thisTableFields.forEach(function(oneField,key){
				if (oneField.name.slice(-2) == 'id' && oneField.name.length > 2) {
					var payload ={
									column: oneField.name.substring(0, oneField.name.length - 2),
									schema: thisTableShema
								}
					axios.post(appConfig.apiBaseUrl+'foreignColumn', payload, {withCredentials: true})
					 .then(function (response) {
						// console.log(response);
						if(response.data.success === true || response.data.code ===200){
							self.props.table.columns[key].foreign = response.data.fieldName;

							thisTableData.forEach(function(row,key2){
								let preFieldNamelength = oneField.name.length - 2
								let newFieldNamelength = response.data.fieldName.length - preFieldNamelength
								let makeFieldName = response.data.fieldName.slice(-newFieldNamelength);
								var payload ={
									table: oneField.name.substring(0, oneField.name.length - 2)+'s',
									schema: thisTableShema,
									id: row[oneField.name],
									field: makeFieldName
								}
								axios.post(appConfig.apiBaseUrl+'foreignColumnValue', payload, {withCredentials: true})
								 .then(function (response2) {
									// console.log(response);
									if(response2.data.success === true || response2.data.code ===200){
										self.props.table.data[key2][oneField.name] = response2.data.fieldValue;

										// thisTableData.forEach(function(row,key){

										// });
									 }
									 else if(response2.data.code === 400){
										// console.log(response.data);
									 }
									 else{
									 }
								 })
								 .catch(function (error) {
									 console.log(error);
								 });
							});

							let preFieldNamelength = oneField.name.length - 2
							let newFieldNamelength = response.data.fieldName.length - preFieldNamelength
							let makeFieldName = response.data.fieldName.slice(-newFieldNamelength);
							var payload ={
								id: oneField.name+'_'+thisTable.name,
								class: oneField.name+'_className',
								name: oneField.name,
								schema: thisTableShema,
								field: makeFieldName,
								foreignTable: oneField.name.substring(0, oneField.name.length - 2)+'s'
							}
							axios.post(appConfig.apiBaseUrl+'foreignFormSelect', payload, {withCredentials: true})
							 .then(function (response3) {
								// console.log(response);
								if(response3.data.success === true || response3.data.code ===200){
									
									// let localloginComponent=<div  dangerouslySetInnerHTML={{__html: response3.data.formString}}> </div>;
									self.props.table.columns[key].primaryValues = response3.data.primaryValues;
								 }
								 else if(response3.data.code === 400){
									// console.log(response3.data);
								 }
								 else{
								 }
							 })
							 .catch(function (error) {
								 console.log(error);
							 });
						 }
						 else if(response.data.code === 400){
							// console.log(response.data);
						 }
						 else{
						 }
					 })
					 .catch(function (error) {
						 console.log(error);
					 });
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
			console.log(response);
			if(response.data.success === true || response.data.code ===200){
				
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
	state = {
	selected: [1],
	};

	isSelected = (index) => {
	return this.state.selected.indexOf(index) !== -1;
	};

	handleRowSelection = (selectedRows) => {
	this.setState({
	selected: selectedRows,
	});
	};

	handleCellClick(e){

	}


	render() {
		const {table} = this.props;
		return (
			<div className={` ${table.ishidden ? "hidden" : ""}`}>
				{table.blocktype=='table' &&
					<div>
						<div className="DBappTablepanelheading">
							<span className="resTableSchema"> 
								{ appConfig.defschema !==table.schema
				          			 && table.schema
				       			}
			       			</span>
			       			<span className="resTableTitle"> {table.name} </span>
		       			</div>
						<div className="resTableContainer">
							<table multiSelectable='true' onCellClick={(event) => this.handleCellClick(event)} bodyStyle={{overflow:'visible'}}>
								<thead>
									<tr>
										{
											table.columns.map((field) =>
												<th   style={ colWidth }>{field.foreign ? field.foreign : field.name}</th>
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
																<td  style={ colWidth }>{row[field.name]}</td>
															)
												}
												<td>disabled
									    		</td>
											  </tr>
										)
									}
									<tr>
										{
											table.columns.map((field) =>
												<td   style={ colWidth }>
												{ field.foreign ? (
														<select>
															field.primaryValues.map((option)=>{
																	<option value={option.id} >{option.value}</option>
																})
														</select>
									                ) : ( (function() {
											                switch(field.name) {
											                    case 'id':
											                        return 'Auto fill';
											                    case 'date':
											                        return 'Auto fill';
											                    case 'error':
											                        return 'error';
											                    default:
											                    	return  <input type="text" />;
											                }
											            })()
									                )
									            }

												</td>
											)
										}
										<td>Add</td>
									</tr>
								</tbody>
							</table>
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