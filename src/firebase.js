import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBwJ0VbqIb6wFUcsGcqp7GiTRJwmPN9OUI",
  authDomain: "guestspot-251bb.firebaseapp.com",
  projectId: "guestspot-251bb",
  storageBucket: "guestspot-251bb.firebasestorage.app",
  messagingSenderId: "192858564096",
  appId: "1:192858564096:web:63b225dc54f4d00f9d5ae5"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()