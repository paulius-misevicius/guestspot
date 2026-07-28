import { collection, addDoc, getDocs, getDoc, query, orderBy, onSnapshot, doc, startAfter, deleteDoc, where, setDoc, limit, Timestamp } from "firebase/firestore"
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
            const now = new Date()
            const itemDateFrom = item.data().dateFrom
            const itemDateTo = item.data().dateTo
            
            return {
                ...item.data(),
                id: item.id, 
                dateFrom: itemDateFrom.toDate(),
                dateTo: itemDateTo.toDate(),
                isActive: itemDateTo.toDate() >= now
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

export async function queryFirebaseDoc(myCollection, queryThis, queryThat) {
    const q = query(collection(db, myCollection), where(queryThis, "==", queryThat))
    const querySnapshot = await getDocs(q)
    const docData = querySnapshot.docs?.[0]?.data()?.[queryThis] ?? undefined
    return docData
}
export async function queryCollectionFromFirebase(myCollection, queryThis, queryThat, activeListings = false) {
    const constraints = [
        where(queryThis, "==", queryThat),
        orderBy("dateFrom")
    ]

    if (activeListings) {
        constraints.push(where("dateTo", ">", Timestamp.fromDate(new Date())))
    }

    const q = query(collection(db, myCollection), ...constraints)

    const querySnapshot = await getDocs(q)
    const queryData = querySnapshot.docs.map(item => {
        const itemCreatedAt = item.data().createdAt
        const itemDateFrom = item.data().dateFrom
        const itemDateTo = item.data().dateTo

        return {
            id: item.id, 
            ...item.data(),
            createdAt: itemCreatedAt.toDate(), 
            dateFrom: itemDateFrom.toDate(), 
            dateTo: itemDateTo.toDate()
        }
    })

    return queryData
}

export async function fetchBrowseListingsPage({userType, lastDoc, pageSize, location, dateFrom, dateTo}) {
    const constraints = [
        where("type", "==", userType),
        where("dateTo", ">", Timestamp.fromDate(new Date())),
        orderBy("dateFrom")
    ]

    if (location && location.length > 0 && location?.[0]) {
        constraints.push(where("locations", "array-contains", { city: location[0].city, country: location[0].country }))
    }
    if (dateFrom) {
        constraints.push(where("dateTo", ">=", Timestamp.fromDate(dateFrom)))
    }
    if (dateTo) {
        constraints.push(where("dateFrom", "<=", Timestamp.fromDate(dateTo)))
    }
    if (pageSize) {
        constraints.push(limit(pageSize))
    }
    if (lastDoc) {
        constraints.push(startAfter(lastDoc))
    }

    const q = query(collection(db, "listings"), ...constraints)
    const snapshot = await getDocs(q)

    const listings = snapshot.docs.map(item => ({id: item.id, ...item.data()}))
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null
    const hasMore = snapshot.docs.length === pageSize
    
    return { listings, newLastDoc, hasMore }
}