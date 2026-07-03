import { collection, addDoc, getDocs } from "firebase/firestore"
import { db } from "./firebase"

export function toEnglishChars(string) {
    return string
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

export async function addToFirebase(myCollection, myDocument) {
    const docRef = await addDoc(collection(db, myCollection), myDocument)
}

export async function getCollectionFromFirebase(myCollection) {
    const querySnapshot = await getDocs(collection(db, myCollection))
    const dataArray = querySnapshot.docs.map(item => (
        {id: item.id, ...item.data()}
    ))
    
    return dataArray
}