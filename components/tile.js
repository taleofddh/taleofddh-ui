import React, { useState } from 'react';
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ruler } from "../common/common";

function Tile({id, width, size, checked, className, disabled, icon, index, selectedItem, label, margin, onClick,
                  padding, parent, ref, required, value, sectionIndex}) {
    const [focused, setFocused] = useState(false);

    const onBlur = () => {
        setFocused(false);
    }

    const onFocus = () => {
        setFocused(true);
    }

    const handleClick = (index, name, parent, size, sectionIndex, clickEvent) => {
        clickEvent.preventDefault();
        onClick && onClick(index, name, parent, size, sectionIndex);
    }

    let reqdText;
    if(required) {
        reqdText = '*';
    } else {
        reqdText = '';
    }

    let activeClass = 'tile';
    if(disabled) {
        activeClass = activeClass + ' disabled';
    } else {
        //console.log(props.selectedItem);
        if(selectedItem.index === index && selectedItem.name === label) {
            activeClass = activeClass + ' highlight';
        } else {
            activeClass = activeClass + ' playdown';
        }
    }

    let iconText;
    if(icon) {
        iconText =
            <>
                &nbsp;&nbsp;<FontAwesomeIcon icon={icon} />
            </>
    }

    let marginVal = ruler(margin);
    let paddingVal = ruler(padding);

    return (
        <div id={id}
           className={activeClass}
           style={{
               width: width,
               marginTop: marginVal.top + 'px',
               marginRight: marginVal.right + 'px',
               marginBottom: marginVal.bottom + 'px',
               marginLeft: marginVal.left + 'px',
               paddingTop: paddingVal.top + 'px',
               paddingRight: paddingVal.right + 'px',
               paddingBottom: paddingVal.bottom + 'px',
               paddingLeft: paddingVal.left + 'px'}}
           onClick={(e) => handleClick(index, label, parent, size, sectionIndex, e)}>
            <span>{label}{iconText}</span>
        </div>
    )
}

Tile.propTypes = {
    id: PropTypes.string,
    width: PropTypes.string,
    margin: PropTypes.string,
    padding: PropTypes.string,
    label: PropTypes.string.isRequired,
    ref: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    value: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    index: PropTypes.number,
    size: PropTypes.number,
    parent: PropTypes.string,
    icon: PropTypes.string,
    selectedItem: PropTypes.object
};

Tile.defaultProps = {
    width: 'auto',
    margin: '5 0',
    padding: '10 0',
    label: '',
    className: '',
    disabled: false,
    required: false,
    value: '',
    checked: false,
    onClick: () => {},
    selectedItem: {}
};

export default Tile;