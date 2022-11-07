import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Button({id, name, type, ref, label, title, className, disabled, onClick}) {
    const [focused, setFocused] = useState(false);

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    const handleClick = (event) => {
        onClick && onClick(event);
    }

    return (
        <button id={id}
                name={name}
                ref={ref}
                defaultValue={label}
                className={`btn ${className}`}
                title={title}
                type={type}
                disabled={disabled}
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={handleClick}>
            {label}
        </button>
    )
}

Button.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    ref: PropTypes.string,
    label: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

Button.defaultProps = {
    label: '',
    title: '',
    onClick: () => {},
    className: '',
    disabled: false
};

export default Button;