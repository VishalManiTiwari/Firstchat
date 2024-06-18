import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBvdrr8ninyUgTrb6zyN9jYwjfvs81lqPM",
  authDomain: "hello-d0bbb.firebaseapp.com",
  projectId: "hello-d0bbb",
  storageBucket: "hello-d0bbb.appspot.com",
  messagingSenderId: "710897729675",
  appId: "1:710897729675:web:a834feabeaf8d998b9948e",
  measurementId: "G-9FDNC7ER2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
