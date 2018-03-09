import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
var apiBaseUrl = "http://localhost:4000/api/";
// var apiBaseUrl = "http://138.68.50.25:4000/api/";
import axios from 'axios';
import UploadScreen from './UploadScreen';
import UploadPage from './UploadPage';

const style = {
  margin: 15,
};

class Login extends Component {
  constructor(props){
    super(props);
    var localloginComponent=[];
    localloginComponent.push(
      <MuiThemeProvider key="funconstrulgnjs">
        <div>
         <TextField
           hintText="Enter  your email"
           floatingLabelText="Email"
           
           onChange={(event,newValue) => this.setState({email:newValue})}
           />
         <br/>
           <TextField
             type="password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             ref={(input) => { this.nameInput = input; }} 
             onChange={(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
          <Checkbox
              label="Remember Me"
              name="rememberme"
              style={{
                width: '180px',
                display: 'inline-block'
              }}
              value="true"
              className="login-form-remember-me-checkbox"
              onCheck={(event,newValue) => this.setState({rememberme: !this.state.rememberme})}
              />
          <br/>
           <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
       </div>
       </MuiThemeProvider>
    )
    this.state={
      email:'',
      password:'',
      rememberme:false,
      menuValue:1,
      loginComponent:localloginComponent,
      loginRole:'student'
    }


     
  }
  componentDidMount() {
    this.nameInput.focus(); 
  }
  handleClick(event){
    var self = this;
    var payload={
      "email":this.state.email,
      "password":this.state.password,
	    "rememberme":this.state.rememberme,
      "role":this.state.loginRole
    }
    console.log('before :'+this.state.rememberme);
    axios.post(apiBaseUrl+'login', payload, {withCredentials: true})
   .then(function (response) {
     console.log(response);
     if(response.data.code === 200){
       console.log("Login successfull");
       var uploadScreen=[];
       uploadScreen.push(<UploadPage appContext={self.props.appContext} role={self.state.loginRole}/>)
       self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
     }
     else if(response.data.code === 204){
       console.log("Email password do not match");
       alert(response.data.success)
     }
     else{
       console.log("Email does not exists");
       alert("Email does not exist");
     }
   })
   .catch(function (error) {
     console.log(error);
   });
  }
  render() {
    return (
      <div  ref="passwordTextFix">
        <MuiThemeProvider>
        <AppBar
             title="Login"
             showMenuIconButton={false}
           />
        </MuiThemeProvider>
        {this.state.loginComponent}
      </div>
    );
  }
}

export default Login;