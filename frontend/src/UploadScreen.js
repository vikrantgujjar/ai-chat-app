import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import LoginScreen from './Loginscreen';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import Message from './components/Message.js';
import axios from 'axios';
var apiBaseUrl = "http://138.68.50.25:4000/api/";
// var apiBaseUrl = "http://localhost:4000/api/";
var filesdir = "../../files";
/*
Module:superagent
superagent is used to handle post/get requests to server
*/
var request = require('superagent');

class UploadScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      inputmessage:'',
      filename:'Filename',
      filecontent:'',
      toggleClassRightArea:'righttArea float-col-3 hidden',
      chats: [],
       username: ''
    }

    this.submitMessage = this.submitMessage.bind(this);
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
  componentDidMount() {
      this.scrollToBot();
  }

  componentDidUpdate() {
      this.scrollToBot();
  }

  scrollToBot() {
      ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
  }
  submitMessage(e) {
     e.preventDefault();
    var self = this;
    let inputmsg = ReactDOM.findDOMNode(this.refs.msg).value;
    inputmsg = inputmsg.trim();
    e.preventDefault();
    if(inputmsg.toLowerCase().substring(0,5) ==='show '){
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
        var filename=inputmsg.slice(5);
      this.setState({filename:filename+'.htm'})
      var payload={
        "filename":filename,
        "session_number":10
      }
      axios.post(apiBaseUrl+'readfile', payload, {withCredentials: true})
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
      axios.post(apiBaseUrl+'sendmessage', payload, {withCredentials: true})
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
  }

  render() {
    const { chats } = this.state;
    return (
      <div className="chat clearfix">
          <div>
            <div className="leftArea float-col-5-2">
              Storm
            </div>
            <div className="centertArea float-col-3">
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
                  <input type="text" className="message" ref="msg" />
                   <input type="submit" className="submitbutton" value="Submit" />
                </form>
              </div>
            </div>
            <div className={this.state.toggleClassRightArea} ref="rightArea">
              <p className="currentFileName">Docs/<span className="currentFileNameBlue1">{this.state.filename}</span></p>
              <div className="openFileArea"  dangerouslySetInnerHTML={{__html: this.state.filecontent}}>
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