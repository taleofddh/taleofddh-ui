'use strict';

import React, { useState } from 'react';
import {Link, NavLink} from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';
import Icon from "../common/icon";
import '../../scss/components/responsivenavigation.scss';

function ResponsiveNavigation(props) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleStateChange = (state) => {
        setMenuOpen(state.isOpen);
    }

    const closeMenu = (clickEvent) => {
        setMenuOpen(false);
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }


    return (
        <div className="mobilemenuwrapper" id="outer-container">
            <div className="right">
                <Menu right={true}
                      outerContainerId="outer-container"
                      width="280px"
                      burgerButtonClassName="burger-button"
                      burgerBarClassName="burger-bars"
                      crossButtonClassName="cross-button"
                      crossClassName="cross"
                      menuClassName="menu"
                      morphShapeClassName="morph-shape"
                      itemListClassName="item-list"
                      overlayClassName="overlay"
                      isOpen={menuOpen}
                      onStateChange={(state) => handleStateChange(state)}>
                    {props.menus.map((item) => {
                        return (
                            <label key={item.id} className="itemwrapper" onClick={closeMenu}>
                                <HamnburgerMenuItem menu={item} onClick={closeMenu}/>
                            </label>
                        )
                    })}
                </Menu>
            </div>
        </div>
    )

}

function HamnburgerMenuItem(props) {
    //var isActive = this.props.location.pathname === this.props.menu.link;
    var activeClassName;
    if(props.menu.link === '#') {
        activeClassName = '';
    } else {
        activeClassName = 'activeitem'
    }
    let exact = {};
    if(props.menu.link === '/') {
        exact = {"exact": true};
    }

    return (
        <>
            {props.menu.external ? (
                <a href={props.menu.link} className="item">
                    <p className="menuitem">
                        <span className="menuitemicon">
                            <Icon name={props.menu.icon} fill="#431C5D" />
                        </span>
                        <span className="menuitemname">
                            &nbsp;&nbsp;&nbsp;
                            {props.menu.name}
                        </span>
                    </p>
                </a>
            ) : (
                <NavLink to={props.menu.link} aria-current="page" {...exact} activeClassName={activeClassName} className="item">
                    <p className="menuitem">
                        <span className="menuitemicon">
                            <Icon name={props.menu.icon} fill="#431C5D" />
                        </span>
                        <span className="menuitemname">
                            &nbsp;&nbsp;&nbsp;
                            {props.menu.name}
                        </span>
                    </p>
                </NavLink>
            )}
        </>
    )

}

export default ResponsiveNavigation;