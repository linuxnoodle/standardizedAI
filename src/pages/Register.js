import React, { Component } from 'react';
import { database, auth, googleAuthProvider } from '../database';
import registerMessaging from '../request-messaging-permission';
import '../App.css';

class Login extends Component {
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

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayCurrentUser = this.displayCurrentUser.bind(this);
  }

  componentDidMount() {
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
  }

  // Form Events
  handleChangeUsername(event) {
    const username = event.target.value;
    this.setState({ username })
  }

  handleChangeEmail(event){
    const email = event.target.value;
    this.setState({ email })
  }

  handleConfirmPassword(event){
    const confirmPassword = event.target.value;
    this.setState({ confirmPassword })
  }

  handleChangePassword(event){
    const password = event.target.value;
    this.setState({ password })
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password, email, confirmPassword } = this.state;
    if (password === confirmPassword){
      console.log("Password Match");
      console.dir(this);
      console.log("email: " + email + "\nuser: " + username + "\npassword: " + password)
      this.guidesRef.push({
        username: username,
        password: password,
        email: email,
        confirmPassword: confirmPassword
    });
    window.location.href = "/question"
  }
    else{
      const error = document.getElementById('error')
      error.textContent = "\nError: Password Mismatch"
      error.style.color = "red"
    }
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
        <div className="App-header">

        </div>

        <p className="App-intro">
          <code><b>Sign up</b></code>
        </p>
        <div className="AppBody">
          <form className="App-form" onSubmit={this.handleSubmit}>
            <input className="text" name="email" placeholder="Enter Valid Email" type="text" onChange={this.handleChangeEmail} />
            <input className="text" name="username" placeholder="Username" type="text" onChange={this.handleChangeUsername} />
            <input className="text" name="password" placeholder="Password" type="text" onChange={this.handleChangePassword} />
            <input className="text" name="confirmPassword" placeholder="Confirm Password" type="text" onChange={this.handleConfirmPassword} />
            <input className="button" type="submit" value="Submit" />
            <span id="error"></span>
          </form>
        </div>
        </div>
    );
  }
}

export default Login;
