import * as firebase from 'firebase';
import 'firebase/firestore';
let config = {
    //Here is config settings of your Firebase APP
};
firebase.initializeApp(config);
firebase.firestore().settings({ experimentalForceLongPolling: true });

export const f=firebase;
export const database=firebase.database();
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage=firebase.storage();
