import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjkemmVHtjg3uRJM8JEHN82vt8pm0MCLM",
  authDomain: "seguridad-8e177.firebaseapp.com",
  projectId: "seguridad-8e177",
  storageBucket: "seguridad-8e177.appspot.com",
  messagingSenderId: "527007436127",
  appId: "1:527007436127:web:9a8bd00d4024ea21b57aea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      rol: 'user',
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const saveResult = async (user, result) => {
  try {
    await addDoc(collection(db, "results"), {
      uid: user.uid,
      result: result,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  saveResult,
};
