import { sendPasswordResetEmail, deleteUser, verifyPasswordResetCode, confirmPasswordReset, applyActionCode, updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, sendEmailVerification, checkActionCode, updateEmail, verifyBeforeUpdateEmail, getAuth } from "firebase/auth"
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
    return applyActionCode(auth, oobCode)
}

export function deleteAccount() {
    return deleteUser(auth.currentUser)
}

export function changePassword(newPassword) {
    return updatePassword(auth.currentUser, newPassword)
}

export function changeEmail(newEmail) {
    return verifyBeforeUpdateEmail(auth.currentUser, newEmail)
}

export function reloadUser() {
    return auth.currentUser?.reload()
}

export function verifyPasswordReset(oobCode) {
    return verifyPasswordResetCode(auth, oobCode)
}
export function resetUserPassword(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword)
}