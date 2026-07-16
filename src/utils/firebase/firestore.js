import { collection, addDoc, getDocs, getDoc, query, orderBy, onSnapshot, doc, deleteDoc, where, setDoc } from "firebase/firestore"
import { db } from "./config"

export async function addToFirebase(myCollection, myDocument) {
    const docRef = await addDoc(collection(db, myCollection), myDocument)
}

export async function addToFirebaseWithId(myCollection, documentId, myDocument) {
    const docRef = await setDoc(doc(db, myCollection, documentId), myDocument)
}

export async function deleteFromFirebase(myCollection, myDocumentId) {
    await deleteDoc(doc(db, myCollection, myDocumentId))
}

export async function getCollectionFromFirebase(myCollection) {
    const querySnapshot = await getDocs(collection(db, myCollection))
    const queryData = querySnapshot.docs.map(item => ({id: item.id, ...item.data()}))

    return queryData
}

export function getRealTimeCollectionFromFirebase(myCollection, onData, userId) {

    const q = query(collection(db, myCollection), where("userId", "==", userId), orderBy("createdAt", "desc"))

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

export async function overwriteFirebaseDoc(myCollection, documentId, myDocument) {
    await setDoc(doc(db, myCollection, documentId), myDocument)
}

export async function getFirebaseDoc(myCollection, documentId) {
    const docRef = doc(db, myCollection, documentId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        return undefined
    }
}

export async function queryCollectionFromFirebase(myCollection, queryThis, queryThat) {
    const q = query(collection(db, myCollection), where(queryThis, "==", queryThat))

    const querySnapshot = await getDocs(q)
    const queryData = querySnapshot.docs.map(item => ({id: item.id, ...item.data()}))

    return queryData
}