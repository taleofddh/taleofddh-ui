'use strict';

import React from 'react';
import {NavLink, Link} from "react-router-dom";
import '../../scss/components/header.scss'
import {getSessionCookie, getSessionStorage} from "../common/session";

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
    let menus = props.menus.map((item) => {
        let separator = '   |   ';
        if(item.position === 'Header') {
            count++
            return (
                item.external ?
                    <a href={item.link}>
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
                            <img src="/images/servease-banner-new.png" />
                        </NavLink>
                    </div>
                    <div className="signin">
                        <label className="signintext">
                            Sign-in
                        </label>
                    </div>
                    <div className="signinicon">
                        <img src="/images/icon-user-white.png" />
                    </div>
                </div>
            </div>
        </div>
    )

}

function DdhomeCountry(props) {
    return (
        <div className="visitorcountry">
            <label className="headertext">
                {'EN-' + props.countryCode}
                &nbsp;&nbsp;
                <img src={"/images/flags/" + props.countryCode + ".png"} />
            </label>
        </div>
    )
}

function Links(props) {
    return (
        <div className="links">
            <label className="headertext">
                {props.menus}
            </label>
        </div>
    )

}

export default Header;