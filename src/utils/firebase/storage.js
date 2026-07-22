import { uploadBytes, ref, getDownloadURL, deleteObject, listAll } from "firebase/storage"
import { resizeImage } from "../general"
import { storage } from "./config"

export async function uploadImageToFirebase(file, path) {
    const [thumb, small, large] = await Promise.all([
        resizeImage(file, 200),
        resizeImage(file, 800),
        resizeImage(file, 1600)
    ])

    await Promise.all([
        uploadBytes(ref(storage, `${path}/thumb.webp`), thumb),
        uploadBytes(ref(storage, `${path}/small.webp`), small),
        uploadBytes(ref(storage, `${path}/large.webp`), large)
    ])
}

export async function downloadImageFromFirebase(path) {
    return await Promise.all([
        getDownloadURL(ref(storage, `${path}/thumb.webp`)),
        getDownloadURL(ref(storage, `${path}/small.webp`)),
        getDownloadURL(ref(storage, `${path}/large.webp`))
    ])
}

export function deleteImageFromFirebase(path) {
    deleteObject(ref(storage, path))
}

export async function deleteFolderFromFirebase(path) {
    const fileList = await listAllDirectoryFiles(path)

    await Promise.all(
        fileList.items.map(fileRef => deleteObject(fileRef))
    )
}

export function listAllDirectoryFiles(path) {
    const listRef = ref(storage, path)

    return listAll(listRef)
}