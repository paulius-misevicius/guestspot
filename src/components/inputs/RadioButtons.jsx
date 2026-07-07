export default function RadioButtons({data, setData, values}) {
    return (
        <div className="input_radio_container">
            {values.map(item => 
                <div key={item.id}>
                    <input 
                        className="input_radio"
                        onChange={() => setData((
                            {
                                ...data, 
                                type: item.id
                            }
                        ))} 
                        type="radio" 
                        id={item.id} 
                        checked={data.type === item.id}
                        value={item.id} 
                        name="type"
                    />
                    <label 
                        className={data.type === item.id ? "input_radio_label radio_checked" : "input_radio_label"}
                        htmlFor={item.id}
                    >
                        {item.display}
                    </label>
                </div>
            )}
        </div>
    )
}