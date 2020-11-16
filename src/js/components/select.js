'use strict';

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import 'scss/components/select.scss';

function Select(props) {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState(props.defaultOption.choice);

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    const handleChange = (event) => {
        props.onChange && props.onChange(event);
        setValue(event.target.value);
    }

    let required;
    if(props.required) {
        required = '*';
    } else {
        required = '';
    }

    let defaultOption;
    if(props.defaultOption) {
        defaultOption =
            <option key={props.defaultOption.sequence} value={props.defaultOption.choice}>
                {props.defaultOption.choice}
            </option>
    }

    let options = props.options.map((item) =>
        <option key={item.sequence} value={item.choice}>
            {item.choice}
        </option>
    );

    return (
        <div className={`select ${props.className}`}>
            <label className="selectlabel">
                {props.label}
                <span className="required">{required}</span>
                <select
                    tabIndex={0}
                    id={props.id}
                    name={props.name}
                    ref={props.ref}
                    disabled={props.disabled}
                    required={props.required}
                    value={value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}>
                    {defaultOption}
                    {options}
                </select>
            </label>
        </div>
    )
}

Select.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ref: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    value: PropTypes.string,
    defaultOption: PropTypes.object,
    options: PropTypes.array,
    onChange: PropTypes.func
};

Select.defaultProps = {
    label: '',
    className: '',
    required: false,
    value: '',
    options: [],
    onChange: () => {}
};

export default Select;