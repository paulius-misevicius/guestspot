import { useContext, useState, useEffect } from "react"
import { User, AtSign } from "lucide-react"
import { questionsArtist } from "../onboardingQuestions"
import { UserContext } from "../App"
import { getCollectionFromFirebase, downloadImageFromFirebase, listAllDirectoryFiles } from "../utils"

import RadioButtons from "../components/inputs/RadioButtons"
import TextShort from "../components/inputs/TextShort"
import ImageGallery from "../components/inputs/ImageGallery"
import ProfileImage from "../components/inputs/onboarding/ProfileImage"
import Combobox from "../components/inputs/Combobox"
import TextLong from "../components/inputs/TextLong"

export default function Onboarding() {

    const { user } = useContext(UserContext)

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [profile, setProfile] = useState({userId: user.uid})
    const [profilePic, setProfilePic] = useState(null)
    const [gallery, setGallery] = useState([])
    const [locations, setLocations] = useState([])

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

    function nextQuestion() {
        setCurrentQuestion(prev => prev + 1)
    }
    function previousQuestion() {
        setCurrentQuestion(prev => prev - 1)
    }

    function submitAnswer(event) {
        event.preventDefault()
        nextQuestion()
    }
    console.log(profile)
    const startButton =
        <button type="button" className="onboarding_navigation_btn" onClick={nextQuestion}>Get started</button>

    const backButton = 
        <button type="button" className="onboarding_navigation_btn" onClick={previousQuestion}>Back</button>

    const nextButton = 
        <button type="submit" className="onboarding_navigation_btn">{currentQuestion === (questionsArtist.length - 1) ? "Finish" : "Continue"}</button>


    const profileTypes = [{display: "Tattoo artist", id: "artist"}, {display: "Tattoo studio", id: "studio"}]
    const profileNameIcon = <User className="input-icon icon-16px" />
    const instagramIcon = <AtSign className="input-icon icon-14px" />

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

    return (
        <div className="onboarding">
            <section className="onboarding_left">
                <h2>Find studios or artists for guestspotting across Europe.</h2>
                <p>Ensure a good first impression by building out your profile.</p>
            </section>
            <form onSubmit={submitAnswer} className="onboarding_right">
                <h1>{questionsArtist[currentQuestion].title}</h1>
                <p>{questionsArtist[currentQuestion].description}</p>

                {questionInput}

                <div className="onboarding_navigation">
                    {currentQuestion > 0 && backButton}
                    {currentQuestion > 0 && nextButton}
                    {currentQuestion === 0 && startButton}
                </div>
            </form>
        </div>
    )
}