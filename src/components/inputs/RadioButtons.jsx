export default function RadioButtons({data, setData, name, values}) {
    return (
        <div className="input_radio_container">
            {values.map(item => 
                <div key={item.id}>
                    <input 
                        className="input_radio"
                        onChange={() => setData((
                            {
                                ...data, 
                                [name]: item.id
                            }
                        ))} 
                        type="radio" 
                        id={item.id} 
                        checked={data.type === item.id}
                        value={item.id} 
                        name={name}
                    />
                    <label 
                        className={data[name] === item.id ? "input_radio_label radio_checked" : "input_radio_label"}
                        htmlFor={item.id}
                    >
                        {item.display}
                    </label>
                </div>
            )}
        </div>
    )
}