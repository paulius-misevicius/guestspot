import { collection, addDoc, getDocs, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { db, auth } from "./firebase"

// General functions

export function toEnglishChars(string) {
    return string
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

export function checkErrorMessage(error) {
    if (error.message === "Firebase: Error (auth/invalid-credential).") {
        return "Incorrect email or password."
    } else if (error.message === "Firebase: Error (auth/network-request-failed).") {
        return "Please check your internet connection."
    } else return error.message
}

// Firebase functions

export async function addToFirebase(myCollection, myDocument) {
    const docRef = await addDoc(collection(db, myCollection), myDocument)
}

export async function deleteFromFirebase(myCollection, myDocumentId) {
    await deleteDoc(doc(db, myCollection, myDocumentId))
}

export async function getCollectionFromFirebase(myCollection) {
    const querySnapshot = await getDocs(collection(db, myCollection))
    const queryData = querySnapshot.docs.map(item => ({id: item.id, ...item.data()}))

    return queryData
}

export function getRealTimeCollectionFromFirebase(myCollection, onData) {

    const q = query(collection(db, myCollection), orderBy("createdAt", "desc"))

    return onSnapshot(q, querySnapshot => {

        const dataArray = querySnapshot.docs.map(item => {
    
            const itemDateFrom = item.data().dateFrom
            const itemDateTo = item.data().dateTo
            
            return {
                ...item.data(),
                id: item.id, 
                dateFrom: itemDateFrom.toDate(),
                dateTo: itemDateTo.toDate()
            }
        })
        onData(dataArray)
    })
}

export function signUpNewUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
}

export function signInExistingUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
}

export function signOutUser() {
    return signOut(auth)
}