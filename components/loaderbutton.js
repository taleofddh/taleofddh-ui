import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsArrowRepeat } from "react-icons/bs";

function LoaderButton({id, name, ref, title, type, icon, label, className, disabled, onClick, isLoading}) {
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
    let iconSymbol
    if(icon) {
        iconSymbol =
            <>
                <FontAwesomeIcon icon={['fab', icon]} />&nbsp;&nbsp;
            </>
    }

    return (
        <div
            tabIndex={0}
            id={id}
            name={name}
            ref={ref}
            defaultValue={label}
            className={`loaderbutton ${className}`}
            title={title}>
            <button type={type}
                    disabled={disabled || isLoading}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onClick={handleClick}>
                {isLoading && <BsArrowRepeat className="spinning" />}
                {iconSymbol}{label}
            </button>
        </div>
    )
}

LoaderButton.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ref: PropTypes.string,
    label: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    isLoading: PropTypes.bool
};

LoaderButton.defaultProps = {
    label: '',
    title: '',
    onClick: () => {},
    className: '',
    disabled: false
};

export default LoaderButton;