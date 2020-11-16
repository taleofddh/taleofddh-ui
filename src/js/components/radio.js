'use strict';

import PropTypes from 'prop-types';
const React = require('react');
import '../../scss/components/radio.scss'
import {useState} from "react";

function Radio(props) {
    const [focused, setFocused] = useState(false);

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    const handleChange = (event) => {
        props.onChange && props.onChange(event);
    }

    let required;
    if(props.required) {
        required = '*';
    } else {
        required = '';
    }

    return (
        <div className={`radio ${props.className}`}>
            <label className="radioboxlabel">
                <span className="radioboxtext">{props.label}</span>
                <span className="required">{required}</span>
                <input
                    tabIndex={0}
                    type={props.type}
                    id={props.id}
                    name={props.name}
                    ref={props.ref}
                    disabled={props.disabled}
                    required={props.required}
                    value={props.value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange} />
                <span className="radiobox" />
            </label>
        </div>
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

Radio.defaultProps = {
    label: '',
    type: 'radio',
    className: '',
    required: false,
    value: '',
    checked: false,
    onChange: () => {}
};

export default Radio;