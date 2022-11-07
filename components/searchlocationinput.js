import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

function SearchLocationInput({id, name, className, countryCode, disabled, initialValue, label, max, maxLength, min, note, onChange, onKeyDown, onSelect,
                                 pattern, placeHolder, ref, required, size, type}) {
    const autoCompleteRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState(initialValue);
    let autoComplete;

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    useEffect(() => {
        if (typeof window.google !== 'undefined') {
            autoComplete = new window.google.maps.places.Autocomplete(
                autoCompleteRef.current,
                { types: ["geocode"], componentRestrictions: { country: countryCode } }
            );
            autoComplete.setFields(["formatted_address"]);
            autoComplete.addListener("place_changed", () => handlePlaceChanged(setValue));
        }
    }, []);

    const handlePlaceChanged = (updateValue) => {
        const place = autoComplete.getPlace();
        const value = place.formatted_address;
        console.log(place);
        updateValue(value);
        onSelect && onSelect(id, name, place.formatted_address);
    }

    const handleChange = (event) => {
        setValue(event.target.value);
        onChange && onChange(event);
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
                type='text'
                id={id}
                name={name}
                ref={autoCompleteRef}
                placeholder={placeHolder}
                disabled={disabled}
                required={required}
                value={value}
                pattern={pattern}
                size={size}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
            />
        </p>
    );
}

SearchLocationInput.propTypes = {
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
    size: PropTypes.string,
    onChange: PropTypes.func,
    countryCode: PropTypes.string
};

SearchLocationInput.defaultProps = {
    label: '',
    title: '',
    placeHolder: '',
    className: '',
    required: true,
    initialValue: '',
    value: '',
    size: '100',
    onChange: () => {}
};

export default SearchLocationInput;