import Combobox from "../../../../components/fields/Combobox"

export default function Location({profile, setProfile, locations}) {
    return (
        <>
            <h1>Where are you based?</h1>
            <p>This will let studios know where you're coming from.</p>
            <Combobox data={profile} setData={setProfile} itemList={locations}/>
        </>
    )
}