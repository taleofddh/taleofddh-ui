'use strict';

import React from 'react';
import {Link, NavLink} from "react-router-dom";
import Icon from "../common/icon";
import 'scss/components/navigation.scss'

function Navigation(props) {
    let menus = props.menus.map((item) => {
        if(item.type === 'All') {
            return (
                <MenuItem key={item.id} menu={item} />
            )
        }
    });

    return (
        <div className="menubar">
            <div className="container">
                <div className="tabwrapper">
                    <nav id="page-nav">
                        <ul>
                            {menus}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}

function MenuItem(props) {
    var activeClassName;
    if(props.menu.link === '#') {
        activeClassName = '';
    } else {
        activeClassName = 'activetab'
    }

    return (
        <li>
            {props.menu.external ? (
                <a target="blank" href={props.menu.link}>
                    <p className="menuicon">
                        <Icon name={props.menu.icon} fill="#FFFFFF" />
                    </p>
                    {props.menu.name}
                </a>
            ) : (
                <NavLink to={props.menu.link} activeClassName={activeClassName} >
                    <p className="menuicon">
                        <Icon name={props.menu.icon} fill="#FFFFFF" />
                    </p>
                    {props.menu.name}
                </NavLink>
            )}

        </li>
    )
}

export default Navigation;