import PropTypes from 'prop-types';
import React from 'react';

function Label({id, name, label, className, disabled, ref, required}) {

    let reqd;
    if(required) {
        reqd = '*';
    } else {
        reqd = '';
    }

    return (
        <div className={`lbl ${className}`}>
            <label>
                {label}
                <span className="required">{reqd}</span>
            </label>
        </div>
    )
}

Label.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ref: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool
};

Label.defaultProps = {
    label: '',
    className: '',
    required: true
};

export default Label;