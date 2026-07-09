export default function TextShort({data, setData, name, label, icon}) {

    return (
        <div className="auth_field">
            <label htmlFor={name}>{label}</label>
            <div className="input-container">
                {icon}
                <input 
                    value={data[name] || ""}
                    onChange={event => setData((
                        {
                            ...data,
                            [name]: event.target.value
                        }
                    ))} 
                    name={name} 
                    id={name} 
                    type="text" 
                />
            </div>
        </div>
    )
}