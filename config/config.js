import * as firebase from 'firebase';
import 'firebase/firestore';
let config = {
    apiKey: "AIzaSyDZF6afKDFTDd68sBzlekOAbgNIR3xrMDI",
    authDomain: "salerent-2366e.firebaseapp.com",
    databaseURL: "https://salerent-2366e.firebaseio.com",
    projectId: "salerent-2366e",
    storageBucket: "salerent-2366e.appspot.com",
    messagingSenderId: "427757428441",
    appId: "1:427757428441:web:91177e68ca3add3364e8c8"
};
firebase.initializeApp(config);
firebase.firestore().settings({ experimentalForceLongPolling: true });

export const f=firebase;
export const database=firebase.database();
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage=firebase.storage();
