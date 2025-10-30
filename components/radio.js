import PropTypes from 'prop-types';
import React, { useState } from 'react';

function Radio({type = 'radio', id, name, checked = false, className = '', ref, label = '', disabled, required = false, value = '', onChange = () => {}}) {
    const [focused, setFocused] = useState(false);

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    const handleChange = (event) => {
        onChange && onChange(event);
    }

    let reqdText;
    if(required) {
        reqdText = '*';
    } else {
        reqdText = '';
    }

    return (
        <p className={`radio ${className}`}>
            <label className="radioboxlabel">
                <span className="radioboxtext">{label}</span>
                <span className="required">{reqdText}</span>
                <input
                    type={type}
                    id={id}
                    name={name}
                    ref={ref}
                    disabled={disabled}
                    required={required}
                    value={value}
                    checked={checked}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange} />
                <span className="radiobox" />
            </label>
        </p>
    )
}

Radio.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ref: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    value: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

export default Radio;