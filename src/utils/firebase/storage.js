import { uploadBytes, ref, getDownloadURL, deleteObject, listAll } from "firebase/storage"
import { storage } from "./config"

export function uploadImageToFirebase(file, path) {
    const storageRef = ref(storage, path)

    return uploadBytes(storageRef, file)
}

export function downloadImageFromFirebase(path) {
    const storageRef = ref(storage, path)

    return getDownloadURL(storageRef)
}

export function deleteImageFromFirebase(path) {
    return deleteObject(ref(storage, path))
}

export function listAllDirectoryFiles(path) {
    const listRef = ref(storage, path)

    return listAll(listRef)
}