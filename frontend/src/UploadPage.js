import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import UploadScreen from './UploadScreen';
import axios from 'axios';
import Pastfiles from './Pastfiles';
import LoginScreen from './Loginscreen';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Navigation from 'material-ui/svg-icons/navigation/menu';
// var apiBaseUrl = "http://localhost:4000/api/";
var apiBaseUrl = "http://138.68.50.25:4000/api/";

class App extends Component {
  constructor(props) {
    super(props);
    var weekday=new Array(7);
    weekday[0]="Mon";
    weekday[1]="Tue";
    weekday[2]="Wed";
    weekday[3]="Thur";
    weekday[4]="Fri";
    weekday[5]="Sat";
    weekday[6]="Sun";
    var months = [ "Jan", "Feb", "March", "April", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
    var today = new Date();
   var dateex= weekday[today.getDay()] + " "+ months[today.getMonth()]  +' ' +today.getDate() +"th "+  today.getHours() +':'+ today.getMinutes();
  console.log(dateex);
    this.state = {draweropen: false,currentScreen:[], asdate: dateex, username: ''};
  }
  componentWillMount(){
    var appCont = this;
    axios.get(apiBaseUrl+'getUserData', {withCredentials: true})
   .then(function (response) {
     if(response.data.code === 200){
        appCont.setState({username: response.data.user.first_name})
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

  }
  componentDidMount(){
    var currentScreen=[];
    currentScreen.push(<UploadScreen key="upscreenuppagejs" appContext={this.props.appContext} role={this.props.role}/>);
    this.setState({currentScreen})
  }
  /**
   * Toggle opening and closing of drawer
   * @param {*} event 
   */ 
  toggleDrawer(event){
  // console.log("drawer click");
  this.setState({draweropen: !this.state.draweropen})
  }
  handleMenuClick(event,page){
    switch(page){
      case "userProfile":
      // console.log("need to open uploadapge")
      // var currentScreen=[];
      // currentScreen.push(<UploadScreen appContext={this.props.appContext} role={this.props.role}/>);
      // this.setState({currentScreen})
      break;
      case "logout":
      var isError = false;
        axios.get(apiBaseUrl+'logout', {withCredentials: true})
       .then(function (response) {
         console.log(response);
         if(response.data.code === 200){
          isError = false;
         }
         else if(response.data.code === 204){
          isError = true;
           console.log("Error");
           alert('Error');
         }
         else{
           console.log("Error");
           alert("Error");
         }
       })
       .catch(function (error) {
         console.log(error);
       });
       if(!isError){
        console.log("Logout successfull");
          var loginPage =[];
          loginPage.push(<LoginScreen appContext={this.props.appContext}/>);
          this.props.appContext.setState({loginPage:loginPage,uploadScreen:[]})
        }else{
          alert('Error');
        }
      
      break;
    }
    this.setState({draweropen:false})
  }
  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <AppBar 
            title="HayStorm"
            className="appBarClass"
            iconElementRight={<FlatButton eventKey={1} labelPosition="before" label={this.state.username} icon={< Navigation />} />}
            iconElementLeft={<p className="appbarTime">{ this.state.asdate }</p>}
            onRightIconButtonClick ={(event) => this.toggleDrawer(event)}
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Drawer openSecondary={true} open={this.state.draweropen}>
            <MenuItem>
              <div>
              <MenuItem href="*"   onClick={(event) => this.handleMenuClick(event,"userProfile")}>User Profile</MenuItem>
              <a href="#"><FontIcon
                className="material-icons drawerclosebutton"
                color={blue500}
                style={{ top:'10px',position: 'absolute',right: '7px'}}
                onClick={(event) => this.toggleDrawer(event)}
              >clear</FontIcon></a>
              </div>
            </MenuItem>
              <div>
              <MenuItem onClick={(event) => this.handleMenuClick(event,"logout")}>
                  Logout
              </MenuItem>
              </div> 
          </Drawer>
        </MuiThemeProvider>
        <div>
          {this.state.currentScreen}
        </div>
      </div>
    );
  }
}

export default App;
