import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyABcrOzfKyqCgQCt2jz1Mvs4CiXUWREs7U",
  authDomain: "dailychoppin.firebaseapp.com",
  databaseURL: "https://dailychoppin.firebaseio.com",
  projectId: "dailychoppin",
  storageBucket: "",
  messagingSenderId: "709082569093"
};

const fire = firebase.initializeApp(config);

export default fire;