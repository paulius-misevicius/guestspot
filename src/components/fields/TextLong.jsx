export default function TextLong({data, setData, name, label}) {

    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <textarea 
                value={data[name] || ""}
                onChange={event => setData((
                    {
                        ...data,
                        [name]: event.target.value
                    }
                ))} 
                name={name}
                id={name}
                rows="5"
            />
        </div>
    )
}