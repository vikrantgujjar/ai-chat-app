import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
var apiBaseUrl = "http://localhost:4000/api/";
import axios from 'axios';
import UploadScreen from './UploadScreen';
import UploadPage from './UploadPage';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


import './App.css';
import LoginScreen from './Loginscreen';
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loginPage:[],
      uploadScreen:[]
    }
  }
  componentWillMount(){
    var appCont = this;
    axios.get(apiBaseUrl+'islogin', {withCredentials: true})
   .then(function (response) {
     if(response.data.code === 200){
         var uploadscreen =[];
            uploadscreen.push(<UploadPage key="upscreenappjs" appContext={appCont} />);
            appCont.setState({
                          uploadScreen:uploadscreen
                            })
     }
     else if(response.data.code === 204){
         var loginPage =[];
            loginPage.push(<LoginScreen key="appjs" appContext={appCont}/>);
            appCont.setState({
                  loginPage:loginPage
                    })
     }
     else{
       console.log('unexpected error');
     }
   })
   .catch(function (error) {
     console.log(error);
   });

  }
  render() {
    return (
      <div className="App">
        {this.state.loginPage}
        {this.state.uploadScreen}
      </div>
    );
  }
}


export default App;