import React, { Component } from 'react';
import { database, auth, googleAuthProvider } from '../database';
import registerMessaging from '../request-messaging-permission';
import '../App.css';

import raw from './qtest.txt';

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

    this.state = {
      guides: null,
      newData: '',
      currentUser: {},
      userImages: null
    }

    this.userRef = database.ref('/users').child('Anonymous');
    this.guidesRef = database.ref('/guides');

    this.displayCurrentUser = this.displayCurrentUser.bind(this);
  }

    componentDidMount(){
        auth.onAuthStateChanged((currentUser) => {
          this.setState({ currentUser: currentUser || {} });      
          
          if (currentUser) {
            // Init current user Refs
            this.userRef = database.ref('/users').child(currentUser.uid);

            this.guidesRef.on('value', (snapshot) => {
              const guides = snapshot.val();
              this.setState({ guides });
            });

            this.userRef.child('images').on('value', (snapshot) => {
              const userImages = snapshot.val();
              if (userImages) {
                this.setState({ userImages });
              }
            });
            // register function messaging alert for this user
            registerMessaging(currentUser);
            // Add user to users database if not exist
            this.userRef.once('value', (snapshot) => {
              const userData = snapshot.val();
              console.dir(userData)
              if (!userData) {
                this.userRef.set({ name: currentUser.displayName });
              }
            });

          } else {
            this.setState({ guides: null, userImages: null });
          }
        });

        fetch(raw)
            .then(r => r.text())
            .then(text => {
                document.getElementById('display').innerText = parse_data(text,2);
            });
    }
  
    // Auth Events
  signIn() {
    auth.signInWithPopup(googleAuthProvider);
  }

  signOut() {
    auth.signOut();
  }

  displayCurrentUser() {
    return <img className="App-nav-img" onClick={this.signOut}
      src={this.state.currentUser.photoURL}
      alt={this.state.currentUser.displayName}
    />
  }

  render() {
    return (
        <div className="App">
        <div className="App-nav">
        <span className="App-nav-title"><a href="/">standardizedAI</a></span>
          <ul class="App-navbar">
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
              <li><a href="/question">Questions</a></li>
          </ul>
          <span className="App-nav-button">{this.state.currentUser.email ? this.displayCurrentUser() : <a href="#" onClick={this.signIn}>Sign In With Google</a>}</span>
        </div>
        <div className="AppBody">
            <p id="display"></p>
        </div>
        </div>

    );
  }
}

export default Question;
