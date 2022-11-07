import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CheckBox({type, id, name, ref, label, className, disabled, required, initialState, value, specialText, onChange}) {
    const [focused, setFocused] = useState(false);
    const [checked, setChecked] = useState(!!initialState);

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    const handleChange = (event) => {
        onChange && onChange(event);
        setChecked(event.target.checked);
    }

    let styledClassName = 'styledcheckbox';
    let iconClassName = 'checkboxicon';
    if(focused === true) {
        styledClassName += ' focuscheckboxborder';
    }
    if(checked === true) {
        styledClassName += ' checkboxchecked';
        iconClassName += ' checkboxvisible';
    } else {
        styledClassName += ' checkboxunchecked';
        iconClassName += ' checkboxhidden';
    }

    let reqdText = required ? '*' : '';

    return (
        <p className={`check ${className}`}>
            <label className="checkboxlabel">
                <span className="checkboxtext">{label}</span>
                <span className="required">{reqdText}</span>
                <input // HiddenCheckbox
                    type='checkbox'
                    id={id}
                    name={name}
                    value={value}
                    disabled={disabled}
                    required={required}
                    checked={checked}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    className="hidecheckbox" />
                <span // StyledCheckbox
                    checked={checked}
                    className={styledClassName}>
                    <svg // Icon
                        viewBox='0 0 18 18'
                        className={iconClassName}>
                        <polyline points='15 4 7 12 3 9' />
                    </svg>
                </span>
            </label>
        </p>
    )
}

CheckBox.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ref: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    value: PropTypes.bool,
    initialState: PropTypes.bool,
    specialText: PropTypes.object,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

CheckBox.defaultProps = {
    type: 'checkbox',
    label: '',
    className: '',
    required: false,
    value: false,
    specialText: {},
    checked: false,
    onChange: () => {}
};

export default CheckBox;