import PropTypes from 'prop-types';
import React, { useState } from 'react';

function TypeInput({id, name, className, countryCode, disabled, initialValue, label, max, maxLength, min, note, onChange, onKeyDown, onSelect,
                       pattern, placeHolder, ref, required, size, type, title}) {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState(initialValue);

    const [keyDown, setKeyDown] = useState(true);

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    const onKeyedDown = (e) => {
        if(e.target.type === 'number') {
            setKeyDown(false);
        }
    }

    const handleChange = (event) => {
        onChange && onChange(event);
        setValue(event.target.value);
    }

    let reqdText;
    if(required) {
        reqdText = '*';
    } else {
        reqdText = '';
    }

    let noteText;
    if(note) {
        noteText = <label className="inputnote">{'(' + note + ')'}</label>;
    } else {
        noteText = <></>
    }

    return (
        <p className={`type ${className}`}>
            <label>
                {label}
                <span className="required">{reqdText}</span>
            </label>
            {noteText}
            <input
                type={type}
                id={id}
                name={name}
                ref={ref}
                placeholder={placeHolder}
                min={min}
                max={max}
                maxLength={maxLength}
                disabled={disabled}
                required={required}
                value={value}
                pattern={pattern}
                title={title}
                size={size}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyedDown}
                onChange={handleChange} />
        </p>
    )
}

TypeInput.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ref: PropTypes.string,
    label: PropTypes.string,
    note: PropTypes.string,
    placeHolder: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    min: PropTypes.string,
    max: PropTypes.string,
    maxLength: PropTypes.number,
    initialValue: PropTypes.string,
    value: PropTypes.string,
    pattern: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    onChange: PropTypes.func
};

TypeInput.defaultProps = {
    label: '',
    placeHolder: '',
    className: '',
    required: true,
    initialValue: '',
    value: '',
    title: 'Please match the requested format',
    size: '50',
    onChange: () => {}
};

export default TypeInput;