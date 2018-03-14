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

// const DbAppMenu = ({menu}) => (
//     <li className={`dbAppMenuItem ${true === menu.current ? "active" : ""}`}>
//         <a href="#" id={"menu_item_" + menu.item + "_"+menu.schemaName}>
//            {menu.item}
//         </a>
//     </li>

// );
	const style = {
	  margin: 12,
	};

	const colWidth = {
	    width: '100px'
	};
// export default DbAppMenu;
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
				<Table multiSelectable='true' onCellClick={(event) => this.handleCellClick(event)} bodyStyle={{overflow:'visible'}}>
					<TableHeader>
						<TableRow>
							{
								table.columns.map((field) =>
									<TableHeaderColumn   style={ colWidth }>{field}</TableHeaderColumn>
								)
							}
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							table.data.map((row) =>
								  <TableRow>
									{
										table.columns.map((field) =>
													<TableRowColumn  style={ colWidth }>{row[field]}</TableRowColumn>
												)
									}
									<TableRowColumn>
										<RaisedButton label="Edit" />
										<FlatButton
										      backgroundColor="#a4c639"
										      hoverColor="#8AA62F"
										      icon={<FontIcon className="muidocs-icon-custom-github" />}
										      style={style}
										    />
						    		</TableRowColumn>
								  </TableRow>
							)
						}
					</TableBody>
				</Table>
			</div>
		);
	}
}
export default DbAppTable;