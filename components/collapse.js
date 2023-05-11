import React, {useState} from 'react';
import Icon from "../common/icon";
import PropTypes from "prop-types";

const arrowPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' +
    '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' +
    '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' +
    '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

function Collapse({id, required, header, content, iconOpen, iconClose, className, onChange}) {
    const [expanded, hasExpanded] = useState(false);
    const [focused, setFocused] = useState(false);

    const onFocus = () => {
        setFocused(true);
    }

    let reqdText;
    if(required) {
        reqdText = '*';
    } else {
        reqdText = '';
    }

    const onHandleClick = (expanded) => {
        hasExpanded(!expanded);
        if(onChange) onChange && onChange(expanded);
    }

    return (
        <div id={id}
             className={`collapse ${className}`}>
            <label
                 onClick={(e) => onHandleClick(expanded)}>
                {(iconOpen && iconClose) ? (
                    <i style={{ marginRight: '.5rem' }}>
                        {expanded ? (
                            <Icon name={iconOpen} width="2rem" height="2rem" fill="rgb(248, 215, 117)" />
                        ) : (
                            <Icon name={iconClose} width="2rem" height="2rem" fill="rgb(248, 215, 117)" />
                        )}
                    </i>
                ) : (
                    <i style={{ marginRight: '.5rem' }}>
                        <svg
                            viewBox="0 0 1024 1024"
                            width="1rem"
                            height="1rem"
                            fill="currentColor"
                            style={{
                                verticalAlign: '-.125rem',
                                transition: 'transform .2s',
                                transform: `rotate(${expanded ? 90 : 0}deg)`,
                            }}
                        >
                            <path d={arrowPath} p-id="5827"></path>
                        </svg>
                    </i>
                )}
                {header}
            </label>
            <div>
                {expanded ? content : <></>}
            </div>
        </div>
    )
}

Collapse.propTypes = {
    id: PropTypes.string,
    header: PropTypes.string.isRequired,
    ref: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    content: PropTypes.string,
    onClick: PropTypes.func,
    index: PropTypes.number,
    iconOpen: PropTypes.string,
    iconClose: PropTypes.string
};

Collapse.defaultProps = {
    label: '',
    className: '',
    disabled: false,
    required: false,
    content: '',
    onClick: () => {},
    iconOpen: '',
    iconClose: ''
};


export default Collapse;