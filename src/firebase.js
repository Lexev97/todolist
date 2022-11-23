import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyCrMvIo-bU2duYi1KHdBES6CLfqIq_dAes",
  authDomain: "todo-list-fwu.firebaseapp.com",
  databaseURL: "https://todo-list-fwu-default-rtdb.firebaseio.com",
  projectId: "todo-list-fwu",
  storageBucket: "todo-list-fwu.appspot.com",
  messagingSenderId: "390476297745",
  appId: "1:390476297745:web:b891dc8649d62d7131e3b0"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);

