import { sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, sendEmailVerification, checkActionCode } from "firebase/auth"
import { auth, provider } from "./config"

export function signUpNewUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
}

export function signInExistingUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
}

export function signOutUser() {
    return signOut(auth)
}

export function signInWithGoogle() {
    return signInWithPopup(auth, provider)
}

export function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
}

export function verifyEmail() {
    return sendEmailVerification(auth.currentUser)
}

export function checkEmailVerification(oobCode) {
    return checkActionCode(auth, oobCode)
}