import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../scss/components/button.scss';

function Button(props) {
    const [focused, setFocused] = useState(false);

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    const handleClick = (event) => {
        props.onClick && props.onClick(event);
    }

    return (
        <div
            tabIndex={0}
            id={props.id}
            name={props.name}
            ref={props.ref}
            defaultValue={props.label}
            className={`button ${props.className}`}
            title={props.title}>
            <button type={props.type}
                    disabled={props.disabled}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onClick={handleClick}>
                {props.label}
            </button>
        </div>
    )
}

Button.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
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