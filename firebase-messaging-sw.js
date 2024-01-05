importScripts("https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js");

var firebaseConfig = {
    apiKey: "AIzaSyDLzmZyt5nZwCk98iZ6wi01y7Jxio1ppZQ",
            authDomain: "fine-bondedwarehouse.firebaseapp.com",
            databaseURL: "https://fine-bondedwarehouse-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "fine-bondedwarehouse",
            storageBucket: "fine-bondedwarehouse.appspot.com",
            messagingSenderId: "415417723331",
            appId: "1:415417723331:web:15212f190062886281b576",
            measurementId: "G-SWBR4359JQ"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
console.log(messaging);