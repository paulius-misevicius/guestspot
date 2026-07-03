import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "./firebase"

export function toEnglishChars(string) {
    return string
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

export async function addToFirebase(myCollection, myDocument) {
    const docRef = await addDoc(collection(db, myCollection), myDocument)
}

export function getCollectionFromFirebase(myCollection, onData) {

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