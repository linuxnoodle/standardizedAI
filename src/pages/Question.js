import React, { Component } from 'react';
import { database, auth, googleAuthProvider } from '../database';
import registerMessaging from '../request-messaging-permission';
import '../App.css';
import raw from './qtest.txt';
import data from './data.js'
function parse_data(string, idx){
  var selected = string.split('\n')[idx]
  //var [passage, question, choices, answer, difficulty] = selected.split('|');
  var result='';
  for(var element of selected.split('|')){
    //console.log(element.replace("<>","\n"));
    console.log(element.indexOf('<>'));
    result+=element.replace(/<>/g,"\n")+'\n';
  }
  return result;
}
class Question extends Component {

  constructor(props) {
    super(props);
    console.log(data);
  }
  componentDidMount(){
    fetch(raw)
  .then(r => r.text())
  .then(text => {
    document.getElementById('display').innerText = parse_data(text,2);
  });

  }

  render() {
    return (<div id="everything">
        <p>Reading... </p>
        <p id='display'></p>
    </div>
    );
  }
}

export default Question;

