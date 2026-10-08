import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdei2SbuMUaQ-womyAs00pCvCexmS4wQY",
  authDomain: "ekskom-os.firebaseapp.com",
  databaseURL: "https://ekskom-os-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ekskom-os",
  storageBucket: "ekskom-os.firebasestorage.app",
  messagingSenderId: "247935939839",
  appId: "1:247935939839:web:4ff24dff12de9d997548ca",
  measurementId: "G-JEDZRXB1ZZ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseRef = ref;
window.firebaseSet = set;
window.firebaseOnValue = onValue;
window.firebaseRemove = remove;

window.dispatchEvent(new Event('firebase-ready'));
