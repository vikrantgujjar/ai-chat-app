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

const style = {
  margin: 12,
};

const colWidth = {
    
};

class DbAppTable extends Component {

	constructor(props){
		super(props);
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
			<div>
				<div className="DBappTablepanelheading">{table.name}</div>
				<div className="resTableContainer">
					<table multiSelectable='true' onCellClick={(event) => this.handleCellClick(event)} bodyStyle={{overflow:'visible'}}>
						<thead>
							<tr>
								{
									table.columns.map((field) =>
										<th   style={ colWidth }>{field}</th>
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
														<td  style={ colWidth }>{row[field]}</td>
													)
										}
										<td>disabled
							    		</td>
									  </tr>
								)
							}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
export default DbAppTable;