import { format, parseISO } from "date-fns"
import imageCompression from "browser-image-compression"
import { queryFirebaseDoc } from "./firebase/firestore"

export function toEnglishChars(string) {
    return string
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

export async function checkUsername(field, username) {
    const usernameMatch = await queryFirebaseDoc("profiles", field, username)
    return usernameMatch?.id
}

export function toDateParam(date) {
    const d = date instanceof Date ? date : new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}
export function filterFromSearchParams(params) {
    const city = params.get("city")
    const country = params.get("country")
    const dateFrom = params.get("dateFrom")
    const dateTo = params.get("dateTo")

    const result = {}
    if (city && country) {
        result.locations = [{ city, country }]
    }
    if (dateFrom) result.from = parseISO(dateFrom)
    if (dateTo) result.to = parseISO(dateTo)

    return result
}
export function filterToSearchParams(activeFilter) {
    const params = {}
    if (activeFilter?.locations?.[0]) {
        params.city = activeFilter.locations[0].city
        params.country = activeFilter.locations[0].country
    }
    if (activeFilter?.from) params.dateFrom = toDateParam(activeFilter.from)
    if (activeFilter?.to) params.dateTo = toDateParam(activeFilter.to)
    return params
}

export function translateDates(dateFrom, dateTo) {

    const fromDay = format(dateFrom, "d")
    const fromMonth = format(dateFrom, "MMM")
    const fromYear = format(dateFrom, "yyyy")

    const toDay = format(dateTo, "d")
    const toMonth = format(dateTo, "MMM")
    const toYear = format(dateTo, "yyyy")

    let dateRange
    if (fromYear !== toYear) {
        dateRange = `${fromMonth} ${fromDay}, ${fromYear} - ${toMonth} ${toDay}, ${toYear}`
    }
    if (fromYear === toYear) {
        dateRange = `${fromMonth} ${fromDay} - ${toMonth} ${toDay}, ${fromYear}`
    }
    if (fromMonth === toMonth && fromYear === toYear) {
        dateRange = `${fromMonth} ${fromDay} - ${toDay}, ${fromYear}`
    }
    if (fromDay === toDay && fromMonth === toMonth && fromYear === toYear) {
        dateRange = `${fromMonth} ${fromDay}, ${fromYear}`
    }

    return dateRange
}

export async function resizeImage(file, maxRes) {

  return imageCompression(file, {
    maxWidthOrHeight: maxRes,
    maxSizeMB: 1,
    fileType: "image/webp",
    useWebWorker: true,
  })
}

export function checkErrorMessage(error) {
    if (error.message === "Firebase: Error (auth/invalid-credential).") {
        return "Incorrect email or password."
    } else if (error.message === "Firebase: Error (auth/network-request-failed).") {
        return "Please check your internet connection."
    } else if (error.message === "Firebase: Error (auth/invalid-email).") {
        return "Please check your email address."
    } else if (error.message === "Firebase: Error (auth/missing-password).") {
        return "Please check your password."
    } else if (error.message === "Firebase: Error (auth/missing-email).") {
        return "Please check your email address."
    } else if (error.message === "Firebase: Error (auth/too-many-requests).") {
        return "Please try again in a few seconds."
    } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
        return "Password should be at least 6 characters."
    } else if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        return "Account with this email already exists."
    } else if (error.message.includes("profile.webp' does not exist.")) {
        return "No profile picture"
    } else if (error.message.includes("Firebase: Error (auth/requires-recent-login).")) {
        return "Please re-log in and try again."
    } else if (
        error.message === "Firebase: Error (auth/internal-error)."
        || error.message === "Firebase: Error (auth/popup-closed-by-user)."
        || error.message === "Firebase: Error (auth/cancelled-popup-request)."
    ) {
        return "Something went wrong. Please try again."
    } 
    else return error.message
}