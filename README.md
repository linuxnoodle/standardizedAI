# standardizedAI

### Includes:
- Firebase setup (needs to be updated)
- Authentication
- Database: Retrieve and push data

### Getting Started
- Create your Firebase Project in `http://console.firebase.google.com`.
- Copy config in dashboard's  **Web Setup** and paste to `firebase.js`.
- Clone project and install dependencies.
```
> git clone 
> cd react-firebase
> yarn
```

### Authentication
See [Firebase Authentication](https://firebase.google.com/docs/auth/web/start) docs.
`firebase.auth()`

Sign-In method is using `GoogleAuthProvider` with a pop-up window. When `ComponentDidMount` was called,
`auth.onAuthStateChanged` will listen to current auth user state. When the user is logged-in, user state in the component will set.

### Database
See [Firebase Authentication](https://firebase.google.com/docs/auth/) docs.
`firebase.database()`

Initially created an object `guides` as our first collection to push our data. The `guidesRef` is the database reference for the `guides` object in firebase.
Pushing the new data will also add the current User id, who created the data.

### Deployment process with firebase
1. Install **Firebase Tools** globally. (You may need `sudo` here)
```
> yarn global add firebase-tools
```
2. Login to firebase using this tool in CLI
```
> firebase login
```
3. CD to your working project and initialize firebase.
```
> cd react-firebase
> firebase init
```
4. Configure firebase:
- Allow CLI features for **Database**, **Functions**, **Hosting**.
- Select your Firebase project to be used.
- Accept default rules to write on default file `database.rules.json`
- Install dependencies.
- Choose a `build` name directory since we build our app.
- Select **Yes** for configuring single app page. This is suitable also when app is using `react-router`.
- **Firebase initialization complete!**

5. Then we will build our app.
```
> yarn build
```
6. Deploy!
```
> firebase deploy
```
Access your running application to the given **Hosting URL**.

**__Important__**
- Make sure to rebuild your app if you made changes and want to deploy again.
- If you only edited the firebase-generated folder `functions/**`, you can just deploy by running `firebase deploy --only functions`.




