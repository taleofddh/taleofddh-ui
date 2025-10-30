import PropTypes from 'prop-types';
import React, { useState } from 'react';

function Select({id, name, ref, label = '', value, note, className = '', disabled, required = false, defaultOption, options = [], initialValue, onChange = () => {}}) {
    const [focused, setFocused] = useState(false);
    //const [value, setValue] = useState(initialValue ? initialValue : defaultOption.choice);

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
        noteText = <label className="selectnote">{'(' + note + ')'}</label>;
    } else {
        noteText = <></>
    }

    let defaultChoice;
    if(defaultOption) {
        defaultChoice =
            <option key={defaultOption.sequence} value={defaultOption.value}>
                {defaultOption.hasOwnProperty('label') ? (
                    defaultOption.label
                ) : (
                    defaultOption.value
                )}
            </option>
    }

    let optionList = options.map((item) =>
        <option key={item.sequence} value={item.value}>
            {item.hasOwnProperty('label') ? (
                item.label
            ) : (
                item.value
            )}
        </option>
    );

    let defaultValue;
    if(initialValue) {
        defaultValue = {defaultValue : initialValue};
    }

    return (
        <p className={`select ${className}`}>
            <label className="selectlabel">
                {label}
                <span className="required"> {reqdText}</span>
            </label>
            {noteText}
            <select
                tabIndex={0}
                id={id}
                name={name}
                ref={ref}
                disabled={disabled}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}>
                {defaultChoice}
                {optionList}
            </select>
        </p>
    )
}

Select.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ref: PropTypes.string,
    label: PropTypes.string,
    note: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    initialValue: PropTypes.string,
    value: PropTypes.string,
    defaultOption: PropTypes.object,
    options: PropTypes.array,
    onChange: PropTypes.func
};

export default Select;