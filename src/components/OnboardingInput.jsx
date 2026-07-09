import { useState, useEffect, useContext } from "react"
import { User, AtSign } from "lucide-react"
import { UserContext } from "../App"
import { getCollectionFromFirebase, downloadImageFromFirebase, listAllDirectoryFiles } from "../utils"
import { questionsArtist } from "../onboardingQuestions"

import RadioButtons from "./fields/RadioButtons"
import TextShort from "./fields/TextShort"
import ImageGallery from "./fields/ImageGallery"
import ProfileImage from "./fields/ProfileImage"
import Combobox from "./fields/Combobox"
import TextLong from "./fields/TextLong"

export default function OnboardingInput({currentQuestion, profile, setProfile}) {

    const { user } = useContext(UserContext)

    const [profilePic, setProfilePic] = useState(null)
    const [gallery, setGallery] = useState([])
    const [locations, setLocations] = useState([])

    const profileTypes = [{display: "Tattoo artist", id: "artist"}, {display: "Tattoo studio", id: "studio"}]

    const profileNameIcon = <User className="input-icon icon-16px" />
    const instagramIcon = <AtSign className="input-icon icon-14px" />

    useEffect(() => {
        getCollectionFromFirebase("locations")
            .then(data => setLocations(data))

        async function getImageGalleryFromFirebase() {
            
            const dirPath = `users/${user.uid}/portfolio`

            try {
                const userFiles = await listAllDirectoryFiles(dirPath)
                for (let i = 0; i < userFiles.items.length; i++) {
                    const filePath = userFiles.items[i]._location.path
                    const itemId = filePath.replace(`users/${user.uid}/portfolio/`, "")
                    const imageUrl = await downloadImageFromFirebase(filePath)
                    setGallery(prev => [{image: imageUrl, id: itemId}, ...prev])
                }
            } catch (error) {
                console.error(error.message)
            }
        }

        async function getProfileImageFromFirebase() {

            const path = `users/${user.uid}/profile.webp`

            try {
                const imageUrl = await downloadImageFromFirebase(path)
                setProfilePic(imageUrl)
            } catch (error) {
                console.error(error.message)
            }
        }

        getImageGalleryFromFirebase()
        getProfileImageFromFirebase()
    }, [])

    let questionInput
        if (!questionsArtist[currentQuestion].input) {
            questionInput = null
        } else if (questionsArtist[currentQuestion].input === "type") {
            questionInput = <RadioButtons data={profile} setData={setProfile} name="type" values={profileTypes}/>
        } else if (questionsArtist[currentQuestion].input === "name") {
            questionInput = <TextShort data={profile} setData={setProfile} name="name" label="Name / pseudonym" icon={profileNameIcon}/>
        } else if (questionsArtist[currentQuestion].input === "city") {
            questionInput = <Combobox data={profile} setData={setProfile} itemList={locations}/>
        } else if (questionsArtist[currentQuestion].input === "instagram") {
            questionInput = 
                <>
                    <TextShort data={profile} setData={setProfile} name="instagram" label="Instagram username" icon={instagramIcon}/>
                    <p>Preview: {"instagram.com/" + (profile.instagram || "")}</p>
                </>
        } else if (questionsArtist[currentQuestion].input === "bio") {
            questionInput = <TextLong data={profile} setData={setProfile} name="bio" label="Profile bio"/>
        } else if (questionsArtist[currentQuestion].input === "portfolio") {
            questionInput = <ImageGallery gallery={gallery} setGallery={setGallery}/>
        } else if (questionsArtist[currentQuestion].input === "profileImage") {
            questionInput = <ProfileImage profilePic={profilePic} setProfilePic={setProfilePic} />
        }

    return questionInput
}