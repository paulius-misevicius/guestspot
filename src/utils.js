import { collection, addDoc, getDocs, getDoc, query, orderBy, onSnapshot, doc, deleteDoc, where, setDoc } from "firebase/firestore"
import { sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, sendEmailVerification } from "firebase/auth"
import { uploadBytes, ref, getDownloadURL, deleteObject, listAll } from "firebase/storage"
import { db, auth, provider, storage } from "./utils/firebase/config"

