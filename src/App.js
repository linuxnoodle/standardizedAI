// Code taken from https://github.com/jeescu/react-firebase
import React, { Component } from 'react';
import { database, auth, googleAuthProvider, storage } from './firebase';
import registerMessaging from './request-messaging-permission';
import './App.css';

class App extends Component {
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
    this.userStorageRef = storage.ref('/user-files').child('Anonymous');

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayCurrentUser = this.displayCurrentUser.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((currentUser) => {
      this.setState({ currentUser: currentUser || {} });      
      
      if (currentUser) {
        // Init current user Refs
        this.userRef = database.ref('/users').child(currentUser.uid);
        this.userStorageRef = storage.ref('/user-files').child(currentUser.uid);

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
  }

  // Form Events
  handleChangeUsername(event) {
    const username = event.target.value;
    this.setState({ username })
  }

  handleChangePassword(event){
    const password = event.target.value;
    this.setState({ password })
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    console.dir(this);
    this.guidesRef.push({
      username: username,
      password: password
    });
    console.log("user: " + username + "\npassword: " + password)
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
          <span className="App-nav-title">standardizedAI</span>
          <span className="App-nav-button">{this.state.currentUser.email ? this.displayCurrentUser() : <a href="#" onClick={this.signIn}>Sign In</a>}</span>
        </div>
        <div className="App-header">

        </div>

        <p className="App-intro">
          <code><b>Database</b></code>
        </p>
        <div className="AppBody">
          <form className="App-form" onSubmit={this.handleSubmit}>
            <input className="text" name="username" placeholder="Username" type="text" onChange={this.handleChangeUsername} />
            <input className="text" name="password" placeholder="Password" type="text" onChange={this.handleChangePassword} />
            <input className="button" type="submit" value="Submit" />
          </form>
          <pre className="AppBody-fb-db">{JSON.stringify(this.state.guides, null, 2)}</pre>
        </div>

        <p className="App-intro">
          <code><b>Cloud Storage</b></code>
        </p>
        </div>
    );
  }
}

export default App;
