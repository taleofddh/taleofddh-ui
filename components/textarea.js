import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TextArea({id, name, className = '', cols = 70, disabled, initialValue = '', label, value, maxLength, note = '', onChange = () => {}, placeHolder ='', ref,
                      required = true, rows = 3, title =''}) {
    const [focused, setFocused] = useState(false);
    //const [value, setValue] = useState(initialValue);

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    const handleChange = (event) => {
        onChange && onChange(event);
        //setValue(event.target.value);
    }

    let reqdText;
    if(required) {
        reqdText = '*';
    } else {
        reqdText = '';
    }

    let noteText;
    if(note) {
        noteText = <label className="textnote">{'(' + note + ')'}</label>;
    } else {
        noteText = <></>
    }

    return (
        <p className={`text ${className}`}>
            <label>
                {label}
                <span className="required">{reqdText}</span>
            </label>
            {noteText}
            <textarea
                id={id}
                name={name}
                ref={ref}
                placeholder={placeHolder}
                maxLength={maxLength}
                disabled={disabled}
                required={required}
                rows={rows}
                cols={cols}
                title={title}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange} />
        </p>
    )
}

TextArea.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ref: PropTypes.string,
    label: PropTypes.string,
    title: PropTypes.string,
    placeHolder: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number,
    cols: PropTypes.number,
    maxLength: PropTypes.number,
    initialValue: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default TextArea;