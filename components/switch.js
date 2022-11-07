import React, { useState } from 'react';
import ReactSwitch from 'react-switch';

function Switch({id, name, onChange, initialState, onClick}) {
    const [checked, setChecked] = useState(!!initialState);

    const handleChange = (checked, changeEvent, id) => {
        onChange && onChange(id, name, checked);
        setChecked(checked);
    }

    const handleClick = (checked) => {
        onClick && onClick(checked);
        setChecked(checked);
    }

    return (
        <label>
            <ReactSwitch
                id={id}
                onChange={handleChange}
                checked={checked}
                className="react-switch"
                onColor="#e05915"
                height={24}
                width={48}
            />
        </label>
    )
}

export default Switch;