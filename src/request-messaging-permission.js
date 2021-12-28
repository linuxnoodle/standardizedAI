import { database, messaging } from './database';

export default function(user) {
 messaging.requestPermission()
 .then(() => messaging.getToken())
 .then((token) => {
    database.ref('users').child(user.uid)
    .child('token').set(token);
 }).catch(console.error)
}
