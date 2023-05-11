import React from 'react';
import Link from 'next/link';
import {getSessionCookie, getSessionStorage, removeSessionCookie, useSessionContext} from "../common/session";
import Icon from "../common/icon";

function Header({country, menus, onLogout}) {
    const { isAuthenticated, userHasAuthenticated } = useSessionContext();
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    let countryCode;
    if(country.country_code !== undefined) {
        countryCode = country.country_code;
    } else if(Object.keys(ddhomeCountry).length !== 0 || ddhomeCountry.constructor !== Object) {
        countryCode = ddhomeCountry.country_code;
    } else {
        let geolocationData = getSessionStorage('geolocation');
        countryCode = geolocationData.country_code;
    }

    const handleLogout = async () => {
        userHasAuthenticated(false);
        onLogout();
    }

    return (
        <div className="headerbar">
            <div className="container">
                <div className="header">
                    <div className="taleofddhlogo">
                        <Link href='/home' as='/'>
                            <img src="/images/taleofddh-banner.png" alt="TaleofDDH Banner"/>
                        </Link>
                    </div>
                    <Links menus={menus} isAuthenticated={isAuthenticated} onLogout={handleLogout}/>
                </div>
            </div>
        </div>
    )

}

function DDHomeLanguage({country}) {
    return (
        <div className="visitorlanguage">
            <label className="headertext">
                <img src="/images/icon-english.png" alt="English" />&nbsp;&nbsp;
            </label>
        </div>
    )
}

function Links({menus, isAuthenticated, onLogout}) {
    let count = 0;
    let separator;

    const handleClick = (event) => {
        event.preventDefault();
        onLogout() && onLogout(event)
    }

    let menuList = menus.map((item, index) => {
        if(item.position === 'Header') {
            let menu;
            if(count > 1) {
                separator =  '   |   ';
            }
            if(isAuthenticated) {
                if(item.name === 'Sign-in') {
                    menu =
                        <></>
                } else if (item.name === 'My Profile') {
                    menu =
                        <span key={index} className="headericon">
                            {separator}
                            <Link href={item.link.replace(/-/g, '')} as={item.link}>
                                <Icon name={item.icon} fill="#FFFFFF" />
                            </Link>
                        </span>

                } else if (item.name === 'Sign-out') {
                    menu =
                        <span key={index} className="headertext" style={{cursor: 'pointer'}} onClick={handleClick}>
                            {separator}
                            {item.name}
                        </span>
                } else {
                    menu =
                        <span key={index} className="headertext">
                            <Link href={item.link.replace(/-/g, '')} as={item.link}>
                                    {separator}
                                    {item.name}
                            </Link>
                        </span>
                }

            } else {
                if (item.name === 'My Profile') {
                    menu =
                        <></>
                } else if (item.name === 'Sign-out') {
                    menu =
                        <></>
                }  else {
                    menu =
                        <span key={index} className="headertext">
                            {separator}
                            <Link href={item.link.replace(/-/g, '')} as={item.link}>
                                    {item.name}
                            </Link>
                        </span>
                }
            }
            count++
            return (
                <label key={index} style={{display: 'inline'}}>
                    {menu}
                </label>
            )
        }
    });

    return (
        <div className="links">
            <label className="visitorlanguage">
                <img src="/images/icon-english.png" alt="English" />&nbsp;&nbsp;
            </label>
            {menuList}
        </div>
    )
}

export default Header;