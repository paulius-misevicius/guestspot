import { format } from "date-fns"

export function toEnglishChars(string) {
    return string
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
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
        return "Please check your email."
    } else if (error.message === "Firebase: Error (auth/too-many-requests).") {
        return "Please try again in a few seconds."
    } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
        return "Password should be at least 6 characters."
    } else if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        return "Account with this email already exists."
    } else if (error.message.includes("profile.webp' does not exist.")) {
        return "No profile picture"
    } else if (
        error.message === "Firebase: Error (auth/internal-error)."
        || error.message === "Firebase: Error (auth/popup-closed-by-user)."
        || error.message === "Firebase: Error (auth/cancelled-popup-request)."
    ) {
        return "Something went wrong. Please try again."
    } 
    else return error.message
}