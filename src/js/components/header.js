'use strict';

import React from 'react';
import {NavLink, Link} from "react-router-dom";
import {getSessionCookie, getSessionStorage} from "../common/session";
import Icon from "../common/icon";
import FunnyQuote from "./funnyquote";
import '../../scss/components/header.scss'

function Header(props) {
    let count = 0;
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    let countryCode;
    if(props.country.country_code !== undefined) {
        countryCode = props.country.country_code;
    } else if(Object.keys(ddhomeCountry).length !== 0 || ddhomeCountry.constructor !== Object) {
        countryCode = ddhomeCountry.country_code;
    } else {
        let geolocationData = getSessionStorage('geolocation');
        countryCode = geolocationData.country_code;
    }
    console.log(props.menus)
    let menusIcon = props.menus.map((item) => {
        let separator = '   |   ';
        if(item.position === 'Header') {
            count++
            return (
                item.external ?
                    <a target="blank" href={item.link}>
                        {count > 1 ? (
                            <>
                                {separator}
                                <p className="headericon">
                                    <Icon name={item.icon} fill = "#FFFFFF" />
                                </p>
                            </>
                        ) : (
                            <p className="headericon">
                                <Icon name={item.icon} fill = "#FFFFFF" />
                            </p>
                        )}
                    </a>
                :
                    <NavLink key={item.id} to={item.link}>
                        {count > 1 ? (
                            <>
                                {separator}
                                <p className="headericon">
                                    <Icon name={item.icon} fill = "#FFFFFF" />
                                </p>
                            </>
                        ) : (
                            <p className="headericon">
                                <Icon name={item.icon} fill = "#FFFFFF" />
                            </p>
                        )}
                    </NavLink>
            )
        }
    });
    count = 0;
    let menusText = props.menus.map((item) => {
        let separator = '   |   ';
        if(item.position === 'Header') {
            count++
            return (
                item.external ?
                    <a target="blank" href={item.link}>
                        {count > 1 ? separator + item.name : item.name}
                    </a>
                :
                    <NavLink key={item.id} to={item.link}>
                        {count > 1 ? separator + item.name : item.name}
                    </NavLink>
            )
        }
    });

    return (
        <div className="headerbar">
            <div className="container">
                <div className="header">
                    <div className="serveaselogo">
                        <NavLink to="/">
                            <img src="/images/taleofddh-banner.png" />
                        </NavLink>
                    </div>
                    <div className="signin">
                        <label className="signintext">
                            {menusText}
                        </label>
                    </div>
                    <div className="signinicon">
                        {menusIcon}
                    </div>
                </div>
            </div>
        </div>
    )

}

function DDHomeLanguage(props) {
    return (
        <div className="visitorlanguage">
            <label className="headertext">
                <img src="/images/icon-english.png" alt="English" />&nbsp;&nbsp;
            </label>
        </div>
    )
}

function Links(props) {
    return (
        <div className="links">
            <label className="visitorlanguage">
                <img src="/images/icon-english.png" alt="English" />&nbsp;&nbsp;
            </label>
            <label className="headertext">
                {props.menus}
            </label>
        </div>
    )
}

export default Header;